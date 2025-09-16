import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user-service";

// POST - Sync user with database (create if doesn't exist)
export async function POST() {
  try {
    const user = await UserService.getOrCreateUser();
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error syncing user:", error);

    if (error instanceof Error && error.message.includes("not authenticated")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to sync user. Please try again." },
      { status: 500 }
    );
  }
}
