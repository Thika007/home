import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { UserMenuNavbar } from "../components/UserMenuNavbar";

export function UserMenuCartPage() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity,
    subtotal,
    tipPercentage,
    tipAmount,
    tipValue,
    setTip,
    setCustomTip,
    cartTotal,
    clearCart
  } = useCart();
  const { isAuthenticated, user } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Store cart data and redirect to login
      navigate("/menu-login?redirect=checkout");
      return;
    }

    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      userId: user.id || user.email,
      userName: user.name || user.email,
      userEmail: user.email,
      items: cartItems.map(item => ({
        name: item.name,
        description: item.description,
        price: parseFloat(item.price) || parseFloat(item.priceDisplay?.replace(/[^\d.]/g, "")) || 0,
        quantity: item.quantity || 1,
        specialInstructions: item.specialInstructions || "",
        image: item.image || null,
      })),
      subtotal,
      tip: tipValue,
      total: cartTotal,
      status: "pending",
      createdAt: new Date().toISOString(),
      deliveryMethod: "dine-in", // Default, can be changed
      paymentMethod: "pending",
    };

    // Save order to localStorage (owner dashboard will read from here)
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    // Clear cart
    clearCart();

    // Show success notification
    alert(`Order placed successfully! Order ID: ${order.id}`);

    // Navigate back to menu
    navigate("/menu");
  };

  const handleAddMoreItems = () => {
    navigate("/menu");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] text-slate-900">
        <UserMenuNavbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-slate-600">Your cart is empty</p>
            <button
              onClick={handleAddMoreItems}
              className="mt-4 rounded-lg bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
            >
              Add Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-slate-900">
      <UserMenuNavbar />
      
      {/* Cart Popup/Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="relative w-full max-w-xl rounded-2xl bg-slate-50 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4">
            <button
              onClick={() => navigate("/menu")}
              className="text-white transition hover:text-emerald-300"
              aria-label="Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-white">My cart</h2>
            <button
              onClick={() => navigate("/menu")}
              className="text-white transition hover:text-emerald-300"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-[50vh] overflow-y-auto p-6">
            {cartItems.map((item, index) => {
              const itemPrice = parseFloat(item.price) || parseFloat(item.priceDisplay?.replace(/[^\d.]/g, "")) || 0;
              return (
                <div key={index} className="mb-4 flex items-center gap-4 border-b border-slate-200 pb-4 last:border-0">
                  {/* Item Image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-600">LKR {itemPrice.toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-slate-400 transition hover:text-red-500"
                    aria-label="Remove item"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 transition hover:bg-slate-50"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center font-semibold">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-900 transition hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add more items link */}
            <button
              onClick={handleAddMoreItems}
              className="mt-4 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              Add more items
            </button>
          </div>

          {/* Add Tip Section */}
          <div className="border-t border-slate-200 bg-white p-6">
            <label className="mb-3 block text-sm font-semibold text-slate-700">Add tip</label>
            <div className="mb-3 flex gap-2">
              {[5, 10, 15, 20].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setTip(percent)}
                  className={`flex-1 rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
                    tipPercentage === percent
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="or an amount?"
              value={tipAmount}
              onChange={(e) => setCustomTip(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none"
            />
          </div>

          {/* Order Summary */}
          <div className="border-t border-slate-200 bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Subtotal:</span>
              <span className="text-sm font-semibold text-slate-900">LKR {subtotal.toFixed(2)}</span>
            </div>
            {tipValue > 0 && (
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Tip:</span>
                <span className="text-sm font-semibold text-slate-900">LKR {tipValue.toFixed(2)}</span>
              </div>
            )}
            <div className="mb-4 flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-base font-bold text-slate-900">Total:</span>
              <span className="text-base font-bold text-slate-900">LKR {cartTotal.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full rounded-lg bg-slate-900 px-6 py-4 text-lg font-semibold text-amber-300 transition hover:bg-slate-800"
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

