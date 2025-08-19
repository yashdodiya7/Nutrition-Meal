import { AIService, MealPlanRequest } from "@/lib/services/ai-service-server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: MealPlanRequest = await request.json();

    // Validate required fields
    if (!body.dietaryPreference || !body.activityLevel || !body.goal) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the AI service on the server
    const mealPlan = await AIService.generateMealPlan(body);

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error("Meal plan API error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
