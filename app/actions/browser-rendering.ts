"use server";

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID!;
const API_TOKEN = process.env.CF_API_TOKEN!;

export interface FetchMarkdownResult {
  success: boolean;
  markdown?: string;
  error?: string;
}

export interface FetchResult {
  type: "markdown" | "pdf";
  content: string; // markdown text or base64 for PDF
}

export async function fetchContentFromUrl(url: string): Promise<FetchResult> {
  // Check if URL points to a PDF
  const isPdf =
    url.toLowerCase().endsWith(".pdf") || url.toLowerCase().includes(".pdf?");

  if (isPdf) {
    return fetchPdfFromUrl(url);
  }

  const markdown = await fetchMarkdownFromUrl(url);
  return { type: "markdown", content: markdown };
}

export async function fetchPdfFromUrl(url: string): Promise<FetchResult> {
  if (!ACCOUNT_ID || !API_TOKEN) {
    throw new Error("Cloudflare credentials not configured");
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }

  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/browser-rendering/pdf`;

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudflare PDF API error:", errorText);
      throw new Error("Failed to fetch PDF from URL");
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return { type: "pdf", content: base64 };
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw error;
  }
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
