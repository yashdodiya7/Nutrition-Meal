import { Clock, ChevronDown } from "lucide-react";
import { MealData } from "@/types/meal-plan";
import { useState, useMemo } from "react";

interface MealCardProps {
  meal: MealData;
}

function splitIngredients(text: string): string[] {
  if (!text) return [];
  // Try splitting by commas; fallback to newlines or semicolons
  const parts = text
    .split(/[,\n;]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

function splitInstructions(text: string): string[] {
  if (!text) return [];
  // Split on numbered steps like "1. ", "2)", or bullets; keep robust fallback by splitting on period if long
  const numbered = text
    .split(/\s*(?:\d+\.|\d+\)|•|-|→)\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  if (numbered.length > 1) return numbered;
  const sentences = text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length > 0 ? sentences : [text];
}

export const MealCard = ({ meal }: MealCardProps) => {
  const [open, setOpen] = useState(false);
  const ingredients = useMemo(
    () => splitIngredients(meal.ingredients),
    [meal.ingredients]
  );
  const steps = useMemo(
    () => splitInstructions(meal.instructions),
    [meal.instructions]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 bg-green-600 text-white hover:bg-green-700 transition-colors"
        aria-expanded={open}
      >
        <div className="text-left">
          <h3 className="text-base sm:text-lg font-semibold leading-tight">
            {meal.dishName}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {meal.cookingTime && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-medium">
              <Clock className="h-3.5 w-3.5" />
              {meal.cookingTime}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </button>

      {/* Body */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Ingredients */}
            <section>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                Ingredients
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm sm:text-base">
                {ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Instructions */}
            <section>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                Instructions
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm sm:text-base">
                {steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
            </section>

            {/* Nutrition */}
            <section>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
                Nutrition info
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs sm:text-sm font-medium text-green-700">
                  Protein: {meal.nutritionalInfo.protein}
                </span>
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs sm:text-sm font-medium text-blue-700">
                  Carbs: {meal.nutritionalInfo.carbs}
                </span>
                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs sm:text-sm font-medium text-orange-700">
                  Fat: {meal.nutritionalInfo.fat}
                </span>
                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs sm:text-sm font-medium text-red-700">
                  Calories: {meal.nutritionalInfo.calories}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
