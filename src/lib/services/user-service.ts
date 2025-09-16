import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export class UserService {
  /**
   * Get or create user from Clerk authentication
   */
  static async getOrCreateUser() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Create user if doesn't exist
    if (!user) {
      const email = sessionClaims?.email as string | undefined;

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email || null,
        },
      });
    }

    return user;
  }

  /**
   * Get user by Clerk ID
   */
  static async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        fridgeItems: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    return await this.getUserByClerkId(userId);
  }
}
