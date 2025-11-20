import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("menuCart");
    return saved ? JSON.parse(saved) : [];
  });

  const [tipPercentage, setTipPercentage] = useState(null);
  const [tipAmount, setTipAmount] = useState("");

  const saveToStorage = useCallback((items) => {
    localStorage.setItem("menuCart", JSON.stringify(items));
  }, []);

  const addToCart = useCallback((item) => {
    setCartItems((prev) => {
      const newItems = [...prev, item];
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const removeFromCart = useCallback((index) => {
    setCartItems((prev) => {
      const newItems = prev.filter((_, i) => i !== index);
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const updateQuantity = useCallback((index, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], quantity: newQuantity };
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setTipPercentage(null);
    setTipAmount("");
    saveToStorage([]);
  }, [saveToStorage]);

  const setTip = useCallback((percentage) => {
    setTipPercentage(percentage);
    setTipAmount("");
  }, []);

  const setCustomTip = useCallback((amount) => {
    setTipAmount(amount);
    setTipPercentage(null);
  }, []);

  const cartItemsCount = cartItems.length;
  
  const subtotal = cartItems.reduce((sum, item) => {
    // Use selected price option price if available, otherwise use base price
    let price = 0;
    if (item.selectedPriceOption && item.selectedPriceOption.price) {
      price = parseFloat(item.selectedPriceOption.price) || 0;
    } else {
      price = parseFloat(item.price) || parseFloat(item.priceDisplay?.replace(/[^\d.]/g, "")) || 0;
    }
    return sum + price * (item.quantity || 1);
  }, 0);

  const tipValue = tipPercentage 
    ? (subtotal * tipPercentage / 100)
    : (parseFloat(tipAmount) || 0);

  const cartTotal = subtotal + tipValue;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemsCount,
        subtotal,
        tipPercentage,
        tipAmount,
        tipValue,
        setTip,
        setCustomTip,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

