import React, { useState, useEffect } from "react";
import { RxRocket, RxClipboard, RxHome, RxChevronDown } from "react-icons/rx";
import { HiEye, HiCurrencyDollar, HiArrowUp } from "react-icons/hi2";
import { FaTruck, FaQrcode, FaPrint } from "react-icons/fa";
import { orderAPI, authAPI } from "../../services/api";

const MENU_PREVIEW_URL = "/menu-preview";

export function OrdersPage() {
  const [invoiceId, setInvoiceId] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user to get restaurantId
        const user = await authAPI.getCurrentUser();
        if (user.restaurantId) {
          setRestaurantId(user.restaurantId);
          // Fetch orders for this restaurant
          const ordersData = await orderAPI.getRestaurantOrders(user.restaurantId);
          setOrders(ordersData || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for new orders every 5 seconds
    const interval = setInterval(() => {
      if (restaurantId) {
        orderAPI
          .getRestaurantOrders(restaurantId)
          .then((data) => setOrders(data || []))
          .catch((error) => console.error("Failed to refresh orders:", error));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [restaurantId]);

  const handleResetFilter = () => {
    setInvoiceId("");
    setStoreFilter("all");
    setPaymentFilter("all");
    setDeliveryFilter("all");
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      // Refresh orders
      if (restaurantId) {
        const ordersData = await orderAPI.getRestaurantOrders(restaurantId);
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (invoiceId && !order.orderId.toLowerCase().includes(invoiceId.toLowerCase())) return false;
    if (paymentFilter !== "all" && order.paymentMethod !== paymentFilter) return false;
    if (deliveryFilter !== "all" && order.deliveryMethod !== deliveryFilter) return false;
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const hasOrders = filteredOrders.length > 0;

  const handleOpenApp = () => {
    window.open(MENU_PREVIEW_URL, "_blank", "noopener,noreferrer");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title, subtitle, and action buttons */}
      <header className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-slate-900">Food orders</h2>
              <RxRocket className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm text-slate-500">Order Monitoring and History</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              title="QR Code"
            >
              <FaQrcode className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-500"
              title="Print"
            >
              <FaPrint className="size-5" />
            </button>
            <button
              type="button"
              onClick={handleOpenApp}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <HiEye className="size-5" />
              OPEN APP
            </button>
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Invoice ID Input */}
          <div className="relative flex-1 min-w-[200px]">
            <RxClipboard className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Invoice ID"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <HiCurrencyDollar className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[150px]"
            >
              <option value="all">All</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="pending">Pending</option>
            </select>
            <RxChevronDown className="absolute right-3 top-1/2 size-5 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {/* Delivery Method Filter */}
          <div className="relative">
            <FaTruck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-sm font-semibold text-slate-600 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 min-w-[150px]"
            >
              <option value="all">All</option>
              <option value="takeaway">Takeaway</option>
              <option value="dine-in">Dine-in</option>
            </select>
            <RxChevronDown className="absolute right-3 top-1/2 size-5 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={handleResetFilter}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-500 hover:bg-emerald-50 whitespace-nowrap"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </section>

      {/* Orders Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <div className="flex items-center gap-1.5">
                    Payment method
                    <HiArrowUp className="size-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Delivery method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Order status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {hasOrders ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {order.paymentMethod === "pending" ? "Pending" : order.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatTime(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {order.deliveryMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {order.customerName || order.guestName || "Guest"}
                        {order.tableNumber && (
                          <span className="ml-2 text-xs text-slate-500">
                            (Table: {order.tableNumber})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        LKR {order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.status === "pending" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                              className="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-600"
                              title="Confirm order"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                              className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600"
                              title="Cancel order"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                            className="rounded bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-600"
                            title="Mark as completed"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setSelectedOrder(selectedOrder?.id === order.id ? null : order)
                          }
                          className="ml-2 rounded bg-slate-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-600"
                          title="View details"
                        >
                          {selectedOrder?.id === order.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>
                    {selectedOrder?.id === order.id && (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 bg-slate-50">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900">Order Details:</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-slate-700">Customer:</span>{" "}
                                {order.customerName || order.guestName || "Guest"}
                              </div>
                              {order.guestEmail && (
                                <div>
                                  <span className="font-semibold text-slate-700">Email:</span>{" "}
                                  {order.guestEmail}
                                </div>
                              )}
                              {order.tableNumber && (
                                <div>
                                  <span className="font-semibold text-slate-700">Table:</span>{" "}
                                  {order.tableNumber}
                                </div>
                              )}
                              {order.numberOfPassengers && (
                                <div>
                                  <span className="font-semibold text-slate-700">Guests:</span>{" "}
                                  {order.numberOfPassengers}
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="mb-2 font-semibold text-slate-900">Items:</h5>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between rounded-lg bg-white p-3"
                                  >
                                    <div>
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
                                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                                      <p className="font-semibold text-slate-900">
                                        LKR {item.totalPrice.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                              <span className="font-semibold text-slate-900">Total:</span>
                              <span className="text-lg font-bold text-slate-900">
                                LKR {order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-0">
                    <div className="flex flex-col items-center justify-center px-6 py-20">
                      <div className="relative mb-6 flex size-32 items-center justify-center">
                        <svg
                          className="size-24 text-slate-300"
                          viewBox="0 0 120 120"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <ellipse cx="60" cy="100" rx="40" ry="10" fill="currentColor" opacity="0.25" />
                          <path
                            d="M 25 60 Q 60 15, 95 60 L 95 90 Q 60 105, 25 90 Z"
                            fill="currentColor"
                            opacity="0.15"
                          />
                          <path
                            d="M 25 60 Q 60 15, 95 60"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            opacity="0.4"
                          />
                          <line
                            x1="25"
                            y1="60"
                            x2="25"
                            y2="90"
                            stroke="currentColor"
                            strokeWidth="2"
                            opacity="0.3"
                          />
                          <line
                            x1="95"
                            y1="60"
                            x2="95"
                            y2="90"
                            stroke="currentColor"
                            strokeWidth="2"
                            opacity="0.3"
                          />
                          <circle cx="60" cy="50" r="18" fill="currentColor" opacity="0.1" />
                          <text
                            x="60"
                            y="58"
                            fontSize="28"
                            fill="currentColor"
                            opacity="0.6"
                            textAnchor="middle"
                            fontWeight="bold"
                            fontFamily="Arial, sans-serif"
                          >
                            ?
                          </text>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No records available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
