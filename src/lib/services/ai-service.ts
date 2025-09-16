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

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error("Please log in to generate meal plans.");
        } else if (response.status === 429) {
          throw new Error(
            "Too many requests. Please wait a moment and try again."
          );
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else if (response.status === 503) {
          throw new Error(
            "Service temporarily unavailable. Please try again later."
          );
        }

        throw new Error(
          errorData.error || `Failed to generate meal plan (${response.status})`
        );
      }

      const mealPlan: MealPlanResponse = await response.json();
      return mealPlan;
    } catch (error) {
      console.error("Client AI Service Error:", error);

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }

      // Re-throw known errors
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
