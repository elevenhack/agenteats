"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Store,
  Upload,
  Scan,
  MapPin,
  Eye,
  Rocket,
  Loader2,
  FileImage,
} from "lucide-react";

type Step =
  | "business"
  | "upload"
  | "analyzing"
  | "confirm-details"
  | "confirm-menu"
  | "generating"
  | "complete";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

interface RestaurantDetails {
  name: string;
  address: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("business");
  const [businessType, setBusinessType] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [restaurantDetails, setRestaurantDetails] = useState<RestaurantDetails>(
    {
      name: "",
      address: "",
    }
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const stepConfig = {
    business: {
      title: "Tell us about your business",
      progress: 14,
      icon: Store,
    },
    upload: { title: "Upload your menu", progress: 28, icon: Upload },
    analyzing: { title: "Reading your menu...", progress: 42, icon: Scan },
    "confirm-details": {
      title: "Confirm restaurant details",
      progress: 57,
      icon: MapPin,
    },
    "confirm-menu": {
      title: "Confirm your menu items",
      progress: 71,
      icon: Eye,
    },
    generating: {
      title: "Generating your storefront...",
      progress: 85,
      icon: Rocket,
    },
    complete: { title: "Ready to go live!", progress: 100, icon: CheckCircle2 },
  };

  const handleBusinessSubmit = () => {
    if (businessType.trim()) {
      setCurrentStep("upload");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (images and PDFs)
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/heic",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image (JPG, PNG, HEIC) or PDF file");
        return;
      }

      setUploadedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadPreview(null);
      }
    }
  };

  const handleAnalyzeMenu = async () => {
    if (uploadedFile) {
      setCurrentStep("analyzing");

      // Simulate API call to analyze menu with AI
      setTimeout(() => {
        // Mock extracted restaurant details
        setRestaurantDetails({
          name: "Joe's Italian Kitchen",
          address: "123 Main Street, San Francisco, CA 94102",
        });
        setCurrentStep("confirm-details");
      }, 3000);
    }
  };

  const handleConfirmDetails = () => {
    if (restaurantDetails.name.trim() && restaurantDetails.address.trim()) {
      setCurrentStep("analyzing");

      // Continue to extract menu items
      setTimeout(() => {
        // Mock menu items - replace with actual API call
        const mockItems: MenuItem[] = [
          {
            id: "1",
            name: "Margherita Pizza",
            price: 14.99,
            description: "Fresh mozzarella, tomato sauce, basil",
            category: "Pizza",
          },
          {
            id: "2",
            name: "Pepperoni Pizza",
            price: 16.99,
            description: "Classic pepperoni with mozzarella",
            category: "Pizza",
          },
          {
            id: "3",
            name: "Pasta Carbonara",
            price: 15.99,
            description: "Creamy pasta with bacon and parmesan",
            category: "Pasta",
          },
          {
            id: "4",
            name: "Lasagna",
            price: 17.99,
            description: "Layered pasta with meat sauce and cheese",
            category: "Pasta",
          },
          {
            id: "5",
            name: "Caesar Salad",
            price: 9.99,
            description: "Romaine lettuce with caesar dressing",
            category: "Salads",
          },
          {
            id: "6",
            name: "Caprese Salad",
            price: 10.99,
            description: "Fresh mozzarella, tomatoes, and basil",
            category: "Salads",
          },
          {
            id: "7",
            name: "Tiramisu",
            price: 7.99,
            description: "Classic Italian dessert",
            category: "Desserts",
          },
          {
            id: "8",
            name: "Gelato",
            price: 5.99,
            description: "Italian ice cream, various flavors",
            category: "Desserts",
          },
        ];

        setMenuItems(mockItems);
        // Select all items by default
        setSelectedItems(new Set(mockItems.map((item) => item.id)));
        setCurrentStep("confirm-menu");
      }, 2000);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const handleConfirmMenu = () => {
    if (selectedItems.size > 0) {
      setCurrentStep("generating");

      // Simulate storefront generation
      setTimeout(() => {
        setCurrentStep("complete");
      }, 4000);
    }
  };

  const handleGoLive = () => {
    // Navigate to the main app/dashboard
    router.push("/");
  };

  const currentConfig = stepConfig[currentStep];
  const StepIcon = currentConfig.icon;

  // Group items by category for better display
  const itemsByCategory = menuItems.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">Agent</span>Eats
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <StepIcon className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">{currentConfig.title}</h1>
              </div>
              <Badge variant="outline" className="text-sm">
                Step {Object.keys(stepConfig).indexOf(currentStep) + 1} of{" "}
                {Object.keys(stepConfig).length}
              </Badge>
            </div>
            <Progress value={currentConfig.progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              {/* Step 1: Business Type */}
              {currentStep === "business" && (
                <div className="space-y-6">
                  <div>
                    <CardDescription className="text-base mb-4">
                      Tell us about your business so we can customize your
                      storefront
                    </CardDescription>
                    <Input
                      placeholder="e.g., Italian Restaurant, Coffee Shop, Bakery..."
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleBusinessSubmit()
                      }
                      className="text-lg h-12"
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={handleBusinessSubmit}
                    disabled={!businessType.trim()}
                    size="lg"
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Step 2: Upload Menu */}
              {currentStep === "upload" && (
                <div className="space-y-6">
                  <div>
                    <CardDescription className="text-base mb-4">
                      Upload a photo or PDF of your menu. We&apos;ll
                      automatically extract your restaurant details and menu
                      items.
                    </CardDescription>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="menu-upload"
                        accept="image/jpeg,image/jpg,image/png,image/heic,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="menu-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        {uploadPreview ? (
                          <div className="space-y-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={uploadPreview}
                              alt="Menu preview"
                              className="max-h-48 rounded-lg"
                            />
                            <p className="text-sm text-muted-foreground">
                              Click to change file
                            </p>
                          </div>
                        ) : uploadedFile ? (
                          <div className="space-y-4">
                            <FileImage className="w-16 h-16 text-primary mx-auto" />
                            <div>
                              <p className="font-medium">{uploadedFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Click to change file
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                            <div>
                              <p className="font-medium">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Supported: JPG, PNG, HEIC, or PDF
                              </p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setCurrentStep("business")}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleAnalyzeMenu}
                      disabled={!uploadedFile}
                      size="lg"
                      className="w-full"
                    >
                      Analyze Menu
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Analyzing */}
              {currentStep === "analyzing" && (
                <div className="py-12 space-y-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Spinner className="w-16 h-16 mb-6" />
                    <h2 className="text-2xl font-semibold mb-2">
                      Reading your menu...
                    </h2>
                    <p className="text-muted-foreground">
                      Our AI is extracting your restaurant details and menu
                      items...
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm Restaurant Details */}
              {currentStep === "confirm-details" && (
                <div className="space-y-6">
                  <div>
                    <CardDescription className="text-base mb-4">
                      We extracted these details from your menu. Please confirm
                      or edit them.
                    </CardDescription>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Restaurant Name
                        </label>
                        <Input
                          placeholder="Restaurant name"
                          value={restaurantDetails.name}
                          onChange={(e) =>
                            setRestaurantDetails({
                              ...restaurantDetails,
                              name: e.target.value,
                            })
                          }
                          className="text-lg h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Address
                        </label>
                        <Input
                          placeholder="Full address"
                          value={restaurantDetails.address}
                          onChange={(e) =>
                            setRestaurantDetails({
                              ...restaurantDetails,
                              address: e.target.value,
                            })
                          }
                          className="text-lg h-12"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleConfirmDetails}
                    disabled={
                      !restaurantDetails.name.trim() ||
                      !restaurantDetails.address.trim()
                    }
                    size="lg"
                    className="w-full"
                  >
                    Confirm & Continue
                  </Button>
                </div>
              )}

              {/* Step 5: Confirm Menu Items */}
              {currentStep === "confirm-menu" && (
                <div className="space-y-6">
                  <div>
                    <CardDescription className="text-base mb-4">
                      We found {menuItems.length} items. Review and select what
                      you&apos;d like to include.
                    </CardDescription>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                      {Object.entries(itemsByCategory).map(
                        ([category, items]) => (
                          <div key={category}>
                            <h3 className="font-semibold text-lg mb-3 sticky top-0 bg-background py-2">
                              {category}
                            </h3>
                            <div className="space-y-2">
                              {items.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => toggleItemSelection(item.id)}
                                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                    selectedItems.has(item.id)
                                      ? "border-primary bg-primary/5"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">
                                          {item.name}
                                        </h4>
                                        {selectedItems.has(item.id) && (
                                          <CheckCircle2 className="w-5 h-5 text-primary" />
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <span className="font-semibold text-lg ml-4">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {selectedItems.size} of {menuItems.length} items selected
                    </p>
                  </div>
                  <Button
                    onClick={handleConfirmMenu}
                    disabled={selectedItems.size === 0}
                    size="lg"
                    className="w-full"
                  >
                    Confirm Selection
                  </Button>
                </div>
              )}

              {/* Step 6: Generating */}
              {currentStep === "generating" && (
                <div className="py-12 space-y-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-16 h-16 mb-6 animate-spin text-primary" />
                    <h2 className="text-2xl font-semibold mb-2">
                      Creating your storefront
                    </h2>
                    <p className="text-muted-foreground">
                      Hang tight! We&apos;re setting up your beautiful online
                      ordering system...
                    </p>
                  </div>
                </div>
              )}

              {/* Step 7: Complete */}
              {currentStep === "complete" && (
                <div className="py-12 space-y-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">
                      Your storefront is ready!
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md">
                      You&apos;re all set to start accepting orders. Let&apos;s
                      get you live!
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={handleGoLive}
                      size="lg"
                      className="w-full text-lg h-14"
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Go Live Now
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      You can customize your storefront anytime from the
                      dashboard
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          {currentStep !== "analyzing" &&
            currentStep !== "generating" &&
            currentStep !== "complete" && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Need help? Contact our support team at support@agenteats.com
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
