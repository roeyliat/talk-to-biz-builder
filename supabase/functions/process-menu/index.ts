import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation constants
const MAX_IMAGE_SIZE = 10_000_000; // 10MB
const VALID_IMAGE_FORMAT = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/]+=*$/;

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

    const { imageBase64 } = body;

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
          "category": "people|verbs|descriptors|social",
          "icon": "emoji"
        }
      ]
    }
  ]
}

Be thorough but practical - focus on the main items visible in the menu.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this menu image and extract all items for an AAC communication board. Create appropriate categories and subcategories."
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

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call response from AI");
    }

    const menuData = JSON.parse(toolCall.function.arguments);
    console.log(`Menu data parsed successfully for user ${userId}: ${menuData.businessName}`);

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
