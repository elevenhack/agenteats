"use client";

import { useState } from "react";
import { fetchMarkdownFromUrl } from "@/app/actions/browser-rendering";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function ScrapeTestPage() {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleScrape() {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMarkdown("");

    try {
      const result = await fetchMarkdownFromUrl(url);

      setMarkdown(result);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Scrape Test</CardTitle>
          <CardDescription>
            Test the Cloudflare Browser Rendering API markdown endpoint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL to scrape</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/menu"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleScrape();
                  }
                }}
              />
              <Button onClick={handleScrape} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Scraping...
                  </>
                ) : (
                  "Scrape"
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {markdown && <textarea className="w-full h-100">{markdown}</textarea>}
        </CardContent>
      </Card>
    </div>
  );
}
