export interface MealPlanRequest {
  dietaryPreference: string;
  activityLevel: string;
  goal: string;
  mealFrequency: string;
  restrictions: string[];
  quickRecipe: boolean;
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
