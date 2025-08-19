import { MealPlanResponse } from "@/types/meal-plan";
import { Sparkles, Clock, Brain } from "lucide-react";
import { MealCard } from "./MealCard";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getI18n } from "@/lib/i18n";

interface MealPlanResponseProps {
  response: MealPlanResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const MealPlanResponseComponent = ({
  response,
  isLoading,
  error,
}: MealPlanResponseProps) => {
  const responseRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const i18n = getI18n(language);

  // Auto-scroll to response when it arrives
  useEffect(() => {
    if (response && responseRef.current) {
      setTimeout(() => {
        responseRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [response]);

  if (isLoading) {
    return (
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 lg:p-8 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {i18n.results.generatingTitle}
            </h3>
            <p className="text-sm text-gray-600">
              {i18n.results.generatingSub}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-green-200 rounded animate-pulse"></div>
          <div className="h-4 bg-green-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-green-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!response) {
    return null;
  }

  return (
    <div
      ref={responseRef}
      className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 sm:p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {i18n.results.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Meal Cards List (one column collapsible) */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {response.meals.map((meal, index) => (
          <MealCard key={`${meal.dishName}-${index}`} meal={meal} />
        ))}
      </div>

      {response.meals.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No meal data found in the response.</p>
        </div>
      )}
    </div>
  );
};
