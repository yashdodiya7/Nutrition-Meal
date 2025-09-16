"use client";

import { Button } from "@/components/ui/button";
import { Leaf, Refrigerator } from "lucide-react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { LanguageToggle } from "@/components/LanguageToggle";

export const HeaderNav = () => {
  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-green-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </Link>
        </div>

        {/* Right side: Fridge + Language + Auth */}
        <div className="flex items-center gap-3">
          {/* Fridge Icon */}
          <Link
            href="/fridge"
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            title="What's in Your Fridge?"
          >
            <Refrigerator className="h-5 w-5" />
          </Link>

          <LanguageToggle />
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-gray-700 cursor-pointer"
                >
                  Log In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-green-500 hover:bg-green-600 text-white px-6 cursor-pointer">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};
