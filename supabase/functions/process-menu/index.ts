import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { enrichMenuWithArasaac } from "../_shared/arasaac.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation constants
const MAX_IMAGE_SIZE = 10_000_000; // 10MB
const VALID_IMAGE_FORMAT = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/]+=*$/;

const EVIDENCE_STOP_WORDS = new Set([
  'the', 'and', 'with', 'for', 'to', 'from', 'of', 'a', 'an', 'or', 'menu', 'item',
  'עם', 'בלי', 'של', 'את', 'או', 'אל', 'על',
]);

const normalizeValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const ICE_CREAM_ALLOWED_ITEM_TERMS = [
  'גליד', 'טעם', 'סורבה', 'יוגורט', 'וניל', 'שוקולד', 'פיסטוק', 'תות', 'מנגו', 'לימון', 'קרמל', 'קפה',
  'נוצלה', 'נוצ׳לה', 'חלווה', 'אגוז', 'צנובר', 'מסקרפונה', 'פירות יער', 'קרמבל', 'בייליס', 'אפרול', 'אוזו',
  'cone', 'cup', 'flavor', 'flavour', 'gelato', 'ice cream', 'sorbet', 'yogurt', 'vanilla', 'chocolate',
  'pistachio', 'strawberry', 'mango', 'lemon', 'caramel', 'coffee', 'hazelnut', 'berries', 'mascarpone',
  'topping', 'sprinkle', 'waffle', 'cookie', 'nuts', 'sauce', 'crumble', 'serving', 'cone', 'cup',
  'גביע', 'כוס', 'קונוס', 'תוספ', 'סוכר', 'אגוז', 'רטב', 'קצפת', 'שברי', 'אפרופו',
];

const ICE_CREAM_ALLOWED_CATEGORY_TERMS = [
  'גליד', 'טעמ', 'תוספ', 'סורבה', 'יוגורט', 'גביע', 'כוס', 'קונוס', 'רטב', 'שדרוג', 'serving', 'flavor',
  'flavour', 'topping', 'ice cream', 'gelato', 'sorbet', 'yogurt', 'cone', 'cup', 'sauce',
];

const ICE_CREAM_BLOCKED_TERMS = [
  'שת', 'משקה', 'קפה קר', 'מיץ', 'לימונדה', 'tea', 'drink', 'drinks', 'beverage', 'coffee', 'espresso',
  'cappuccino', 'latte', 'americano', 'juice', 'smoothie', 'soda', 'cola', 'water', 'beer', 'wine', 'cocktail',
];

const includesAnyTerm = (value: string, terms: string[]) => {
  const normalized = normalizeValue(value);
  return terms.some((term) => normalized.includes(normalizeValue(term)));
};

const tokenizeEvidence = (value: string) =>
  normalizeValue(value)
    .split(' ')
    .filter((token) => token.length >= 2 && !EVIDENCE_STOP_WORDS.has(token));

const hasSourceEvidence = (item: any) => {
  const sourceTokens = tokenizeEvidence(item?.sourceText ?? '');

  if (sourceTokens.length === 0) {
    return false;
  }

  const itemTokens = [item?.text, item?.textEn]
    .flatMap((value) => tokenizeEvidence(value ?? ''));

  return itemTokens.some((token) => sourceTokens.includes(token));
};

const sanitizeVisibleEvidence = (menuData: any) => {
  if (!Array.isArray(menuData?.categories)) {
    return menuData;
  }

  const categories = menuData.categories
    .map((category: any) => {
      const items = Array.isArray(category?.items)
        ? category.items.filter((item: any) => hasSourceEvidence(item))
        : [];

      if (items.length === 0) {
        return null;
      }

      return {
        ...category,
        items,
      };
    })
    .filter(Boolean);

  const standaloneItems = Array.isArray(menuData?.standaloneItems)
    ? menuData.standaloneItems.filter((item: any) => hasSourceEvidence(item))
    : menuData?.standaloneItems;

  return {
    ...menuData,
    categories,
    standaloneItems,
  };
};

const sanitizeMenuForBusinessType = (menuData: any, businessType?: string) => {
  const evidenceSanitized = sanitizeVisibleEvidence(menuData);

  if (businessType !== 'iceCream' || !Array.isArray(evidenceSanitized?.categories)) {
    return evidenceSanitized;
  }

  const nextCategories = evidenceSanitized.categories
    .map((category: any) => {
      const categoryName = `${category?.name ?? ''} ${category?.nameHe ?? ''}`.trim();
      const categoryLooksBlocked = includesAnyTerm(categoryName, ICE_CREAM_BLOCKED_TERMS);
      const categoryLooksAllowed = includesAnyTerm(categoryName, ICE_CREAM_ALLOWED_CATEGORY_TERMS);

      const nextItems = Array.isArray(category?.items)
        ? category.items.filter((item: any) => {
            const itemName = `${item?.text ?? ''} ${item?.textEn ?? ''}`.trim();
            const itemLooksBlocked = includesAnyTerm(itemName, ICE_CREAM_BLOCKED_TERMS);
            const itemLooksAllowed = includesAnyTerm(itemName, ICE_CREAM_ALLOWED_ITEM_TERMS);

            if (itemLooksBlocked && !itemLooksAllowed) {
              return false;
            }

            if (!categoryLooksAllowed && !itemLooksAllowed) {
              return false;
            }

            return true;
          })
        : [];

      if (nextItems.length === 0) {
        return null;
      }

      if (categoryLooksBlocked && !categoryLooksAllowed) {
        return null;
      }

      return {
        ...category,
        items: nextItems,
      };
    })
    .filter(Boolean);

  return {
    ...evidenceSanitized,
    categories: nextCategories,
  };
};

const extractFirstJsonObject = (value: string) => {
  const trimmed = value.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  const firstBrace = withoutFence.indexOf('{');
  const lastBrace = withoutFence.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('No JSON object found in AI response');
  }

  return withoutFence.slice(firstBrace, lastBrace + 1);
};

const countExtractedItems = (menuData: any) => {
  const categoryCount = Array.isArray(menuData?.categories)
    ? menuData.categories.reduce((sum: number, category: any) => sum + (Array.isArray(category?.items) ? category.items.length : 0), 0)
    : 0;
  const standaloneCount = Array.isArray(menuData?.standaloneItems) ? menuData.standaloneItems.length : 0;

  return categoryCount + standaloneCount;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.warn("Request rejected: Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Missing authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user's JWT token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.warn("Request rejected: Invalid JWT token", claimsError?.message);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated request from user: ${userId}`);

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { imageBase64, businessType } = body;

    // Input validation: Check if image exists
    if (!imageBase64 || typeof imageBase64 !== "string") {
      console.warn("Request rejected: Missing or invalid image data");
      return new Response(
        JSON.stringify({ success: false, error: "Image is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation: Check image format
    if (!VALID_IMAGE_FORMAT.test(imageBase64)) {
      console.warn("Request rejected: Invalid image format");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid image format. Supported: PNG, JPEG, WebP, GIF" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation: Check image size
    if (imageBase64.length > MAX_IMAGE_SIZE) {
      console.warn(`Request rejected: Image too large (${imageBase64.length} bytes)`);
      return new Response(
        JSON.stringify({ success: false, error: "Image too large. Maximum size: 10MB" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation: Verify base64 encoding
    try {
      const base64Data = imageBase64.split(",")[1];
      if (!base64Data) {
        throw new Error("No base64 data found");
      }
      atob(base64Data);
    } catch {
      console.warn("Request rejected: Invalid base64 encoding");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid base64 encoding" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      console.error("Configuration error: GROQ_API_KEY is not set");
      throw new Error("GROQ_API_KEY is not configured");
    }

    console.log(`Processing menu image for user ${userId}...`);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content: `You are an expert at analyzing menu images and extracting menu items for AAC (Augmentative and Alternative Communication) boards.

Your task is to analyze the menu image and create a structured AAC board with the following requirements:

1. Identify all menu items (food, drinks, etc.)
2. Group them into logical categories (e.g., "Hot Drinks", "Cold Drinks", "Main Dishes", "Desserts")
3. Assign each item a Fitzgerald Key color category:
   - "people" (yellow): People, nouns, things
   - "verbs" (green): Actions
   - "descriptors" (blue): Adjectives, sizes, descriptions
   - "social" (pink): Social words, greetings

4. Provide translations in Hebrew and English
5. Suggest appropriate emoji icons for each item
6. For each item, provide the exact visible text from the image that proves the item exists

Critical rules:
- Only include items that are explicitly visible or legibly written in the provided image.
- Do not infer, guess, autocomplete, or add generic categories/items that are not clearly shown.
- Every item must include a "sourceText" field copied exactly from the visible text in the image.
- If you cannot quote visible supporting text for an item, omit that item.
- If the image only shows ice cream flavors and toppings, do not add drinks, coffee, food, or any other unrelated items.
- If the image shows cafe or restaurant food only, do not add drinks unless the drink name is visibly written in the image.
- If text is partial or ambiguous, return fewer items rather than inventing anything.
- Never expand a business into a "typical menu"; stay strictly grounded in the image.

Return a JSON object with this exact structure:
{
  "businessName": "Name of the business if visible",
  "businessNameHe": "Hebrew name if visible",
  "categories": [
    {
      "id": "category-id",
      "name": "Category Name",
      "nameHe": "Hebrew Category Name",
      "items": [
        {
          "id": "item-id",
          "text": "Hebrew item name",
          "textEn": "English item name",
          "sourceText": "Exact visible text copied from the image",
          "category": "people|verbs|descriptors|social",
          "icon": "emoji"
        }
      ]
    }
  ]
}

Be thorough but practical - focus only on the items visibly present in the image.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this menu image and extract only the items that are actually visible for an AAC communication board. Create categories only when they are supported by the image. Expected business type: ${businessType || 'unknown'}. Every returned item must include exact visible supporting text in sourceText. If the image appears to be for an ice cream shop, keep the output limited to flavors, toppings, serving styles, sauces, and other clearly visible ice cream-related items only. If the image is from a cafe or restaurant and mainly shows food, do not add drinks unless the drink names themselves are visibly written in the image.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_aac_board",
              description: "Create an AAC board structure from menu items",
              parameters: {
                type: "object",
                properties: {
                  businessName: { type: "string" },
                  businessNameHe: { type: "string" },
                  categories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        nameHe: { type: "string" },
                        items: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              text: { type: "string" },
                              textEn: { type: "string" },
                              sourceText: { type: "string" },
                              category: { 
                                type: "string", 
                                enum: ["people", "verbs", "descriptors", "social"] 
                              },
                              icon: { type: "string" }
                            },
                            required: ["id", "text", "textEn", "category", "icon"]
                          }
                        }
                      },
                      required: ["id", "name", "nameHe", "items"]
                    }
                  }
                },
                required: ["businessName", "businessNameHe", "categories"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_aac_board" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limit exceeded for user ${userId}`);
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.warn(`Payment required for user ${userId}`);
        return new Response(
          JSON.stringify({ success: false, error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`AI response received for user ${userId}`);

    const message = data.choices?.[0]?.message;
    const toolCall = message?.tool_calls?.[0];

    let rawMenuData: any;

    try {
      if (toolCall?.function?.arguments) {
        rawMenuData = JSON.parse(toolCall.function.arguments);
      } else if (typeof message?.content === 'string' && message.content.trim()) {
        rawMenuData = JSON.parse(extractFirstJsonObject(message.content));
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: "The AI didn't return usable menu data for this image. Please try a clearer image.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (parseError) {
      console.error('Failed to parse AI menu response', parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "The AI response couldn't be read for this image. Please try a clearer image.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const menuData = sanitizeMenuForBusinessType(rawMenuData, businessType);
    if (countExtractedItems(menuData) === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No clear visible menu items were detected in the image. Please try a clearer or closer photo.',
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log(`Menu data parsed successfully for user ${userId}: ${menuData.businessName}`);

    // Attach free ARASAAC pictograms to each item where available.
    await enrichMenuWithArasaac(menuData);

    return new Response(
      JSON.stringify({ success: true, data: menuData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing menu:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to process menu" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
