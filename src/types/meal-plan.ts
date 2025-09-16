export interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: "essential" | "fresh";
}

export interface MealPlanRequest {
  dietaryPreference: string;
  activityLevel: string;
  goal: string;
  mealFrequency: string;
  customRestrictions: string;
  quickRecipe: boolean;
  language?: "en" | "de";
  fridgeItems?: FridgeItem[];
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

export interface FormData {
  dietaryPreference: string;
  activityLevel: string;
  goal: string;
  mealFrequency: string;
  restrictions: string[];
  quickRecipe: boolean;
}
