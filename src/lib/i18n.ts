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
    goal: string;
    goalPlaceholder: string;
    goalOptions: string[];
    mealType: string;
    mealTypePlaceholder: string;
    mealTypeOptions: string[];
    recipePreference: string;
    quickRecipes: string;
    quickRecipesSub: string;
    restrictionsTitle: string;
    restrictionsPlaceholder: string;
    restrictionsHelp: string;
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
  fridge: {
    title: string;
    instructions: string;
    addItem: string;
    emptyTitle: string;
    emptyDesc: string;
    name: string;
    namePlaceholder: string;
    quantity: string;
    unit: string;
    cancel: string;
    add: string;
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
    plan: "Meal Plan Type",
    planPlaceholder: "Choose your meal plan type",
    planOptions: ["1 Dish", "1 Day Plan"],
    dietType: "Diet Type",
    dietTypePlaceholder: "Choose your diet preference",
    dietTypeOptions: ["Vegan", "Vegetarian", "Normal"],
    goal: "Health Goal",
    goalPlaceholder: "Select your health goal",
    goalOptions: [
      "Weight Loss",
      "Weight Gain",
      "Muscle Building",
      "General Health",
      "Athletic Performance",
    ],
    mealType: "Meal Type",
    mealTypePlaceholder: "Choose meal type",
    mealTypeOptions: ["Breakfast", "Lunch", "Dinner"],
    recipePreference: "Recipe Preference",
    quickRecipes: "Quick Recipes",
    quickRecipesSub: "20 minutes or less",
    restrictionsTitle: "Dietary Restrictions & Allergies",
    restrictionsPlaceholder:
      "Enter any allergies, dietary restrictions, or specific nutrition requirements. Leave empty if none.",
    restrictionsHelp:
      "Enter any allergies, dietary restrictions, or specific nutrition requirements. Leave empty if none.",
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
  fridge: {
    title: "What's in Your Fridge?",
    instructions: "Please add groceries that you have in your fridge.",
    addItem: "Add Groceries Item",
    emptyTitle: "Your fridge is empty",
    emptyDesc: "Start adding groceries to track what you have at home",
    name: "Item Name",
    namePlaceholder: "e.g., Milk, Carrots, Bread",
    quantity: "Quantity",
    unit: "Unit",
    cancel: "Cancel",
    add: "Add Item",
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
    plan: "Mahlzeitenplan-Typ",
    planPlaceholder: "Wähle deinen Mahlzeitenplan-Typ",
    planOptions: ["1 Gericht", "Tagesplan"],
    dietType: "Ernährungsform",
    dietTypePlaceholder: "Wähle deine Ernährungspräferenz",
    dietTypeOptions: ["Vegan", "Vegetarisch", "Normal"],
    goal: "Gesundheitsziel",
    goalPlaceholder: "Wähle dein Gesundheitsziel",
    goalOptions: [
      "Gewichtsverlust",
      "Gewichtszunahme",
      "Muskelaufbau",
      "Allgemeine Gesundheit",
      "Sportliche Leistung",
    ],
    mealType: "Mahlzeitentyp",
    mealTypePlaceholder: "Mahlzeit wählen",
    mealTypeOptions: ["Frühstück", "Mittagessen", "Abendessen"],
    recipePreference: "Rezeptpräferenz",
    quickRecipes: "Schnelle Rezepte",
    quickRecipesSub: "20 Minuten oder weniger",
    restrictionsTitle: "Ernährungseinschränkungen & Allergien",
    restrictionsPlaceholder:
      "z.B. glutenfrei, laktosefrei, Nussallergien oder spezifische Nährstoffanforderungen wie '200g Protein pro Tag'",
    restrictionsHelp:
      "Gib alle Allergien, Ernährungseinschränkungen oder spezifischen Nährstoffanforderungen ein. Leer lassen, wenn keine vorhanden.",
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
  fridge: {
    title: "Was ist in deinem Kühlschrank?",
    instructions:
      "Bitte füge Lebensmittel hinzu, die du in deinem Kühlschrank hast.",
    addItem: "Lebensmittel hinzufügen",
    emptyTitle: "Dein Kühlschrank ist leer",
    emptyDesc:
      "Beginne damit, Lebensmittel hinzuzufügen, um zu verfolgen, was du zu Hause hast",
    name: "Artikelname",
    namePlaceholder: "z.B. Milch, Karotten, Brot",
    quantity: "Menge",
    unit: "Einheit",
    cancel: "Abbrechen",
    add: "Artikel hinzufügen",
  },
};

export const getI18n = (lang: Lang): I18n => (lang === "de" ? de : en);
