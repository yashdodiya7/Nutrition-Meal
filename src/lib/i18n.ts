export type Lang = "en" | "de";

export type I18n = {
  landing: {
    badge: string;
    headingTop: string;
    headingHighlight: string;
    description: string;
    cta: string;
  };
  nav: {
    login: string;
    signup: string;
    languageEnglish: string;
    languageGerman: string;
  };
  form: {
    plan: string;
    planPlaceholder: string;
    planOptions: string[];
    dietType: string;
    dietTypePlaceholder: string;
    dietTypeOptions: string[];
    nutritional: string;
    nutritionalPlaceholder: string;
    nutritionalOptions: string[];
    mealType: string;
    mealTypePlaceholder: string;
    mealTypeOptions: string[];
    recipePreference: string;
    quickRecipes: string;
    quickRecipesSub: string;
    restrictionsTitle: string;
    restrictions: string[];
    submit: string;
    loading: string;
    requiredError: string;
  };
  results: {
    title: string;
    generatingTitle: string;
    generatingSub: string;
    tokensUsed: string; // e.g. "tokens used"
  };
};

const en: I18n = {
  landing: {
    badge: "✨ Smart Nutrition Planning",
    headingTop: "Generate Your Perfect",
    headingHighlight: "Meal Plan",
    description:
      "AI-powered nutrition planning that creates personalized meal plans based on your goals and preferences.",
    cta: "Start Generating Meals",
  },
  nav: {
    login: "Log In",
    signup: "Sign Up",
    languageEnglish: "English",
    languageGerman: "Deutsch",
  },
  form: {
    plan: "Plan",
    planPlaceholder: "Select your plan",
    planOptions: ["1 Dish", "1 Day Plan"],
    dietType: "Diet Type",
    dietTypePlaceholder: "Choose diet type",
    dietTypeOptions: ["Vegan", "Vegetarian", "Normal"],
    nutritional: "Nutritional Value",
    nutritionalPlaceholder: "Choose nutritional value",
    nutritionalOptions: ["High Nutrients", "Low Nutrients"],
    mealType: "Meal Type",
    mealTypePlaceholder: "Choose meal type",
    mealTypeOptions: ["Breakfast", "Lunch", "Dinner"],
    recipePreference: "Recipe Preference",
    quickRecipes: "Quick Recipes",
    quickRecipesSub: "20 minutes or less",
    restrictionsTitle: "Dietary Restrictions & Allergies",
    restrictions: [
      "Gluten-free",
      "Dairy-free",
      "Nut allergies",
      "Shellfish allergies",
      "Low sodium",
    ],
    submit: "Generate My Meal Plan",
    loading: "Your recipes are on the way...",
    requiredError: "Please fill in all required fields",
  },
  results: {
    title: "Your Personalized Meal Plan",
    generatingTitle: "Generating Your Meal Plan...",
    generatingSub: "AI is crafting your personalized nutrition plan",
    tokensUsed: "tokens used",
  },
};

const de: I18n = {
  landing: {
    badge: "✨ Intelligente Ernährungsplanung",
    headingTop: "Erstelle deinen perfekten",
    headingHighlight: "Ernährungsplan",
    description:
      "KI-gestützte Ernährungsplanung, die personalisierte Essenspläne basierend auf deinen Zielen und Vorlieben erstellt.",
    cta: "Mit der Planung beginnen",
  },
  nav: {
    login: "Anmelden",
    signup: "Registrieren",
    languageEnglish: "Englisch",
    languageGerman: "Deutsch",
  },
  form: {
    plan: "Plan",
    planPlaceholder: "Wähle deinen Plan",
    planOptions: ["1 Gericht", "Tagesplan"],
    dietType: "Ernährungsform",
    dietTypePlaceholder: "Ernährungsform wählen",
    dietTypeOptions: ["Vegan", "Vegetarisch", "Normal"],
    nutritional: "Nährwert",
    nutritionalPlaceholder: "Nährwert wählen",
    nutritionalOptions: ["Viele Nährstoffe", "Weniger Nährstoffe"],
    mealType: "Mahlzeitentyp",
    mealTypePlaceholder: "Mahlzeit wählen",
    mealTypeOptions: ["Frühstück", "Mittagessen", "Abendessen"],
    recipePreference: "Rezeptpräferenz",
    quickRecipes: "Schnelle Rezepte",
    quickRecipesSub: "20 Minuten oder weniger",
    restrictionsTitle: "Ernährungseinschränkungen & Allergien",
    restrictions: [
      "Glutenfrei",
      "Laktosefrei",
      "Nussallergien",
      "Schalentierallergien",
      "Wenig Natrium",
    ],
    submit: "Meinen Ernährungsplan erstellen",
    loading: "Deine Rezepte sind unterwegs...",
    requiredError: "Bitte fülle alle Pflichtfelder aus",
  },
  results: {
    title: "Dein personalisierter Ernährungsplan",
    generatingTitle: "Erstelle deinen Ernährungsplan...",
    generatingSub: "Die KI erstellt deinen persönlichen Ernährungsplan",
    tokensUsed: "Tokens verwendet",
  },
};

export const getI18n = (lang: Lang): I18n => (lang === "de" ? de : en);
