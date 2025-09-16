"use client";

import { ChevronDown, Sparkles, ArrowRight, Zap, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AIService } from "@/lib/services/ai-service";
import { MealPlanResponseComponent } from "@/components/MealPlanResponse";
import { MealPlanRequest, MealPlanResponse } from "@/types/meal-plan";
import { useLanguage } from "@/contexts/LanguageContext";
import { getI18n } from "@/lib/i18n";

const FormSection = () => {
  const [formData, setFormData] = useState<MealPlanRequest>({
    dietaryPreference: "",
    activityLevel: "",
    goal: "",
    mealFrequency: "",
    customRestrictions: "",
    quickRecipe: false,
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<MealPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { language } = useLanguage();
  const i18n = getI18n(language);
  const hasResults = isLoading || Boolean(aiResponse);

  // Check if fridge items are available
  const [hasFridgeItems, setHasFridgeItems] = useState(false);

  useEffect(() => {
    const checkFridgeItems = async () => {
      try {
        const response = await fetch("/api/fridge");
        if (response.ok) {
          const data = await response.json();
          setHasFridgeItems(data.items.length > 0);
        } else {
          // Don't show error for fridge check, just assume no items
          setHasFridgeItems(false);
        }
      } catch (error) {
        // Silently fail for fridge check
        setHasFridgeItems(false);
      }
    };

    checkFridgeItems();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const handleDropdownChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Clear meal frequency if plan is not "1 Dish"
      if (field === "dietaryPreference" && value !== i18n.form.planOptions[0]) {
        newData.mealFrequency = "";
      }

      return newData;
    });
    setOpenDropdown(null);
  };

  const handleCustomRestrictionsChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      customRestrictions: value,
    }));
  };

  const handleToggleChange = () => {
    setFormData((prev) => ({
      ...prev,
      quickRecipe: !prev.quickRecipe,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set default values if not selected
    const submitData = {
      ...formData,
      dietaryPreference: formData.dietaryPreference || "1 Day Plan",
      activityLevel: formData.activityLevel || "Normal",
      goal: formData.goal || "General Health",
      language,
    };

    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      const response = await AIService.generateMealPlan({
        ...submitData,
        // Fridge items will be automatically fetched from database by the AI service
      });
      setAiResponse(response);
    } catch (err) {
      console.error("Meal plan generation error:", err);

      // Set user-friendly error message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = (field: string) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const EnhancedDropdown = ({
    label,
    value,
    options,
    onChange,
    placeholder,
    field,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder: string;
    field: string;
  }) => {
    const isOpen = openDropdown === field;
    const selectedOption = options.find((option) => option === value);

    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-800">
          {label}
        </label>
        <div
          className="relative"
          ref={(el) => {
            dropdownRefs.current[field] = el;
          }}
        >
          <button
            type="button"
            onClick={() => toggleDropdown(field)}
            className={`w-full px-3 py-2.5 bg-white border rounded-lg transition-all duration-300 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
              isOpen
                ? "border-green-500 ring-2 ring-green-500/20 shadow-lg bg-green-50/30"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50/50"
            } ${value ? "text-gray-900" : "text-gray-400"}`}
          >
            <span
              className={`text-sm ${value ? "font-medium" : "font-normal"}`}
            >
              {selectedOption || placeholder}
            </span>
            <div className="flex items-center space-x-2">
              {value && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-60"></div>
              )}
              <ChevronDown
                className={`h-3.5 w-3.5 text-gray-400 transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 text-green-500"
                    : "group-hover:text-gray-600"
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpenDropdown(null)}
              />

              {/* Menu */}
              <div className="absolute z-50 w-full mt-1.5 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {/* Clear option */}
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-all duration-150 flex items-center justify-between group text-gray-500 hover:text-gray-700 border-b border-gray-100 ${
                      !value ? "bg-gray-50 text-gray-700" : ""
                    }`}
                  >
                    <span className="text-sm font-normal">{placeholder}</span>
                    {!value && (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <Check className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                    )}
                  </button>

                  {/* Options */}
                  {options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange(option)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-green-50/80 transition-all duration-150 flex items-center justify-between group ${
                        value === option
                          ? "bg-green-50 text-green-700 border-r-2 border-r-green-500"
                          : "text-gray-700 hover:text-gray-900"
                      } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
                    >
                      <span
                        className={`text-sm ${
                          value === option ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option}
                      </span>
                      {value === option && (
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-gradient-to-t bg-green-50 from-gray-50 via-white to-green-50/30 ${
        hasResults
          ? "py-8 min-h-[calc(100dvh-80px)]"
          : "min-h-[calc(100dvh-80px)] lg:pt-12"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 lg:p-6"
        >
          {/* Form Grid */}
          <div className="flex flex-wrap gap-4 lg:gap-6 mb-4">
            <div className="flex-1 min-w-[200px]">
              <EnhancedDropdown
                label={i18n.form.plan}
                value={formData.dietaryPreference}
                options={i18n.form.planOptions}
                onChange={(value) =>
                  handleDropdownChange("dietaryPreference", value)
                }
                placeholder={i18n.form.planPlaceholder}
                field="dietaryPreference"
              />
            </div>

            {/* Meal Type - Only show when "1 Dish" is selected */}
            {formData.dietaryPreference === i18n.form.planOptions[0] && (
              <div className="flex-1 min-w-[200px]">
                <EnhancedDropdown
                  label={i18n.form.mealType}
                  value={formData.mealFrequency}
                  options={i18n.form.mealTypeOptions}
                  onChange={(value) =>
                    handleDropdownChange("mealFrequency", value)
                  }
                  placeholder={i18n.form.mealTypePlaceholder}
                  field="mealFrequency"
                />
              </div>
            )}

            <div className="flex-1 min-w-[200px]">
              <EnhancedDropdown
                label={i18n.form.dietType}
                value={formData.activityLevel}
                options={i18n.form.dietTypeOptions}
                onChange={(value) =>
                  handleDropdownChange("activityLevel", value)
                }
                placeholder={i18n.form.dietTypePlaceholder}
                field="activityLevel"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <EnhancedDropdown
                label={i18n.form.goal}
                value={formData.goal}
                options={i18n.form.goalOptions}
                onChange={(value) => handleDropdownChange("goal", value)}
                placeholder={i18n.form.goalPlaceholder}
                field="goal"
              />
            </div>
          </div>

          {/* Toggle Button */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-800 mb-3">
              {i18n.form.recipePreference}
            </label>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-1.5 rounded-lg">
                  <Zap className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {i18n.form.quickRecipes}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {i18n.form.quickRecipesSub}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleChange}
                className={`relative hover:cursor-pointer inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  formData.quickRecipe ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                    formData.quickRecipe ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Custom Restrictions Input */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-800 mb-3">
              {i18n.form.restrictionsTitle}
            </label>
            <div className="space-y-2">
              <textarea
                value={formData.customRestrictions}
                onChange={(e) => handleCustomRestrictionsChange(e.target.value)}
                placeholder={i18n.form.restrictionsPlaceholder}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500 transition-colors resize-none placeholder:text-sm"
                rows={1}
              />
            </div>
          </div>

          {/* Fridge Items Indicator */}
          {hasFridgeItems && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">
                  🧊 Your fridge ingredients will be used in the recipes
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto group shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{i18n.form.loading}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{i18n.form.submit}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Meal Plan Response */}
        <MealPlanResponseComponent
          response={aiResponse}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default FormSection;
