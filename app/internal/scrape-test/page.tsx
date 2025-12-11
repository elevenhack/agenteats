"use client";

import { useState, useRef } from "react";
import Markdown from "react-markdown";
import {
  fetchContentFromUrl,
  type FetchResult,
} from "@/app/actions/browser-rendering";
import {
  extractMenuData,
  type MenuExtractionResult,
  type ContentInput,
} from "@/app/actions/menu-extraction";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FileContent =
  | { type: "text"; content: string }
  | { type: "image"; base64: string; mimeType: string; preview: string }
  | { type: "pdf"; base64: string; fileName: string };

export default function ScrapeTestPage() {
  const [url, setUrl] = useState("");
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] =
    useState<MenuExtractionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleScrape() {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileContent(null);
    setExtractionResult(null);

    try {
      const result: FetchResult = await fetchContentFromUrl(url);

      if (result.type === "pdf") {
        setFileContent({
          type: "pdf",
          base64: result.content,
          fileName: url.split("/").pop() || "document.pdf",
        });
      } else {
        setFileContent({ type: "text", content: result.content });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scrape URL");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileContent(null);
    setExtractionResult(null);

    try {
      const fileType = file.type;
      const fileName = file.name;

      // Handle images
      if (fileType.startsWith("image/")) {
        const base64 = await fileToBase64(file);
        const preview = URL.createObjectURL(file);
        setFileContent({
          type: "image",
          base64,
          mimeType: fileType,
          preview,
        });
      }
      // Handle PDFs
      else if (fileType === "application/pdf") {
        const base64 = await fileToBase64(file);
        setFileContent({
          type: "pdf",
          base64,
          fileName,
        });
      }
      // Handle text files
      else {
        const text = await file.text();
        setFileContent({ type: "text", content: text });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to read uploaded file"
      );
    } finally {
      setIsLoading(false);
      // Reset file input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleExtract() {
    if (!fileContent) {
      setError(
        "No content to extract from. Please scrape a URL or upload a file first."
      );
      return;
    }

    setIsExtracting(true);
    setError(null);

    try {
      let input: ContentInput;

      if (fileContent.type === "text") {
        input = { type: "text", content: fileContent.content };
      } else if (fileContent.type === "image") {
        input = {
          type: "image",
          base64: fileContent.base64,
          mimeType: fileContent.mimeType,
        };
      } else {
        input = { type: "pdf", base64: fileContent.base64 };
      }

      const result = await extractMenuData(input);
      setExtractionResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract menu data"
      );
    } finally {
      setIsExtracting(false);
    }
  }

  function renderContentPreview() {
    if (!fileContent) return null;

    if (fileContent.type === "text") {
      return (
        <textarea
          className="w-full h-64 p-3 border rounded-md bg-muted/50 font-mono text-sm"
          value={fileContent.content}
          onChange={(e) =>
            setFileContent({ type: "text", content: e.target.value })
          }
          placeholder="Content will appear here..."
        />
      );
    }

    if (fileContent.type === "image") {
      return (
        <div className="border rounded-md p-4 bg-muted/50">
          <img
            src={fileContent.preview}
            alt="Uploaded menu"
            className="max-w-full max-h-96 mx-auto rounded-md"
          />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Image uploaded - ready for AI extraction
          </p>
        </div>
      );
    }

    if (fileContent.type === "pdf") {
      return (
        <div className="border rounded-md p-8 bg-muted/50 text-center">
          <div className="text-4xl mb-2">📄</div>
          <p className="font-medium">{fileContent.fileName}</p>
          <p className="text-sm text-muted-foreground mt-1">
            PDF uploaded - ready for AI extraction
          </p>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Menu Scraper & Extractor</CardTitle>
          <CardDescription>
            Scrape a URL, upload a file (including images and PDFs), or paste
            content to extract restaurant information and menu items using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Methods */}
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Scrape URL</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-2">
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
            </TabsContent>

            <TabsContent value="upload" className="space-y-2">
              <Label htmlFor="file">
                Upload a file (Image, PDF, Markdown, TXT, HTML)
              </Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".md,.txt,.html,.htm,.pdf,image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: Images (PNG, JPG, etc.), PDF, Markdown, TXT,
                HTML
              </p>
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Content Preview & Extraction */}
          {fileContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Content Preview</Label>
                <Button
                  onClick={handleExtract}
                  disabled={isExtracting}
                  variant="default"
                >
                  {isExtracting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Extracting with AI...
                    </>
                  ) : (
                    "Extract Menu Data with AI"
                  )}
                </Button>
              </div>
              {renderContentPreview()}
            </div>
          )}

          {/* Extraction Results */}
          {extractionResult && (
            <div className="space-y-6">
              {/* Restaurant Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Restaurant Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown>{extractionResult.restaurant.markdown}</Markdown>
                </CardContent>
              </Card>

              {/* Menu Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Menu Items</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown>{extractionResult.menuItems}</Markdown>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
