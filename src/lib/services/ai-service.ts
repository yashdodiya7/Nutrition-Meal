import type { MealPlanRequest, MealPlanResponse } from "./ai-service-server";

export class AIService {
  /**
   * Generate meal plan by calling our secure server-side API
   */
  static async generateMealPlan(
    request: MealPlanRequest
  ): Promise<MealPlanResponse> {
    try {
      const response = await fetch("/api/meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const mealPlan: MealPlanResponse = await response.json();
      return mealPlan;
    } catch (error) {
      console.error("Client AI Service Error:", error);
      throw new Error("Failed to generate meal plan. Please try again.");
    }
  }
}
