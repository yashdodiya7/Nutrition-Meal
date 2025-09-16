import { NextRequest, NextResponse } from "next/server";
import { FridgeService } from "@/lib/services/fridge-service";

// GET - Fetch all fridge items for current user
export async function GET() {
  try {
    const items = await FridgeService.getFridgeItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching fridge items:", error);

    if (error instanceof Error && error.message.includes("not authenticated")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch fridge items. Please try again." },
      { status: 500 }
    );
  }
}

// POST - Add new fridge item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, quantity, unit, category } = body;

    // Validate required fields
    if (!name || quantity === undefined || !unit || !category) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, quantity, unit, and category are required",
        },
        { status: 400 }
      );
    }

    // Validate quantity is a positive number
    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    // Validate category
    if (!["essential", "fresh"].includes(category)) {
      return NextResponse.json(
        { error: "Category must be either 'essential' or 'fresh'" },
        { status: 400 }
      );
    }

    const item = await FridgeService.addFridgeItem({
      name: name.trim(),
      quantity: parsedQuantity,
      unit,
      category,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Error adding fridge item:", error);

    if (error instanceof Error && error.message.includes("not authenticated")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add fridge item. Please try again." },
      { status: 500 }
    );
  }
}
