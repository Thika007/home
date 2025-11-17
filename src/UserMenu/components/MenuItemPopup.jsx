import React, { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";

export function MenuItemPopup({ 
  item, 
  categoryItems, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNavigate 
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSpecialInstructions("");
    }
  }, [item?.id]);

  if (!isOpen || !item) return null;

  const handleAddToCart = () => {
    // Extract price from priceDisplay or use price field
    const priceMatch = item.priceDisplay?.match(/[\d.]+/);
    const price = item.price || (priceMatch ? parseFloat(priceMatch[0]) : 0);

    addToCart({
      ...item,
      price: price,
      quantity,
      specialInstructions,
      addedAt: new Date().toISOString(),
    });
    onClose();
    setQuantity(1);
    setSpecialInstructions("");
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < categoryItems.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < categoryItems.length - 1;
  
  // Extract price for display
  const priceMatch = item.priceDisplay?.match(/[\d.]+/);
  const itemPrice = item.price || (priceMatch ? parseFloat(priceMatch[0]) : 0);
  const totalPrice = itemPrice * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Product Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-t-2xl bg-slate-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              🍽️
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">{item.name}</h2>
          <p className="mb-4 text-slate-600">{item.description || "No description provided."}</p>

          {/* Product Info */}
          <div className="mb-4 space-y-2 text-sm text-slate-500">
            {item.preparationTime && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{item.preparationTime} minutes</span>
              </div>
            )}
            {item.size && (
              <div className="flex items-center gap-2">
                <span>Size: {item.size}</span>
              </div>
            )}
            {item.orderType && (
              <div className="flex items-center gap-2">
                <span>Order Type: {item.orderType}</span>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {categoryItems.length > 1 && (
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                  canGoPrevious
                    ? "border-slate-900 bg-white text-slate-900 hover:bg-slate-50"
                    : "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
                }`}
                aria-label="Previous item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="text-sm text-slate-500">
                {currentIndex + 1} of {categoryItems.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                  canGoNext
                    ? "border-slate-900 bg-white text-slate-900 hover:bg-slate-50"
                    : "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
                }`}
                aria-label="Next item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Price: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={`LKR ${totalPrice.toFixed(2)}`}
              readOnly
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
            />
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Special instructions:
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Please let us know if you are allergic to anything or if we need to avoid some ingredients"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none"
              rows={3}
            />
          </div>

          {/* Total and Quantity */}
          <div className="mb-6 flex items-center justify-between border-t border-slate-200 pt-4">
            <div>
              <span className="text-sm font-semibold text-slate-700">Total:</span>
              <span className="ml-2 text-xl font-bold text-slate-900">
                LKR {totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-semibold text-slate-900 transition hover:bg-slate-50"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[3rem] text-center text-lg font-semibold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-semibold text-slate-900 transition hover:bg-slate-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-lg bg-slate-900 px-6 py-4 text-lg font-semibold text-white transition hover:bg-slate-800"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}

