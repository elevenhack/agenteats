"use client";

import { useState, useRef } from "react";
import { Link2, Upload, Loader2, Sparkles, FileCheck, X, Image as ImageIcon, FileText } from "lucide-react";
import {
  fetchContentFromUrl,
  type FetchResult,
} from "@/app/actions/browser-rendering";
import {
  extractMenuItems,
  type ContentInput,
} from "@/app/actions/menu-extraction";

type FileContent =
  | { type: "text"; content: string }
  | { type: "image"; base64: string; mimeType: string; preview: string }
  | { type: "pdf"; base64: string; fileName: string };

interface MenuImporterProps {
  onMenuGenerated: (menu: string) => void;
  className?: string;
}

export function MenuImporter({ onMenuGenerated, className = "" }: MenuImporterProps) {
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [url, setUrl] = useState("");
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleScrape() {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileContent(null);

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

      const menuMarkdown = await extractMenuItems(input);
      onMenuGenerated(menuMarkdown);
      
      // Clear the content after successful extraction
      setFileContent(null);
      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract menu data"
      );
    } finally {
      setIsExtracting(false);
    }
  }

  function clearContent() {
    setFileContent(null);
    setUrl("");
    setError(null);
  }

  function renderContentPreview() {
    if (!fileContent) return null;

    return (
      <div className="relative mt-4">
        <button
          onClick={clearContent}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center z-10 transition-colors"
          aria-label="Clear content"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        
        {fileContent.type === "text" && (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-32 overflow-hidden relative">
            <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
              {fileContent.content.substring(0, 500)}
              {fileContent.content.length > 500 && "..."}
            </pre>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent" />
          </div>
        )}

        {fileContent.type === "image" && (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-3">
            <img
              src={fileContent.preview}
              alt="Uploaded menu"
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ImageIcon className="w-4 h-4" />
              <span>Image ready for AI extraction</span>
            </div>
          </div>
        )}

        {fileContent.type === "pdf" && (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{fileContent.fileName}</p>
              <p className="text-xs text-gray-500">PDF ready for AI extraction</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-xl bg-white ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Import Menu from Document</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Upload a file or paste a link to auto-generate your menu
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("url")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "url"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Link2 className="w-4 h-4" />
          Paste Link
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "upload"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "url" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/menu"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleScrape();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
              />
              <button
                onClick={handleScrape}
                disabled={isLoading || !url.trim()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileCheck className="w-4 h-4" />
                )}
                Fetch
              </button>
            </div>
          </div>
        )}

        {activeTab === "upload" && (
          <div className="space-y-3">
            <label className="block">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, Images (PNG, JPG), or text files
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.txt,.html,.htm,.pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Content Preview */}
        {renderContentPreview()}

        {/* Extract Button */}
        {fileContent && (
          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting menu with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Extract Menu with AI
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
