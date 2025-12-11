"use server";

import OpenAI from "openai";
import { extractText } from "unpdf";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RestaurantInfo {
  markdown: string;
}

export interface MenuExtractionResult {
  restaurant: RestaurantInfo;
  menuItems: string; // markdown formatted menu
}

export type ContentInput =
  | { type: "text"; content: string }
  | { type: "image"; base64: string; mimeType: string }
  | { type: "pdf"; base64: string };

// Helper to build messages for OpenAI based on content type
function buildUserContent(
  input: ContentInput
): OpenAI.Chat.Completions.ChatCompletionContentPart[] {
  if (input.type === "text") {
    return [{ type: "text", text: input.content }];
  } else if (input.type === "image") {
    return [
      {
        type: "image_url",
        image_url: {
          url: `data:${input.mimeType};base64,${input.base64}`,
          detail: "high",
        },
      },
    ];
  }
  // PDF content will be converted to text before calling this
  return [{ type: "text", text: "" }];
}

// Extract text from PDF buffer
async function extractTextFromPdf(base64: string): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  const uint8Array = new Uint8Array(buffer);
  const { text } = await extractText(uint8Array);
  return text.join("\n");
}

export async function extractRestaurantInfo(
  input: ContentInput
): Promise<RestaurantInfo> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  // For PDF, extract text first
  let processedInput = input;
  if (input.type === "pdf") {
    const text = await extractTextFromPdf(input.base64);
    processedInput = { type: "text", content: text };
  }

  const userContent = buildUserContent(processedInput);

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // Using gpt-4o for vision capabilities
    messages: [
      {
        role: "system",
        content: `You are a data extraction assistant. Extract the restaurant name and address from the provided content (text or image).

Return your response in clean markdown format like this:

# Restaurant Name

**Address:** Full street address, city, state, zip

If information is not found, indicate "Not found" for that field.`,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;
  return { markdown: content || "No restaurant information found." };
}

export async function extractMenuItems(input: ContentInput): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  // For PDF, extract text first
  let processedInput = input;
  if (input.type === "pdf") {
    const text = await extractTextFromPdf(input.base64);
    processedInput = { type: "text", content: text };
  }

  const userContent = buildUserContent(processedInput);

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // Using gpt-4o for vision capabilities
    messages: [
      {
        role: "system",
        content: `You are a data extraction assistant. Extract all menu items with their prices from the provided content (text or image).

Return your response in clean markdown format, organized by category. Use this structure:

## Category Name

| Item | Description | Price |
|------|-------------|-------|
| Item Name | Brief description | $X.XX |

Include ALL menu items you can find. Group items by category (e.g., Appetizers, Main Course, Drinks, Desserts).
If a price is not available, use "Price not listed".
If no category is apparent, use "Menu Items" as the category.`,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;
  return content || "No menu items found.";
}

export async function extractMenuData(
  input: ContentInput
): Promise<MenuExtractionResult> {
  // Run both extractions in parallel for better performance
  const [restaurant, menuItems] = await Promise.all([
    extractRestaurantInfo(input),
    extractMenuItems(input),
  ]);

  return {
    restaurant,
    menuItems,
  };
}
