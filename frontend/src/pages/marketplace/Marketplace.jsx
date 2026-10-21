import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Clock,
  Store,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  Truck,
} from "lucide-react";
import { readFoodOrders, saveFoodOrders } from "../../data/foodOrders";

const initialFoodItems = [
  {
    id: "FD-101",
    name: "Chicken Kottu Roti (Full)",
    vendor: "Campus Diner & Cafe",
    vendorId: "VND-01",
    price: 850,
    category: "Main Dishes",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400",
    available: true,
    rating: 4.8,
  },
  {
    id: "FD-102",
    name: "Crispy Chicken Burger & Fries",
    vendor: "The Snack Shack",
    vendorId: "VND-02",
    price: 950,
    category: "Fast Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    available: true,
    rating: 4.6,
  },
  {
    id: "FD-103",
    name: "Egg Fried Rice with Chili Paste",
    vendor: "Campus Diner & Cafe",
    vendorId: "VND-01",
    price: 650,
    category: "Main Dishes",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400",
    available: true,
    rating: 4.5,
  },
  {
    id: "FD-104",
    name: "Iced Milk Coffee (500ml)",
    vendor: "Bean & Brew Coffee Co.",
    vendorId: "VND-03",
    price: 350,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
    available: true,
    rating: 4.9,
  },
  {
    id: "FD-105",
    name: "Vegetable Roti & Dhal Curry",
    vendor: "The Snack Shack",
    vendorId: "VND-02",
    price: 300,
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400",
    available: false,
    rating: 4.2,
  },
];

const categories = ["All", "Main Dishes", "Fast Food", "Snacks", "Beverages"];

const timeSlots = [
  "12:30 PM - 01:00 PM (Lunch)",
  "01:00 PM - 01:30 PM (Lunch)",
  "06:30 PM - 07:00 PM (Dinner)",
  "07:30 PM - 08:00 PM (Dinner)",
];

function Marketplace() {
  const [items] = useState(initialFoodItems);
  const [myOrders, setMyOrders] = useState(() =>
    readFoodOrders().filter(
      (order) => order.studentId === "SEU/IS/22/ICT/090",
    ),
  );
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [storageMessage, setStorageMessage] = useState("");
  const [activeView, setActiveView] = useState("menu");

  useEffect(() => {
    const refreshOrders = () => {
      setMyOrders(
        readFoodOrders().filter(
          (order) => order.studentId === "SEU/IS/22/ICT/090",
        ),
      );
    };
    window.addEventListener("storage", refreshOrders);
    return () => window.removeEventListener("storage", refreshOrders);
  }, []);

  // Cart Handlers
  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].vendorId !== item.vendorId) {
      setCartMessage(
        `Your cart contains food from ${cart[0].vendor}. Place that order or clear your cart before choosing another vendor.`,
      );
      setIsCartOpen(true);
      return;
    }
    setCartMessage("");
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean),
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderNo = `ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const newOrder = {
      id: orderNo,
      studentId: "SEU/IS/22/ICT/090",
      studentName: "Ahamed Nafeesh",
      regNo: "SEU/IS/22/ICT/090",
      vendorId: cart[0].vendorId,
      vendor: cart[0].vendor,
      timeSlot: selectedSlot,
      totalAmount: cartTotal,
      status: "Placed",
      createdAt: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: cart.map((item) => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
      })),
    };
    const updatedOrders = [newOrder, ...readFoodOrders()];
    setMyOrders(
      updatedOrders.filter(
        (order) => order.studentId === "SEU/IS/22/ICT/090",
      ),
    );
    try {
      saveFoodOrders(updatedOrders);
      setStorageMessage("");
    } catch (error) {
      console.error("Unable to save the food order.", error);
      setStorageMessage(
        "The order is visible for this session but could not be saved for vendor tracking in this browser.",
      );
    }

    setOrderConfirmed({
      orderNo,
      items: cart,
      total: cartTotal,
      slot: selectedSlot,
      vendor: cart[0].vendor,
    });

    setCart([]);
    setIsCartOpen(false);
    setCartMessage("");
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Food Marketplace
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Order meals from approved local vendors for scheduled campus gate
            delivery.
          </p>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setActiveView("orders")}
          className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeView === "orders"
              ? "bg-blue-600 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ClipboardList size={18} />
          <span>My Orders</span>
          {myOrders.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
              {myOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveView("menu");
            setIsCartOpen(true);
          }}
          className="relative flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
        >
          <ShoppingCart size={18} />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Order Confirmation Banner */}
      {orderConfirmed && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-xs transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Order Placed Successfully! #{orderConfirmed.orderNo}
                </h3>
                <p className="mt-0.5 text-xs text-emerald-800">
                  Your order from <strong>{orderConfirmed.vendor}</strong> has
                  been sent. Collect at gate during slot:{" "}
                  <strong>{orderConfirmed.slot}</strong>.
                </p>
                <div className="mt-2 text-xs font-bold text-emerald-900">
                  Order total: LKR {orderConfirmed.total.toLocaleString()}. Payment is collected at delivery.
                </div>
              </div>
            </div>
            <button
              onClick={() => setOrderConfirmed(null)}
              className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {storageMessage && (
        <p
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
        >
          {storageMessage}
        </p>
      )}

      {activeView === "orders" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your food orders
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Follow each order as the vendor prepares and delivers it.
              </p>
            </div>
            <button
              onClick={() =>
                setMyOrders(
                  readFoodOrders().filter(
                    (order) => order.studentId === "SEU/IS/22/ICT/090",
                  ),
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh tracking
            </button>
          </div>

          {myOrders.length ? (
            myOrders.map((order) => (
              <OrderTrackingCard key={order.id} order={order} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <ClipboardList className="mx-auto text-slate-300" size={32} />
              <p className="mt-3 font-semibold text-slate-700">
                No food orders yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Place an order from the marketplace to follow its progress here.
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
      {/* Search & Categories Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food items or vendor name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Catalog Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-lg bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white">
                ★ {item.rating}
              </span>
              {!item.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs text-xs font-bold text-white">
                  Sold Out
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Store size={14} className="text-blue-600" />
                  <span>{item.vendor}</span>
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-900">
                  {item.name}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400">Price</span>
                  <p className="text-base font-bold text-slate-900">
                    LKR {item.price}
                  </p>
                </div>

                <button
                  disabled={!item.available}
                  onClick={() => addToCart(item)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    item.available
                      ? "bg-blue-600 text-white shadow-xs hover:bg-blue-500"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Plus size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Your Cart
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartMessage && (
                <p
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800"
                >
                  {cartMessage}
                </p>
              )}
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3 bg-slate-50/50"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {item.vendor}
                      </p>
                      <p className="mt-1 text-xs font-bold text-blue-600">
                        LKR {item.price * item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Your food cart is currently empty.
                </div>
              )}

              {/* Delivery Slot Selection */}
              {cart.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    <span>Select Campus Delivery Time Slot</span>
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Drawer Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 p-6 space-y-3 bg-slate-50/50">
                <div className="flex justify-between text-xs font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span>LKR {cartTotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OrderTrackingCard({ order }) {
  const steps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];
  const currentStep = steps.indexOf(order.status);
  const statusIcon =
    order.status === "Delivered"
      ? PackageCheck
      : order.status === "Out for Delivery"
        ? Truck
        : Clock;
  const StatusIcon = statusIcon;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{order.id}</p>
          <h3 className="mt-1 font-bold text-slate-900">
            {order.vendor || "Campus food order"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {order.createdAt} · Delivery slot: {order.timeSlot}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
          <StatusIcon size={17} />
          {order.status}
        </div>
      </div>

      <ol
        aria-label={`Order progress: ${order.status}`}
        className="mt-5 grid grid-cols-4 gap-2"
      >
        {steps.map((step, index) => {
          const isComplete = currentStep >= index;
          return (
            <li key={step} className="min-w-0">
              <div
                className={`h-1.5 rounded-full ${
                  isComplete ? "bg-blue-600" : "bg-slate-100"
                }`}
              />
              <span
                className={`mt-2 block text-[10px] font-semibold sm:text-xs ${
                  isComplete ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs">
        <p className="text-slate-600">
          {order.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}
        </p>
        <p className="font-bold text-slate-900">
          LKR {order.totalAmount.toLocaleString()}
        </p>
      </div>
    </article>
  );
}

export default Marketplace;
