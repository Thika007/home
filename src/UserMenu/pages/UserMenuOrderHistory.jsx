import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserMenuNavbar } from "../components/UserMenuNavbar";
import { orderAPI } from "../../services/api";

export function UserMenuOrderHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/menu-login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderAPI.getUserOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] text-slate-900">
        <UserMenuNavbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-lg text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-slate-900">
      <UserMenuNavbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
          <button
            onClick={() => navigate("/menu")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Menu
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-slate-600">No orders found</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-4 rounded-lg bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-800"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Order #{order.orderId}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-slate-600">
                      {order.restaurantName}
                    </p>
                    <div className="mb-2 space-y-1 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold">Date:</span> {formatDate(order.createdAt)}
                      </p>
                      <p>
                        <span className="font-semibold">Type:</span> {order.deliveryMethod}
                      </p>
                      {order.tableNumber && (
                        <p>
                          <span className="font-semibold">Table:</span> {order.tableNumber}
                        </p>
                      )}
                      {order.numberOfPassengers && (
                        <p>
                          <span className="font-semibold">Guests:</span> {order.numberOfPassengers}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Payment:</span> {order.paymentMethod}
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="text-lg font-bold text-slate-900">
                        Total: LKR {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedOrder(selectedOrder?.id === order.id ? null : order)
                    }
                    className="ml-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {selectedOrder?.id === order.id ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <h4 className="mb-3 font-semibold text-slate-900">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{item.itemName}</p>
                            {item.priceOptionName && (
                              <p className="text-xs text-slate-500">{item.priceOptionName}</p>
                            )}
                            {item.specialInstructions && (
                              <p className="mt-1 text-xs text-slate-600">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-semibold text-slate-900">
                              LKR {item.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-sm text-slate-600">Subtotal:</span>
                      <span className="font-semibold text-slate-900">
                        LKR {order.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {order.tipAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Tip:</span>
                        <span className="font-semibold text-slate-900">
                          LKR {order.tipAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                      <span className="font-semibold text-slate-900">Total:</span>
                      <span className="text-lg font-bold text-slate-900">
                        LKR {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

