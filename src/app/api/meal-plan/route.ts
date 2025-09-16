import { AIService, MealPlanRequest } from "@/lib/services/ai-service-server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.TOGETHER_API_KEY) {
      console.error("TOGETHER_API_KEY not configured");
      return NextResponse.json(
        { error: "Server not configured. Please contact support." },
        { status: 503 }
      );
    }

    const body: MealPlanRequest = await request.json();

    // Validate required fields
    if (!body.dietaryPreference || !body.activityLevel || !body.goal) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: dietaryPreference, activityLevel, and goal are required",
        },
        { status: 400 }
      );
    }

    // Call the AI service on the server
    const mealPlan = await AIService.generateMealPlan(body);

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error("Meal plan API error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (
        error.message.includes("API key") ||
        error.message.includes("authentication")
      ) {
        return NextResponse.json(
          { error: "Authentication failed. Please contact support." },
          { status: 401 }
        );
      }

      if (
        error.message.includes("rate limit") ||
        error.message.includes("quota")
      ) {
        return NextResponse.json(
          {
            error:
              "Service temporarily unavailable due to high demand. Please try again later.",
          },
          { status: 429 }
        );
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timeout. Please try again." },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate meal plan. Please try again." },
      { status: 500 }
    );
  }
}
