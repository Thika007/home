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
  const [selectedPriceOption, setSelectedPriceOption] = useState(null);

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSpecialInstructions("");
      // Set default price option (first one if available, or base price)
      if (item.priceOptions && item.priceOptions.length > 0) {
        setSelectedPriceOption(item.priceOptions[0]);
      } else {
        setSelectedPriceOption(null);
      }
    }
  }, [item?.id]);

  if (!isOpen || !item) return null;

  const handleAddToCart = () => {
    // Use selected price option price, or fallback to base price
    let price = item.price || 0;
    let selectedOptionName = null;
    
    if (selectedPriceOption) {
      price = parseFloat(selectedPriceOption.price) || price;
      selectedOptionName = selectedPriceOption.optionName || null;
    } else {
      // Fallback: extract from priceDisplay or use base price
      const priceMatch = item.priceDisplay?.match(/[\d.]+/);
      price = priceMatch ? parseFloat(priceMatch[0]) : price;
    }

    addToCart({
      ...item,
      price: price,
      selectedPriceOption: selectedPriceOption ? {
        id: selectedPriceOption.id,
        optionName: selectedPriceOption.optionName,
        price: selectedPriceOption.price
      } : null,
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
  
  // Get current price based on selected option
  let itemPrice = item.price || 0;
  if (selectedPriceOption) {
    itemPrice = parseFloat(selectedPriceOption.price) || itemPrice;
  } else {
    // Fallback: extract from priceDisplay
    const priceMatch = item.priceDisplay?.match(/[\d.]+/);
    itemPrice = priceMatch ? parseFloat(priceMatch[0]) : itemPrice;
  }
  const totalPrice = itemPrice * quantity;

  // Check if item has multiple price options
  const hasMultiplePriceOptions = item.priceOptions && item.priceOptions.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
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

        {/* Desktop Grid Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-0">
          {/* Product Image */}
          <div className="relative h-64 w-full overflow-hidden rounded-t-2xl lg:h-full lg:min-h-[500px] lg:rounded-l-2xl lg:rounded-tr-none bg-slate-100">
          {item.image || item.imageUrl ? (
            <img
              src={item.image || item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              🍽️
            </div>
          )}
          {item.markAsSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
              <span className="rounded-full bg-rose-500 px-6 py-3 text-lg font-semibold text-white">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 lg:max-h-[500px] lg:overflow-y-auto">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
            {item.featured && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                FEATURED
              </span>
            )}
            {item.recommended && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                {item.recommended}
              </span>
            )}
          </div>
          <p className="mb-4 text-slate-600">{item.description || "No description provided."}</p>

          {/* Labels */}
          {item.labels && (
            <div className="mb-4 flex flex-wrap gap-2">
              {item.labels.split(',').map((label, idx) => (
                <span key={idx} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {label.trim()}
                </span>
              ))}
            </div>
          )}

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
                <span>{item.preparationTime} {item.preparationTime.includes('min') ? '' : 'minutes'}</span>
              </div>
            )}
            {item.size && (
              <div className="flex items-center gap-2">
                <span>Size: {item.size}{item.unit ? ` ${item.unit}` : ''}</span>
              </div>
            )}
            {item.displayOn && item.displayOn.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Available for: {item.displayOn.map(type => type === 'dine-in' ? '🍽️ Dine in' : '🥡 Takeaway').join(', ')}</span>
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

          {/* Price Options Dropdown (if multiple options) */}
          {hasMultiplePriceOptions && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select Size/Portion: <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPriceOption ? selectedPriceOption.id : ""}
                onChange={(e) => {
                  const optionId = parseInt(e.target.value);
                  const option = item.priceOptions.find(opt => opt.id === optionId);
                  setSelectedPriceOption(option || null);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {item.priceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.optionName || "Default"} - LKR {parseFloat(option.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Display */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Price: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={`LKR ${itemPrice.toFixed(2)}${hasMultiplePriceOptions && selectedPriceOption ? ` (${selectedPriceOption.optionName || 'Selected'})` : ''}`}
              readOnly
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 bg-slate-50"
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
            disabled={item.markAsSoldOut || !item.isAvailable}
            className={`w-full rounded-lg px-6 py-4 text-lg font-semibold text-white transition ${
              item.markAsSoldOut || !item.isAvailable
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {item.markAsSoldOut ? 'SOLD OUT' : !item.isAvailable ? 'UNAVAILABLE' : 'ADD TO CART'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

