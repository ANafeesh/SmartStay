import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
  MapPin,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  Check,
} from "lucide-react";
import { readFoodOrders, saveFoodOrders } from "../../data/foodOrders";

function createOrderId() {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

const vendorsList = [
  {
    id: "VND-01",
    name: "Campus Diner & Cafe",
    rating: 4.8,
    deliveryTime: "20-25 mins",
    tags: ["Sri Lankan", "Rice & Kottu", "Halal"],
    hygieneGrade: "A+",
    accentColor: "from-blue-600 to-indigo-600",
  },
  {
    id: "VND-02",
    name: "The Snack Shack",
    rating: 4.6,
    deliveryTime: "15-20 mins",
    tags: ["Burgers", "Snacks", "Quick Bites"],
    hygieneGrade: "A",
    accentColor: "from-amber-600 to-orange-600",
  },
  {
    id: "VND-03",
    name: "Bean & Brew Coffee Co.",
    rating: 4.9,
    deliveryTime: "10-15 mins",
    tags: ["Coffee", "Beverages", "Desserts"],
    hygieneGrade: "A+",
    accentColor: "from-emerald-600 to-teal-600",
  },
];

const initialFoodItems = [
  {
    id: "FD-101",
    name: "Chicken Kottu Roti (Full Portion)",
    vendor: "Campus Diner & Cafe",
    vendorId: "VND-01",
    price: 850,
    category: "Main Dishes",
    image: "/food/kottu.jpg",
    available: true,
    rating: 4.8,
    isHalal: true,
    isSpicy: true,
    isVeg: false,
    prepTime: "15 mins",
    description: "Chopped Godamba flatbread stir-fried with seasoned chicken, scrambled eggs, fresh leeks, carrots, and savory curry gravy.",
  },
  {
    id: "FD-102",
    name: "Crispy Chicken Burger & Fries",
    vendor: "The Snack Shack",
    vendorId: "VND-02",
    price: 950,
    category: "Fast Food",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    available: true,
    rating: 4.6,
    isHalal: true,
    isSpicy: false,
    isVeg: false,
    prepTime: "12 mins",
    description: "Golden fried chicken fillet layered with melted cheddar, crisp iceberg lettuce, house spicy mayo, and salted fries.",
  },
  {
    id: "FD-103",
    name: "Special Egg Fried Rice & Chili Paste",
    vendor: "Campus Diner & Cafe",
    vendorId: "VND-01",
    price: 650,
    category: "Main Dishes",
    image: "/food/fried_rice.jpg",
    available: true,
    rating: 4.5,
    isHalal: true,
    isSpicy: true,
    isVeg: false,
    prepTime: "10 mins",
    description: "Fragrant basmati rice wok-tossed with farm eggs, scallions, sweet soy, and authentic homemade chili paste.",
  },
  {
    id: "FD-104",
    name: "Chicken Biriyani Special Pot",
    vendor: "Campus Diner & Cafe",
    vendorId: "VND-01",
    price: 920,
    category: "Main Dishes",
    image: "/food/biriyani.jpg",
    available: true,
    rating: 4.9,
    isHalal: true,
    isSpicy: true,
    isVeg: false,
    prepTime: "15 mins",
    description: "Fragrant spiced basmati rice slow-cooked with tender chicken, boiled egg, mint sambol, and spicy gravy.",
  },
  {
    id: "FD-105",
    name: "Sri Lankan Rice & Curry Plate",
    vendor: "Campus Diner & Cafe",
    vendorId: "VND-01",
    price: 550,
    category: "Main Dishes",
    image: "/food/rice_and_curry.jpg",
    available: true,
    rating: 4.7,
    isHalal: true,
    isSpicy: true,
    isVeg: false,
    prepTime: "10 mins",
    description: "Steamed village rice served with authentic dhal, tempered beans, fried papadam, and chicken or fish curry.",
  },
  {
    id: "FD-106",
    name: "Wok-Tossed Chicken Noodles",
    vendor: "Campus Diner & Cafe",
    vendorId: "VND-01",
    price: 780,
    category: "Main Dishes",
    image: "/food/noodles.jpg",
    available: true,
    rating: 4.7,
    isHalal: true,
    isSpicy: true,
    isVeg: false,
    prepTime: "12 mins",
    description: "Stir-fried egg noodles with shredded chicken, crunchy carrots, cabbage, scallions, and chili garlic sauce.",
  },
  {
    id: "FD-107",
    name: "Traditional Parotta & Creamy Dhal",
    vendor: "The Snack Shack",
    vendorId: "VND-02",
    price: 360,
    category: "Snacks",
    image: "/food/parotta.jpg",
    available: true,
    rating: 4.6,
    isHalal: true,
    isSpicy: true,
    isVeg: true,
    prepTime: "8 mins",
    description: "Two flaky layered golden parottas served with rich tempered coconut milk dhal and spicy lunu miris.",
  },
  {
    id: "FD-108",
    name: "Crispy Masala Thosai & Sambar",
    vendor: "The Snack Shack",
    vendorId: "VND-02",
    price: 380,
    category: "Snacks",
    image: "/food/masal_thosse.jpg",
    available: true,
    rating: 4.8,
    isHalal: true,
    isSpicy: true,
    isVeg: true,
    prepTime: "10 mins",
    description: "Crisp golden crepe stuffed with spiced potato masala, served with warm vegetable sambar and coconut chutney.",
  },
  {
    id: "FD-109",
    name: "Steamed Idli Sambar Platter (3 Pcs)",
    vendor: "The Snack Shack",
    vendorId: "VND-02",
    price: 300,
    category: "Snacks",
    image: "/food/itli.jpg",
    available: true,
    rating: 4.5,
    isHalal: true,
    isSpicy: false,
    isVeg: true,
    prepTime: "8 mins",
    description: "Steamed fluffy rice and lentil cakes served with aromatic vegetable sambar and fresh tomato chutney.",
  },
  {
    id: "FD-110",
    name: "String Hoppers & Kiri Hodi (10 Pcs)",
    vendor: "The Snack Shack",
    vendorId: "VND-02",
    price: 350,
    category: "Snacks",
    image: "/food/string_hoppers.jpg",
    available: true,
    rating: 4.8,
    isHalal: true,
    isSpicy: true,
    isVeg: true,
    prepTime: "10 mins",
    description: "Freshly steamed rice vermicelli nests served with thick coconut milk kiri hodi and spicy pol sambol.",
  },
  {
    id: "FD-111",
    name: "Iced Caramel Macchiato (500ml)",
    vendor: "Bean & Brew Coffee Co.",
    vendorId: "VND-03",
    price: 450,
    category: "Beverages",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600",
    available: true,
    rating: 4.9,
    isHalal: true,
    isSpicy: false,
    isVeg: true,
    prepTime: "5 mins",
    description: "Double shot espresso poured over chilled creamy milk, vanilla infusion, and topped with rich salted caramel drizzle.",
  },
];

const categories = ["All", "Main Dishes", "Fast Food", "Snacks", "Beverages"];

const timeSlots = [
  "12:30 PM - 01:00 PM (Lunch Slot 1)",
  "01:00 PM - 01:30 PM (Lunch Slot 2)",
  "06:30 PM - 07:00 PM (Dinner Slot 1)",
  "07:30 PM - 08:00 PM (Dinner Slot 2)",
  "09:30 PM - 10:00 PM (Late Night)",
];

const dropLocations = [
  "Hostel Block B - Room 204 (Doorstep)",
  "Hostel Block B - Ground Floor Foyer",
  "Hostel Block A - Main Entrance",
  "Campus Main Gate Security Booth",
];

export default function Marketplace() {
  const { user } = useAuth();
  const studentRegId = user?.studentId || "STD-2026-090";
  const studentDisplayName = user?.name || "Student";
  const [items] = useState(initialFoodItems);
  const [myOrders, setMyOrders] = useState(() =>
    readFoodOrders().filter((order) => order.studentId === studentRegId),
  );
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);
  const [selectedDropLocation, setSelectedDropLocation] = useState(dropLocations[0]);
  const [paymentOption, setPaymentOption] = useState("room_bill");
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartConflictModal, setCartConflictModal] = useState(null);
  const [activeView, setActiveView] = useState("menu");

  useEffect(() => {
    const refreshOrders = () => {
      setMyOrders(
        readFoodOrders().filter((order) => order.studentId === studentRegId),
      );
    };
    window.addEventListener("storage", refreshOrders);
    return () => window.removeEventListener("storage", refreshOrders);
  }, []);

  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].vendorId !== item.vendorId) {
      setCartConflictModal({
        existingVendor: cart[0].vendor,
        newVendor: item.vendor,
        incomingItem: item,
      });
      return;
    }

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
  };

  const handleResolveConflict = (action) => {
    if (action === "replace" && cartConflictModal?.incomingItem) {
      setCart([{ ...cartConflictModal.incomingItem, quantity: 1 }]);
    }
    setCartConflictModal(null);
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 1500 ? 0 : 80;
  const hostelConvenience = 20;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee + hostelConvenience : 0;
  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = (e) => {
    e?.preventDefault?.();
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    const orderNo = createOrderId();
    const newOrder = {
      id: orderNo,
      studentId: studentRegId,
      studentName: studentDisplayName,
      regNo: studentRegId,
      vendorId: cart[0]?.vendorId || "VND-01",
      vendor: cart[0]?.vendor || "Campus Vendor",
      timeSlot: selectedSlot,
      deliveryLocation: selectedDropLocation,
      paymentMethod:
        paymentOption === "room_bill"
          ? "Charged to Room Bill"
          : paymentOption === "cash"
            ? "Cash at Delivery Gate"
            : "Campus Digital Wallet",
      subtotal,
      deliveryFee,
      totalAmount: grandTotal,
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

    setTimeout(() => {
      const updatedOrders = [newOrder, ...readFoodOrders()];
      setMyOrders(
        updatedOrders.filter(
          (order) =>
            !order.studentId ||
            order.studentId === studentRegId ||
            order.regNo === studentRegId ||
            order.studentName === studentDisplayName,
        ),
      );
      try {
        saveFoodOrders(updatedOrders);
      } catch (err) {
        console.error("Unable to save order.", err);
      }

      setOrderConfirmed(newOrder);
      setShowSuccessModal(true);
      setCart([]);
      setIsCartOpen(false);
      setIsSubmitting(false);
    }, 350);
  };

  const simulateStatusStep = (orderId) => {
    const steps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];
    const all = readFoodOrders();
    const updated = all.map((o) => {
      if (o.id === orderId) {
        const idx = steps.indexOf(o.status);
        const next = steps[Math.min(idx + 1, steps.length - 1)];
        return { ...o, status: next };
      }
      return o;
    });
    saveFoodOrders(updated);
    setMyOrders(updated.filter((o) => o.studentId === studentRegId));
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesVendor =
      selectedVendor === "All" || item.vendor === selectedVendor;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiet =
      dietaryFilter === "All"
        ? true
        : dietaryFilter === "Veg"
          ? item.isVeg
          : dietaryFilter === "Halal"
            ? item.isHalal
            : dietaryFilter === "Spicy"
              ? item.isSpicy
              : true;

    return matchesCategory && matchesVendor && matchesSearch && matchesDiet;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-24">
      {/* Top Interactive Banner & Action Toolbar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Lunch Delivery Slots Open Now
            </span>
            
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Campus Dining & Gate Delivery
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Student: <strong>{studentDisplayName}</strong> (ID:{" "}
            <span className="font-mono text-blue-600 font-semibold">{studentRegId}</span>) · Drop-off at Hostel Block B
          </p>
        </div>

        {/* Primary View Action Switches */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setActiveView(activeView === "orders" ? "menu" : "orders")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
              activeView === "orders"
                ? "bg-blue-600 text-white shadow-blue-500/20"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <ClipboardList size={16} />
            <span>My Orders</span>
            {myOrders.length > 0 && (
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  activeView === "orders" ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                }`}
              >
                {myOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition cursor-pointer"
          >
            <ShoppingCart size={16} />
            <span>Basket</span>
            {totalCartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Order Confirmed Alert */}
      {orderConfirmed && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/95 p-5 shadow-sm transition-all animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Food Order Confirmed! Order #{orderConfirmed.id}
                </h3>
                <p className="mt-1 text-xs text-emerald-900 leading-relaxed">
                  Your order from <strong>{orderConfirmed.vendor}</strong> has been transmitted to kitchen dispatch.
                  Collect during <strong>{orderConfirmed.timeSlot}</strong> at <strong>{orderConfirmed.deliveryLocation}</strong>.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-950">
                  <span>Total: LKR {orderConfirmed.totalAmount.toLocaleString()}</span>
                  <span>•</span>
                  <span>Payment: {orderConfirmed.paymentMethod}</span>
                  <span>•</span>
                  <span>Student: {studentDisplayName} ({studentRegId})</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOrderConfirmed(null)}
              className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* VIEW: MY ORDERS & TRACKING */}
      {activeView === "orders" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Active Food Orders & Delivery Tracking
              </h3>
              <p className="text-xs text-slate-500">
                Track live preparation, delivery slot arrivals, and gate authorization status.
              </p>
            </div>
            <button
              onClick={() =>
                setMyOrders(
                  readFoodOrders().filter(
                    (order) => order.studentId === studentRegId,
                  ),
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Refresh Status</span>
            </button>
          </div>

          {myOrders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                <ClipboardList size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Orders in Queue</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Browse our approved campus vendors and reserve your lunch or dinner delivery slot.
              </p>
              <button
                onClick={() => setActiveView("menu")}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow-xs cursor-pointer"
              >
                <span>Browse Menu</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const steps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];
                const currentStep = steps.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600">
                            {order.id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <h3 className="text-sm font-bold text-slate-900">
                            {order.vendor || "Campus Vendor"}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Placed: {order.createdAt} · Delivery Slot: <strong>{order.timeSlot}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={12} className="text-rose-500" />
                          <span>Drop-off: <strong>{order.deliveryLocation || "Hostel Block B"}</strong></span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-start">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold border ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : order.status === "Out for Delivery"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : order.status === "Preparing"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {order.status}
                        </span>

                        
                      </div>
                    </div>

                    {/* Progress Bar Stepper */}
                    <div className="pt-2">
                      <div className="grid grid-cols-4 gap-2">
                        {steps.map((step, idx) => {
                          const isDone = currentStep >= idx;
                          return (
                            <div key={step} className="space-y-1.5">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isDone ? "bg-blue-600 shadow-2xs" : "bg-slate-100"
                                }`}
                              />
                              <span
                                className={`block text-[11px] font-semibold ${
                                  isDone ? "text-slate-900" : "text-slate-400"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items & Amount */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-slate-600">
                        {order.items?.map((i) => `${i.qty}x ${i.name}`).join(", ") || "Meals bundle"}
                      </div>
                      <div className="font-bold text-slate-900 text-sm">
                        Total: LKR {(order.totalAmount || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW: MENU CATALOG */
        <div className="space-y-6">
          {/* Approved Campus Outlets Showcase */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Approved Campus Food Outlets
              </h3>
              <span className="text-xs text-slate-400">Security Gate Authorized</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {vendorsList.map((v) => {
                const isSelected = selectedVendor === v.name;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVendor(isSelected ? "All" : v.name)}
                    className={`rounded-3xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10"
                        : "border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Store size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{v.name}</h4>
                            <p className="text-[11px] text-slate-500">
                              â± {v.deliveryTime} · Grade {v.hygieneGrade}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          ★ {v.rating}
                        </span>
                      </div>

                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {v.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        {isSelected ? "Filtering menu" : "Click to view outlet menu"}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 font-bold text-blue-600">
                          <Check size={14} /> Active Filter
                        </span>
                      ) : (
                        <span className="text-slate-400 group-hover:text-slate-700">
                          <ChevronRight size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean, Non-Cramped Search & Filter Toolbar */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
            {/* Row 1: Search Bar + Dietary Preferences */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search meals, kottu, burger, drinks, or ingredients..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Dietary Tags (Clean pill design with no scrollbar) */}
              <div className="flex items-center gap-1.5 self-start sm:self-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Diet:
                </span>
                {["All", "Halal", "Veg", "Spicy"].map((diet) => (
                  <button
                    key={diet}
                    onClick={() => setDietaryFilter(diet)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                      dietaryFilter === diet
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {diet === "Veg" && "🌱 "}
                    {diet === "Spicy" && "🌶️  "}
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Categories (Segmented Pills without scrollbar clutter) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 font-medium self-end sm:self-center">
                Showing <strong className="text-slate-800">{filteredItems.length}</strong> offerings
                {selectedVendor !== "All" && ` from ${selectedVendor}`}
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const inCartItem = cart.find((c) => c.id === item.id);
              const qty = inCartItem?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-all duration-200 hover:border-slate-300"
                >
                  {/* Image & Frosted Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="rounded-lg bg-slate-900/85 backdrop-blur-md px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                        ★ {item.rating}
                      </span>
                      {item.isHalal && (
                        <span className="rounded-lg bg-emerald-900/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-emerald-200 shadow-xs">
                          Halal
                        </span>
                      )}
                      {item.isVeg && (
                        <span className="rounded-lg bg-green-900/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-green-200 shadow-xs">
                          Veg
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="rounded-lg bg-rose-900/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-rose-200 shadow-xs">
                          🌶️  Spicy
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs">
                      â± {item.prepTime}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Store size={13} className="text-blue-600" />
                        <span>{item.vendor}</span>
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                        <span className="text-base font-black text-slate-900">
                          LKR {item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Interactive Add or Qty Stepper */}
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                        >
                          <Plus size={15} />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/70 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-bold text-blue-900 px-1">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs hover:bg-blue-500 transition cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Cart Review Bar */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 inset-x-4 max-w-xl mx-auto z-40 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between rounded-3xl bg-slate-900 text-white p-3.5 px-5 shadow-2xl border border-slate-800 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white">
                  {totalCartCount} {totalCartCount === 1 ? "item" : "items"} · {cart[0]?.vendor}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Total: <strong className="text-white text-xs">LKR {grandTotal.toLocaleString()}</strong>
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              <span>Review Order</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Cart Conflict Warning Modal */}
      {cartConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Single Vendor Order Rule
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Your basket currently contains meals from <strong>{cartConflictModal.existingVendor}</strong>.
                Each delivery slot is verified through a dedicated vendor QR pass.
              </p>
              <p className="text-xs text-slate-700 font-semibold mt-2">
                Would you like to clear existing items and order from <strong>{cartConflictModal.newVendor}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleResolveConflict("keep")}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Keep Existing Cart
              </button>
              <button
                onClick={() => handleResolveConflict("replace")}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-xs cursor-pointer"
              >
                Replace & Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* ORDER PLACED SUCCESSFULLY MODAL */}
      {showSuccessModal && orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 text-left animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close X */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Success Icon & Header */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 mb-3.5 animate-in zoom-in-75 duration-300">
                <CheckCircle2 size={36} className="text-emerald-600 stroke-[2.2]" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                Order Confirmed
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your order has been sent to <strong>{orderConfirmed.vendor}</strong> and is being prepared for kitchen dispatch.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 text-sm">
                    {orderConfirmed.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-700 font-semibold truncate max-w-[180px]">
                    {orderConfirmed.vendor}
                  </span>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                  {orderConfirmed.status}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 py-1">
                {orderConfirmed.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span className="truncate pr-2">
                      <strong className="text-slate-900">{item.qty}×</strong> {item.name}
                    </span>
                    <span className="font-mono font-semibold shrink-0">
                      LKR {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-blue-600 shrink-0" />
                  <span>Slot: <strong className="text-slate-800">{orderConfirmed.timeSlot?.split(" ")[0]} {orderConfirmed.timeSlot?.split(" ")[1]}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-rose-600 shrink-0" />
                  <span className="truncate">Drop: <strong className="text-slate-800">{orderConfirmed.deliveryLocation}</strong></span>
                </div>
              </div>

              {/* Payment & Total */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 font-semibold text-slate-700">
                <span>Payment: <span className="font-normal">{orderConfirmed.paymentMethod}</span></span>
                <span className="text-sm font-extrabold text-blue-600">
                  Total: LKR {orderConfirmed.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveView("orders");
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500 transition cursor-pointer"
              >
                <ClipboardList size={15} />
                <span>Track Order</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Food Order Basket ({totalCartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <ShoppingCart size={32} className="mx-auto text-slate-300 mb-2" />
                  Your food cart is currently empty.
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-3.5 flex items-center justify-between text-xs">
                    <span className="text-blue-900 font-semibold flex items-center gap-1.5">
                      <Store size={14} className="text-blue-600" />
                      Vendor: <strong>{cart[0]?.vendor}</strong>
                    </span>
                    <button
                      onClick={() => setCart([])}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"
                      >
                        <div className="flex-1 pr-3">
                          <h4 className="text-xs font-bold text-slate-900">
                            {item.name}
                          </h4>
                          <span className="text-xs font-bold text-blue-600">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-bold text-slate-900 px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Slot Selector */}
                  <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <Clock size={14} className="text-blue-600" />
                        <span>Select Delivery Time Slot</span>
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-none"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <MapPin size={14} className="text-rose-600" />
                        <span>Hostel Drop-off Point</span>
                      </label>
                      <select
                        value={selectedDropLocation}
                        onChange={(e) => setSelectedDropLocation(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-none"
                      >
                        {dropLocations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                        Settlement Method
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setPaymentOption("room_bill")}
                          className={`rounded-xl border p-2 text-left transition cursor-pointer ${
                            paymentOption === "room_bill"
                              ? "border-blue-600 bg-blue-50 font-bold text-blue-700"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          Hostel Bill
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentOption("cash")}
                          className={`rounded-xl border p-2 text-left transition cursor-pointer ${
                            paymentOption === "cash"
                              ? "border-blue-600 bg-blue-50 font-bold text-blue-700"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          Cash at Gate
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Checkout Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 p-6 space-y-3 bg-slate-50/80">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Food Subtotal</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Campus Gate Delivery</span>
                    <span>{deliveryFee === 0 ? "FREE" : `LKR ${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hostel Packaging Fee</span>
                    <span>LKR {hostelConvenience}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                    <span>Total Due</span>
                    <span className="text-blue-600">
                      LKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500 transition cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Placing Your Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Reserve Delivery Slot</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
