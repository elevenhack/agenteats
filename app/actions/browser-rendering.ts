"use server";

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID!;
const API_TOKEN = process.env.CF_API_TOKEN!;

export interface FetchMarkdownResult {
  success: boolean;
  markdown?: string;
  error?: string;
}

export async function fetchMarkdownFromUrl(url: string): Promise<string> {
  if (!ACCOUNT_ID || !API_TOKEN) {
    return "";
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return "";
  }

  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/browser-rendering/markdown`;

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        rejectResourceTypes: ["image"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudflare API error:", errorText);
      return "";
    }

    const markdown = await response.json();

    if (markdown.result) {
      // Strip URLs from the markdown output
      const cleanedMarkdown = markdown.result
        // Convert markdown links [text](url) to just text
        .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
        // Remove raw URLs
        .replace(/https?:\/\/[^\s)>\]]+/g, "");

      return cleanedMarkdown;
    }

    return "";
  } catch (error) {
    console.error("Error fetching markdown:", error);
    return "";
  }
}
