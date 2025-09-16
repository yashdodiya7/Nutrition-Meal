import { NextRequest, NextResponse } from "next/server";
import { FridgeService } from "@/lib/services/fridge-service";

// PUT - Update fridge item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, quantity, unit, category } = body;

    // Validate ID parameter
    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Validate quantity if provided
    if (quantity !== undefined) {
      const parsedQuantity = parseFloat(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return NextResponse.json(
          { error: "Quantity must be a positive number" },
          { status: 400 }
        );
      }
    }

    // Validate category if provided
    if (category && !["essential", "fresh"].includes(category)) {
      return NextResponse.json(
        { error: "Category must be either 'essential' or 'fresh'" },
        { status: 400 }
      );
    }

    const item = await FridgeService.updateFridgeItem(id, {
      name: name ? name.trim() : undefined,
      quantity: quantity ? parseFloat(quantity) : undefined,
      unit,
      category,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error updating fridge item:", error);

    if (error instanceof Error) {
      if (error.message.includes("not authenticated")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (
        error.message.includes("not found") ||
        error.message.includes("access denied")
      ) {
        return NextResponse.json(
          { error: "Item not found or access denied" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update fridge item. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE - Delete fridge item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Validate ID parameter
    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await FridgeService.deleteFridgeItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting fridge item:", error);

    if (error instanceof Error) {
      if (error.message.includes("not authenticated")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (
        error.message.includes("not found") ||
        error.message.includes("access denied")
      ) {
        return NextResponse.json(
          { error: "Item not found or access denied" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to delete fridge item. Please try again." },
      { status: 500 }
    );
  }
}
