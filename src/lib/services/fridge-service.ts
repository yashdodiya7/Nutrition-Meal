import { prisma } from "@/lib/prisma";
import { UserService } from "./user-service";

export interface FridgeItemData {
  name: string;
  quantity: number;
  unit: string;
  category: "essential" | "fresh";
}

export class FridgeService {
  /**
   * Get all fridge items for current user
   */
  static async getFridgeItems() {
    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    return await prisma.fridgeItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Add new fridge item
   */
  static async addFridgeItem(data: FridgeItemData) {
    const user = await UserService.getOrCreateUser();

    return await prisma.fridgeItem.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
  }

  /**
   * Update fridge item
   */
  static async updateFridgeItem(itemId: string, data: Partial<FridgeItemData>) {
    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify item belongs to user
    const existingItem = await prisma.fridgeItem.findFirst({
      where: {
        id: itemId,
        userId: user.id,
      },
    });

    if (!existingItem) {
      throw new Error("Fridge item not found or access denied");
    }

    return await prisma.fridgeItem.update({
      where: { id: itemId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete fridge item
   */
  static async deleteFridgeItem(itemId: string) {
    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify item belongs to user
    const existingItem = await prisma.fridgeItem.findFirst({
      where: {
        id: itemId,
        userId: user.id,
      },
    });

    if (!existingItem) {
      throw new Error("Fridge item not found or access denied");
    }

    return await prisma.fridgeItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Get fridge items for meal plan generation
   */
  static async getFridgeItemsForMealPlan(): Promise<
    {
      id: string;
      name: string;
      quantity: number;
      unit: string;
      category: string;
    }[]
  > {
    const user = await UserService.getCurrentUser();

    if (!user) {
      return [];
    }

    const items = await prisma.fridgeItem.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        quantity: true,
        unit: true,
        category: true,
      },
    });

    return items;
  }
}
