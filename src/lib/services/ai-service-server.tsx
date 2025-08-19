import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // Server-side only, no NEXT_PUBLIC prefix
});

export interface MealPlanRequest {
  dietaryPreference: string;
  activityLevel: string;
  goal: string;
  mealFrequency: string;
  restrictions: string[];
  quickRecipe: boolean;
  language?: "en" | "de";
}

export interface MealPlanResponse {
  content: string;
  rawContent: string;
  model: string;
  meals: MealData[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;
}

export interface MealData {
  dishName: string;
  ingredients: string;
  instructions: string;
  nutritionalInfo: NutritionalInfo;
  cookingTime: string;
}

export interface NutritionalInfo {
  protein: string;
  carbs: string;
  fat: string;
  calories: string;
}

export class AIService {
  private static readonly SYSTEM_PROMPT = `You are a professional nutritionist and meal planning expert in Germany. Your task is to create personalized German dishes meal plans based on user preferences and dietary requirements.

Guidelines:
- Always provide practical, realistic meal suggestions for german dishes which is regularly used in german kitchen
- Consider dietary restrictions and allergies
- Always Include nutritional information
- Be encouraging and supportive in your tone
- Format your response in a clear, easy-to-read structure
- Include estimated cooking times for every dish

Rules:
- Always stick to the guidelines and rules never provide any other information than the response format
- Always return the output strictly inside a single <dishes> tag, containing multiple dishes, where each dish must have the following elements in order: <dish_name>,<dish_ingredients>, <dish_instructions>, <dish_nutritional_information> (with <protine>, <carbs>, <fat>, <calories>), and <dish_estimated_cooking_time>. Repeat this sequence for each dish without adding any extra text or formatting outside the <dishes> tag.
- The entire response (instead of tag names as per the format) must be written in the website language sent by the client (language: 'en' for English, 'de' for German). Do not include translations to other languages.
- Always give <dish_ingredients> seperated by comma only.

Response Format:
<dishes>
<dish_name>Name of the Dish</dish_name>
<dish_ingredients>Ingredients of the Dish</dish_ingredients>
<dish_instructions>Instructions for cooking the Dish</dish_instructions>
<dish_nutritional_information>Nutritional information of the Dish in a table format</dish_nutritional_information> // like <protine>10g</protine> <carbs>10g</carbs> <fat>10g</fat> <calories>100kcal</calories>
<dish_estimated_cooking_time>Estimated cooking time for the Dish</dish_estimated_cooking_time>
</dishes>

Respond in a helpful, professional manner with actionable meal planning advice.`;

  static async generateMealPlan(
    request: MealPlanRequest
  ): Promise<MealPlanResponse> {
    try {
      const userMessage = this.buildUserMessage(request);

      const response = await together.chat.completions.create({
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
        stream: false,
        temperature: 0.7,
      });

      const choice = response.choices[0];
      if (!choice?.message?.content) {
        throw new Error("No content received from AI model");
      }

      // Clean and format the response content
      const cleanedContent = this.cleanResponseContent(choice.message.content);

      // Parse the response into structured meal data
      const meals = this.parseMealData(choice.message.content);

      return {
        content: cleanedContent,
        rawContent: choice.message.content,
        model: response.model,
        meals: meals,
        usage: response.usage,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw new Error("Failed to generate meal plan. Please try again.");
    }
  }

  private static buildUserMessage(request: MealPlanRequest): string {
    const parts = [
      `I need a meal plan with the following preferences:`,
      `- Website language: ${request.language === "de" ? "de" : "en"}`,
      `- Plan Type: ${request.dietaryPreference}`,
      `- Diet Type: ${request.activityLevel}`,
      `- Nutritional Value: ${request.goal}`,
    ];

    if (request.dietaryPreference === "1 Dish" && request.mealFrequency) {
      parts.push(`- Meal Type: ${request.mealFrequency}`);
    }

    if (request.quickRecipe) {
      parts.push(`- Quick Recipes: Yes (20 minutes or less)`);
    }

    if (request.restrictions.length > 0) {
      parts.push(`- Dietary Restrictions: ${request.restrictions.join(", ")}`);
    }

    parts.push(
      `\nPlease provide a detailed meal plan based on these preferences.`
    );

    return parts.join("\n");
  }

  private static cleanResponseContent(content: string): string {
    // Remove <think></think> sections
    let cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "");

    // Remove any remaining think tags
    cleaned = cleaned.replace(/<\/?think>/g, "");

    // Clean up extra whitespace and newlines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n");
    cleaned = cleaned.trim();

    return cleaned;
  }

  private static parseMealData(content: string): MealData[] {
    const meals: MealData[] = [];

    try {
      // First, clean up the content by removing think tags and normalizing whitespace
      let cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/g, "");
      cleanedContent = cleanedContent.replace(/<\/?think>/g, "");

      // Find all dish_name tags and their corresponding content
      const dishNameRegex = /<dish_name>(.*?)<\/dish_name>/g;
      const dishNameMatches = [...cleanedContent.matchAll(dishNameRegex)];

      dishNameMatches.forEach((match, index) => {
        try {
          const dishName = match[1].trim();
          const startIndex = match.index!;

          // Find the end of this dish (either next dish_name or end of dishes tag)
          let endIndex = cleanedContent.length;
          const nextDishMatch = dishNameMatches[index + 1];
          if (nextDishMatch) {
            endIndex = nextDishMatch.index!;
          } else {
            // If this is the last dish, find the closing dishes tag
            const dishesEndMatch = cleanedContent.indexOf(
              "</dishes>",
              startIndex
            );
            if (dishesEndMatch !== -1) {
              endIndex = dishesEndMatch;
            }
          }

          // Extract the dish block content
          const dishBlock = cleanedContent.substring(startIndex, endIndex);

          // Parse individual components
          const ingredients = this.extractTagContent(
            dishBlock,
            "dish_ingredients"
          );
          const instructions = this.extractTagContent(
            dishBlock,
            "dish_instructions"
          );
          const cookingTime = this.extractTagContent(
            dishBlock,
            "dish_estimated_cooking_time"
          );
          const nutritionalText = this.extractTagContent(
            dishBlock,
            "dish_nutritional_information"
          );

          // Parse nutritional information
          const nutritionalInfo = this.parseNutritionalInfo(nutritionalText);

          // Only add if we have the essential information
          if (dishName && ingredients && instructions) {
            meals.push({
              dishName,
              ingredients,
              instructions,
              nutritionalInfo,
              cookingTime: cookingTime || "Not specified",
            });
          }
        } catch (error) {
          console.error(`Error parsing dish ${index + 1}:`, error);
        }
      });
    } catch (error) {
      console.error("Error in parseMealData:", error);
    }

    return meals;
  }

  private static extractTagContent(content: string, tagName: string): string {
    const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, "s");
    const match = content.match(regex);
    return match ? match[1].trim() : "";
  }

  private static parseNutritionalInfo(
    nutritionalText: string
  ): NutritionalInfo {
    const defaultInfo: NutritionalInfo = {
      protein: "0g",
      carbs: "0g",
      fat: "0g",
      calories: "0kcal",
    };

    if (!nutritionalText) return defaultInfo;

    try {
      // Extract each nutritional component with flexible regex
      const proteinMatch = nutritionalText.match(/<protine>(.*?)<\/protine>/i);
      const carbsMatch = nutritionalText.match(/<carbs>(.*?)<\/carbs>/i);
      const fatMatch = nutritionalText.match(/<fat>(.*?)<\/fat>/i);
      const caloriesMatch = nutritionalText.match(
        /<calories>(.*?)<\/calories>/i
      );

      return {
        protein: proteinMatch ? proteinMatch[1].trim() : defaultInfo.protein,
        carbs: carbsMatch ? carbsMatch[1].trim() : defaultInfo.carbs,
        fat: fatMatch ? fatMatch[1].trim() : defaultInfo.fat,
        calories: caloriesMatch
          ? caloriesMatch[1].trim()
          : defaultInfo.calories,
      };
    } catch (error) {
      console.error("Error parsing nutritional info:", error);
      return defaultInfo;
    }
  }
}
