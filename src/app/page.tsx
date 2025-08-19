"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getI18n } from "@/lib/i18n";

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
  const i18n = getI18n(language);
  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero Section */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100 px-4 py-2 text-sm font-medium"
            >
              {i18n.landing.badge}
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {i18n.landing.headingTop}
          </h1>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight relative">
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {i18n.landing.headingHighlight}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl -z-10 transform scale-105"></div>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {i18n.landing.description}
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 cursor-pointer text-lg font-semibold group"
            onClick={() => router.push("/chat")}
          >
            {i18n.landing.cta}
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </main>
    </div>
  );
}
