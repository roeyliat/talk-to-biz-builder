import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { enrichMenuWithArasaac } from "../_shared/arasaac.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// URL validation
const MAX_URL_LENGTH = 2048;
const MIN_EXTRACTED_TEXT_LENGTH = 120;

class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserFacingError";
  }
}

type MenuItem = {
  id: string;
  text: string;
  textEn: string;
  category: "people" | "verbs" | "descriptors" | "social";
  icon: string;
  imageUrl?: string;
};

type MenuCategory = {
  id: string;
  name: string;
  nameHe: string;
  items: MenuItem[];
};

type MenuData = {
  businessName: string;
  businessNameHe: string;
  categories: MenuCategory[];
};

type BiteTechConfig = {
  serverUrl: string;
  franchiseId?: string | number;
};

type BiteTechBranch = {
  Id?: number;
  id?: number;
  Name?: string;
  name?: string;
  IsActive?: boolean;
  isActive?: boolean;
};

type BiteTechMetadataResponse = {
  branches?: BiteTechBranch[];
  Branches?: BiteTechBranch[];
  franchise?: {
    Name?: string;
    NameTranslated?: string;
    Branches?: BiteTechBranch[];
    branches?: BiteTechBranch[];
  };
};

type BiteTechMenuCategory = {
  Id?: number;
  Name?: string;
  NameTranslated?: string;
  Items?: BiteTechMenuItem[];
};

type BiteTechMenuItem = {
  Id?: number;
  Name?: string;
  NameTranslated?: string;
  ImageUrl?: string;
};

type BiteTechMenuResponse = {
  categories?: BiteTechMenuCategory[];
};

const BITETECH_CONFIG_URL = "https://order.bitetech.co.il/assets/config/config.json";

const isBiteTechHost = (host: string) =>
  /(^|\.)bitetech\.co\.il$/i.test(host) || /(^|\.)bite-tech\.co\.il$/i.test(host);

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const slugify = (value: string, fallback: string) => {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05ff]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
};

const getBiteTechItemIcon = (text: string) => {
  const normalized = text.toLowerCase();

  if (/(pizza|פיצה)/i.test(normalized)) return "🍕";
  if (/(pasta|פסטה)/i.test(normalized)) return "🍝";
  if (/(burger|המבורגר|בורגר)/i.test(normalized)) return "🍔";
  if (/(salad|סלט)/i.test(normalized)) return "🥗";
  if (/(drink|שתיה|משקה|cola|coke|sprite|fanta)/i.test(normalized)) return "🥤";
  if (/(beer|wine|בירה|יין)/i.test(normalized)) return "🍷";
  if (/(coffee|קפה)/i.test(normalized)) return "☕";
  if (/(dessert|קינוח|עוגה|גלידה|וופל)/i.test(normalized)) return "🍰";
  if (/(fries|chips|צ'יפס)/i.test(normalized)) return "🍟";
  if (/(sandwich|toast|כריך|טוסט|פיתה)/i.test(normalized)) return "🥪";
  return "🍽️";
};

const parsePositiveInt = (value: string | null | undefined) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const getFirstQueryInt = (params: URLSearchParams, keys: string[]) => {
  for (const key of keys) {
    const parsed = parsePositiveInt(params.get(key));
    if (parsed) return parsed;
  }

  return undefined;
};

const parseBiteTechIds = (parsedUrl: URL) => {
  const rawHash = parsedUrl.hash.replace(/^#/, "");
  const [hashPath = "", hashQuery = ""] = rawHash.split("?", 2);
  const routeSource = hashPath || parsedUrl.pathname || "";
  const segments = routeSource
    .replace(/^#/, "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const topLevelQueryParams = parsedUrl.searchParams;
  const hashQueryParams = new URLSearchParams(hashQuery);

  const franchiseFromQuery =
    getFirstQueryInt(topLevelQueryParams, ["franchiseId", "franchiseID", "franchise"]) ??
    getFirstQueryInt(hashQueryParams, ["franchiseId", "franchiseID", "franchise"]);

  const branchFromQuery =
    getFirstQueryInt(topLevelQueryParams, ["branchId", "branchID", "branch", "branchid"]) ??
    getFirstQueryInt(hashQueryParams, ["branchId", "branchID", "branch", "branchid"]);

  const numericSegments = segments
    .map((segment) => Number(segment))
    .filter((value) => Number.isFinite(value) && value > 0);

  const franchiseId = franchiseFromQuery ?? numericSegments[0];
  const branchId = branchFromQuery ?? numericSegments[1];

  if (!franchiseId) {
    throw new UserFacingError("Could not identify the BiteTech franchise ID from the URL.");
  }

  return { franchiseId, branchId };
};

const fetchJson = async <T>(url: string) => {
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json, text/plain, */*",
      "User-Agent": "Mozilla/5.0 (compatible; AACBoardBot/1.0)",
      "Referer": "https://order.bitetech.co.il/",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return await response.json() as T;
};

const resolveBiteTechBranchId = (
  metadata: BiteTechMetadataResponse,
  fallbackBranchId: number | undefined,
) => {
  if (fallbackBranchId) return fallbackBranchId;

  const branches =
    metadata.branches ??
    metadata.Branches ??
    metadata.franchise?.Branches ??
    metadata.franchise?.branches ??
    [];

  const firstActiveBranch = branches.find((branch) => {
    const isActive = branch.IsActive ?? branch.isActive;
    const supportsMenu = branch.IsDelivery || branch.IsTakeAway || branch.IsSit;
    const isLocked = (branch as { IsLocked?: boolean }).IsLocked;

    return isActive !== false && supportsMenu && isLocked !== true;
  });
  const branchId = firstActiveBranch?.Id ?? firstActiveBranch?.id;

  if (branchId) return branchId;

  throw new UserFacingError(
    "This BiteTech link does not include a specific branch, and BiteTech did not expose a branch list for this franchise. Please open the exact branch menu link first, or upload a screenshot/PDF instead.",
  );
};

const mapBiteTechMenuData = (
  metadata: BiteTechMetadataResponse,
  menuResponse: BiteTechMenuResponse,
): MenuData => {
  const businessNameHe = normalizeWhitespace(
    metadata.franchise?.Name || "תפריט",
  );
  const businessName = normalizeWhitespace(
    metadata.franchise?.NameTranslated || metadata.franchise?.Name || businessNameHe,
  );

  const categories = (menuResponse.categories ?? [])
    .map((category, categoryIndex) => {
      const nameHe = normalizeWhitespace(category.Name || category.NameTranslated || `קטגוריה ${categoryIndex + 1}`);
      const name = normalizeWhitespace(category.NameTranslated || category.Name || nameHe);
      const items = (category.Items ?? [])
        .map((item, itemIndex) => {
          const textHe = normalizeWhitespace(item.Name || item.NameTranslated || "");
          if (!textHe) return null;

          const textEn = normalizeWhitespace(item.NameTranslated || item.Name || textHe);
          return {
            id: item.Id ? `bitetech-item-${item.Id}` : `bitetech-item-${categoryIndex}-${itemIndex}-${slugify(textHe, "item")}`,
            text: textHe,
            textEn,
            category: "people" as const,
            icon: getBiteTechItemIcon(`${textHe} ${textEn}`),
            imageUrl: item.ImageUrl || undefined,
          };
        })
        .filter((item): item is MenuItem => Boolean(item));

      if (items.length === 0) return null;

      return {
        id: category.Id ? `bitetech-category-${category.Id}` : `bitetech-category-${slugify(nameHe, `category-${categoryIndex + 1}`)}`,
        name,
        nameHe,
        items,
      };
    })
    .filter((category): category is MenuCategory => Boolean(category));

  return {
    businessName,
    businessNameHe,
    categories,
  };
};

const processBiteTechUrl = async (parsedUrl: URL) => {
  const { franchiseId, branchId } = parseBiteTechIds(parsedUrl);
  const config = await fetchJson<BiteTechConfig>(BITETECH_CONFIG_URL);
  const serverUrl = config.serverUrl;

  if (!serverUrl) {
    throw new Error("BiteTech config is missing serverUrl.");
  }

  const metadata = await fetchJson<BiteTechMetadataResponse>(
    `${serverUrl}MetaData/GetFranchiseWithBranches?currentVersion=1&franchiseId=${franchiseId}&lang=he&method=1`,
  );
  const resolvedBranchId = resolveBiteTechBranchId(metadata, branchId);
  const menuResponse = await fetchJson<BiteTechMenuResponse>(
    `${serverUrl}Menu/GetMenuForBranch_?branchID=${resolvedBranchId}&franchiseId=${franchiseId}&method=1&checkHours=true&forApp=true&forKiosk=false`,
  );

  const menuData = mapBiteTechMenuData(metadata, menuResponse);

  if (menuData.categories.length === 0) {
    throw new UserFacingError("No menu categories were returned from BiteTech for this URL.");
  }

  await enrichMenuWithArasaac(menuData);
  return menuData;
};

const extractVisibleText = (html: string) =>
  html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isDynamicShellWithoutContent = (html: string, text: string) => {
  const normalizedText = text.toLowerCase();

  return (
    text.length < MIN_EXTRACTED_TEXT_LENGTH ||
    normalizedText === 'bite iframe' ||
    (html.includes('<app-root') && text.length < 400)
  );
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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.warn("Request rejected: Invalid JWT token", authError?.message);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized: Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Authenticated request from user: ${user.id}`);

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

    const { url } = body;

    // Input validation: Check if URL exists
    if (!url || typeof url !== "string") {
      console.warn("Request rejected: Missing or invalid URL");
      return new Response(
        JSON.stringify({ success: false, error: "URL is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL length
    if (url.length > MAX_URL_LENGTH) {
      return new Response(
        JSON.stringify({ success: false, error: "URL too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid URL format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching URL: ${parsedUrl.href}`);

    if (isBiteTechHost(parsedUrl.host)) {
      console.log(`Processing BiteTech URL directly for ${parsedUrl.href}`);
      const menuData = await processBiteTechUrl(parsedUrl);

      return new Response(
        JSON.stringify({ success: true, data: menuData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the webpage content
    let htmlContent: string;
    try {
      const pageResponse = await fetch(parsedUrl.href, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AACBoardBot/1.0)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5,he;q=0.3",
        },
      });

      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch page: ${pageResponse.status}`);
      }

      htmlContent = await pageResponse.text();
      
      // Limit content size to prevent issues
      if (htmlContent.length > 500000) {
        htmlContent = htmlContent.substring(0, 500000);
      }

      console.log(`Fetched ${htmlContent.length} characters from ${parsedUrl.host}`);
    } catch (fetchError) {
      console.error("Error fetching URL:", fetchError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch the webpage. Please check the URL and try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract text content from HTML (basic extraction)
    const extractedText = extractVisibleText(htmlContent);
    const textContent = extractedText.substring(0, 50000);

    if (isDynamicShellWithoutContent(htmlContent, extractedText)) {
      console.warn(`Insufficient menu content extracted from ${parsedUrl.host}; refusing AI inference to avoid hallucinated items`);
      return new Response(
        JSON.stringify({
          success: false,
          error: "This website loads its menu dynamically, so the URL import couldn't read the actual menu items reliably. Please upload a screenshot/PDF of the menu instead.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      console.error("Configuration error: GROQ_API_KEY is not set");
      throw new Error("GROQ_API_KEY is not configured");
    }

    console.log(`Processing menu content with AI for user ${user.id}...`);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an expert at analyzing restaurant/business menu pages and extracting menu items for AAC (Augmentative and Alternative Communication) boards.

Your task is to analyze the webpage content (which may include a menu) and create a structured AAC board with the following requirements:

1. Identify all menu items (food, drinks, products, services, etc.)
2. Group them into logical categories (e.g., "Hot Drinks", "Cold Drinks", "Main Dishes", "Desserts", "Appetizers", "Sides")
3. Assign each item a Fitzgerald Key color category:
   - "people" (yellow): People, nouns, things - USE THIS FOR ALL FOOD/DRINK ITEMS
   - "verbs" (green): Actions (order, pay, etc.)
   - "descriptors" (blue): Adjectives, sizes, descriptions
   - "social" (pink): Social words, greetings

4. Provide translations in Hebrew and English
5. Suggest appropriate emoji icons for each item

Critical rules:
- Only include items that are explicitly present in the provided webpage content.
- Do not infer, guess, autocomplete, or add generic menu items that are not clearly present.
- If the content is incomplete, sparse, or ambiguous, return fewer items rather than inventing any.
- Never add example items such as burgers, pasta, salads, or drinks unless they appear in the supplied content.

Return a JSON object with this exact structure:
{
  "businessName": "Name of the business",
  "businessNameHe": "Hebrew name or transliteration",
  "categories": [
    {
      "id": "unique-category-id",
      "name": "Category Name",
      "nameHe": "Hebrew Category Name",
      "items": [
        {
          "id": "unique-item-id",
          "text": "Hebrew item name",
          "textEn": "English item name",
          "category": "people",
          "icon": "emoji"
        }
      ]
    }
  ]
}

Be thorough but practical - extract ALL menu items you can find. If items have prices, ignore the prices and focus on the item names.
If the content doesn't appear to be a menu, try to extract any relevant items or products that could be used for communication.`
          },
          {
            role: "user",
            content: `Please analyze this webpage content from ${parsedUrl.host} and extract all menu items for an AAC communication board. Create appropriate categories and subcategories.

Webpage content:
${textContent}`
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
        console.warn(`Rate limit exceeded for user ${user.id}`);
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.warn(`Payment required for user ${user.id}`);
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
    console.log(`AI response received for user ${user.id}`);

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call response from AI");
    }

    const menuData = JSON.parse(toolCall.function.arguments);
    console.log(`Menu data parsed successfully for user ${user.id}: ${menuData.businessName}, ${menuData.categories?.length || 0} categories`);

    // Attach free ARASAAC pictograms to each item where available.
    await enrichMenuWithArasaac(menuData);

    return new Response(
      JSON.stringify({ success: true, data: menuData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing menu URL:", error);

    if (error instanceof UserFacingError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to process menu" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
