"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Store,
  Upload,
  MapPin,
  Clock,
  FileText,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { createOrganization } from "../actions/onboarding";
import { MenuImporter } from "@/components/MenuImporter";

type Step = "info" | "menu" | "review";

interface FormData {
  name: string;
  location: string;
  typicalWaitTime: string;
  menu: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    typicalWaitTime: "",
    menu: "",
  });

  const stepConfig = {
    info: {
      title: "Tell us about your restaurant",
      description: "Basic information to set up your AI phone agent",
      progress: 33,
      icon: Store,
    },
    menu: {
      title: "Add your menu",
      description: "Paste or type your menu for AI ordering",
      progress: 66,
      icon: FileText,
    },
    review: {
      title: "Review & launch",
      description: "Confirm your details and go live",
      progress: 100,
      icon: CheckCircle,
    },
  };

  const steps: Step[] = ["info", "menu", "review"];
  const currentIndex = steps.indexOf(currentStep);
  const currentConfig = stepConfig[currentStep];
  const StepIcon = currentConfig.icon;

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const canProceedFromInfo =
    formData.name.trim() &&
    formData.location.trim() &&
    formData.typicalWaitTime.trim();

  const canProceedFromMenu = formData.menu.trim();

  const handleSubmit = async () => {
    startTransition(async () => {
      const data = new window.FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("typicalWaitTime", formData.typicalWaitTime);
      data.append("menu", formData.menu);

      try {
        await createOrganization(data);
        // Redirect is handled by the server action
      } catch (error) {
        console.error("Failed to create organization:", error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">Agent</span>Eats
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const config = stepConfig[step];
                const Icon = config.icon;
                const isActive = index === currentIndex;
                const isComplete = index < currentIndex;

                return (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isComplete
                            ? "bg-green-500 text-white"
                            : isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {step === "info"
                          ? "Info"
                          : step === "menu"
                          ? "Menu"
                          : "Launch"}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                          index < currentIndex ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <StepIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentConfig.title}
            </h2>
            <p className="text-gray-600">{currentConfig.description}</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step 1: Restaurant Info */}
            {currentStep === "info" && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Restaurant Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                      placeholder="Joe's Pizza"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                      placeholder="123 Main St, New York, NY"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="typicalWaitTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Typical Wait Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="typicalWaitTime"
                      value={formData.typicalWaitTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          typicalWaitTime: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                      placeholder="15-20 minutes"
                    />
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={!canProceedFromInfo}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}


            {/* Step 2: Menu */}
            {currentStep === "menu" && (
              <div className="space-y-6">
                {/* AI Import Option */}
                <MenuImporter
                  onMenuGenerated={(menu) =>
                    setFormData({ ...formData, menu })
                  }
                />

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-sm text-gray-500">
                      or type manually
                    </span>
                  </div>
                </div>

                {/* Manual Entry */}
                <div>
                  <label
                    htmlFor="menu"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Menu
                  </label>
                  <textarea
                    id="menu"
                    value={formData.menu}
                    onChange={(e) =>
                      setFormData({ ...formData, menu: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm transition-shadow"
                    placeholder={`Enter your menu in markdown format...

Example:
# Pizza
- Margherita - $12
- Pepperoni - $14
- Hawaiian - $14

# Sides
- Garlic Bread - $5
- Caesar Salad - $8

# Drinks
- Soda - $2
- Water - $1`}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Use markdown format: # for categories, - for items with
                    prices
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canProceedFromMenu}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-500">
                        Restaurant Name
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">{formData.name}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-500">
                        Location
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {formData.location}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-500">
                        Wait Time
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {formData.typicalWaitTime}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-500">
                        Menu Preview
                      </span>
                    </div>
                    <pre className="text-gray-900 text-sm font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {formData.menu}
                    </pre>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Ready to launch!
                      </p>
                      <p className="text-sm text-blue-700">
                        Your AI phone agent will be ready to take orders
                        immediately after setup.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    disabled={isPending}
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 text-gray-700 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help? Contact our support team at support@agenteats.com
          </p>
        </div>
      </div>
    </main>
  );
}
