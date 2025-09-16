"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getI18n } from "@/lib/i18n";
import { Plus, X, ChevronDown, Check, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: "essential" | "fresh";
}

export default function FridgePage() {
  const { language } = useLanguage();
  const i18n = getI18n(language);

  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1 as number | string,
    unit: "L",
    category: "essential" as "essential" | "fresh",
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load grocery items from database on component mount
  useEffect(() => {
    const fetchFridgeItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setAuthError(false);

        const response = await fetch("/api/fridge");
        if (response.ok) {
          const data = await response.json();
          setGroceryItems(data.items);
        } else if (response.status === 401) {
          setAuthError(true);
          setGroceryItems([]);
        } else {
          setError("Failed to load fridge items. Please try again.");
        }
      } catch (error) {
        console.error("Error loading fridge items:", error);
        setError("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFridgeItems();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Filter items by category
  const essentialItems = groceryItems.filter(
    (item) => item.category === "essential"
  );
  const freshItems = groceryItems.filter((item) => item.category === "fresh");

  const addGroceryItem = async () => {
    if (!formData.name.trim()) return;

    const quantity =
      typeof formData.quantity === "string"
        ? parseFloat(formData.quantity) || 0
        : formData.quantity;

    try {
      setIsSubmitting(true);
      setError(null);

      if (editingItemId) {
        // Update existing item
        const response = await fetch(`/api/fridge/${editingItemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            quantity: quantity,
            unit: formData.unit,
            category: formData.category,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setGroceryItems((prev) =>
            prev.map((item) => (item.id === editingItemId ? data.item : item))
          );
        } else if (response.status === 401) {
          setError("Please log in to update items.");
        } else {
          setError("Failed to update item. Please try again.");
        }
      } else {
        // Add new item
        const response = await fetch("/api/fridge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            quantity: quantity,
            unit: formData.unit,
            category: formData.category,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setGroceryItems((prev) => [data.item, ...prev]);
        } else if (response.status === 401) {
          setError("Please log in to add items.");
        } else {
          setError("Failed to add item. Please try again.");
        }
      }

      // Reset form only if successful
      if (!error) {
        setFormData({
          name: "",
          quantity: 1,
          unit: "L",
          category: "essential",
        });
        setEditingItemId(null);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving fridge item:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGroceryItem = async (id: string) => {
    try {
      setIsDeleting(id);
      setError(null);

      const response = await fetch(`/api/fridge/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGroceryItems((prev) => prev.filter((item) => item.id !== id));
        setEditingItemId(null);
        setIsAddModalOpen(false);
      } else if (response.status === 401) {
        setError("Please log in to delete items.");
      } else {
        setError("Failed to delete item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting fridge item:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getUnitStyle = (unit: string) => {
    switch (unit) {
      case "L":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
        };
      case "Kgs":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "Grams":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-200",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
        };
    }
  };

  const toggleDropdown = (field: string) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const EnhancedDropdown = ({
    label,
    value,
    options,
    onChange,
    placeholder,
    field,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder: string;
    field: string;
  }) => {
    const isOpen = openDropdown === field;
    const selectedOption = options.find((option) => option === value);

    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-800">
          {label}
        </label>
        <div
          className="relative"
          ref={(el) => {
            dropdownRefs.current[field] = el;
          }}
        >
          <button
            type="button"
            onClick={() => toggleDropdown(field)}
            className={`w-full px-3 py-2.5 bg-white border rounded-lg transition-all duration-300 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
              isOpen
                ? "border-green-500 ring-2 ring-green-500/20 shadow-lg bg-green-50/30"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50/50"
            } ${value ? "text-gray-900" : "text-gray-400"}`}
          >
            <span
              className={`text-sm ${value ? "font-medium" : "font-normal"}`}
            >
              {selectedOption || placeholder}
            </span>
            <div className="flex items-center space-x-2">
              {value && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-60"></div>
              )}
              <ChevronDown
                className={`h-3.5 w-3.5 text-gray-400 transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 text-green-500"
                    : "group-hover:text-gray-600"
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpenDropdown(null)}
              />

              {/* Menu */}
              <div className="absolute z-50 w-full mt-1.5 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {/* Clear option */}
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setOpenDropdown(null);
                    }}
                    className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-all duration-150 flex items-center justify-between group text-gray-500 hover:text-gray-700 border-b border-gray-100 ${
                      !value ? "bg-gray-50 text-gray-700" : ""
                    }`}
                  >
                    <span className="text-sm font-normal">{placeholder}</span>
                    {!value && (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <Check className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                    )}
                  </button>

                  {/* Options */}
                  {options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-3 py-2.5 text-left hover:bg-green-50/80 transition-all duration-150 flex items-center justify-between group ${
                        value === option
                          ? "bg-green-50 text-green-700 border-r-2 border-r-green-500"
                          : "text-gray-700 hover:text-gray-900"
                      } ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
                    >
                      <span
                        className={`text-sm ${
                          value === option ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option}
                      </span>
                      {value === option && (
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderGroceryGrid = (items: GroceryItem[], emptyMessage: string) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🧊</span>
          </div>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => {
          const unitStyle = getUnitStyle(item.unit);
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
              onClick={() => {
                setFormData({
                  name: item.name,
                  quantity: item.quantity,
                  unit: item.unit,
                  category: item.category,
                });
                setEditingItemId(item.id);
                setIsAddModalOpen(true);
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    {item.quantity}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${unitStyle.bgColor} ${unitStyle.textColor}`}
                  >
                    {item.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-gradient-to-t bg-green-50 from-gray-50 via-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/chat"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">
                Back to Meal Generator
              </span>
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            {i18n.fridge.title}
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Auth Error Message */}
        {authError && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🔒</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Authentication Required
                </p>
                <p className="text-xs text-blue-700">
                  Please register or login first to add items to your fridge.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={authError}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md ${
              authError
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <Plus className="h-4 w-4" />
            {i18n.fridge.addItem}
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-green-500" />
              <span className="text-gray-600">Loading your fridge...</span>
            </div>
          </div>
        ) : (
          /* Two Column Layout */
          <div className="flex gap-6">
            {/* Essential Groceries - 1/3 */}
            <div className="w-1/3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Essential Items
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                  Daily essentials like milk, yogurt, bread
                </p>
                {renderGroceryGrid(essentialItems, "No essential items yet")}
              </div>
            </div>

            {/* Separator Line */}
            <div className="w-px bg-gradient-to-b from-transparent via-gray-200/50 to-transparent"></div>

            {/* Fresh Groceries - 2/3 */}
            <div className="w-2/3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Fresh Items
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                  Vegetables, fruits, and perishables
                </p>
                {renderGroceryGrid(freshItems, "No fresh items yet")}
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Grocery Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingItemId ? "Edit Item" : "Add Grocery Item"}
                  </h2>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingItemId(null);
                      setFormData({
                        name: "",
                        quantity: 1,
                        unit: "L",
                        category: "essential",
                      });
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 py-6 space-y-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    {i18n.fridge.name}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                    placeholder={i18n.fridge.namePlaceholder}
                    required
                  />
                </div>

                {/* Category */}
                <EnhancedDropdown
                  label="Category"
                  value={formData.category}
                  options={["essential", "fresh"]}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value as "essential" | "fresh",
                    }))
                  }
                  placeholder="Select category"
                  field="category"
                />

                {/* Quantity and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-800">
                      {i18n.fridge.quantity}
                    </label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and one decimal point, max 2 decimal places
                        if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
                          setFormData((prev) => ({
                            ...prev,
                            quantity: value === "" ? "" : value,
                          }));
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value && !isNaN(parseFloat(value))) {
                          setFormData((prev) => ({
                            ...prev,
                            quantity: parseFloat(value),
                          }));
                        }
                      }}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
                      placeholder="1.53"
                      required
                    />
                  </div>
                  <EnhancedDropdown
                    label={i18n.fridge.unit}
                    value={formData.unit}
                    options={["L", "Kgs", "Grams"]}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        unit: value,
                      }))
                    }
                    placeholder="Select unit"
                    field="unit"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                <div className="flex gap-3">
                  {editingItemId && (
                    <button
                      type="button"
                      onClick={() => deleteGroceryItem(editingItemId)}
                      disabled={isDeleting === editingItemId}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        isDeleting === editingItemId
                          ? "bg-red-300 text-red-100 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {isDeleting === editingItemId ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={addGroceryItem}
                    disabled={isSubmitting}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? "bg-green-300 text-green-100 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {editingItemId ? "Updating..." : "Adding..."}
                      </>
                    ) : editingItemId ? (
                      "Update"
                    ) : (
                      i18n.fridge.add
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
