"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageToggle = () => {
  const { language, toggle } = useLanguage();
  const isDe = language === "de";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle language"
      className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors min-w-[40px]"
    >
      {isDe ? "DE" : "EN"}
    </button>
  );
};
