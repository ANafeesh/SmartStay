import { useEffect, useState } from "react";
import { useAuth, isDemoUser } from "../../context/AuthContext";
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
  Star,
} from "lucide-react";
import { readFoodOrders, saveFoodOrders } from "../../data/foodOrders";
import { addRealNotification } from "../../services/notificationService";
import { fetchMenuItems } from "../../services/vendorApi";
import { apiFetch } from "../../services/apiClient";

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
  },
  {
    id: "VND-02",
    name: "The Snack Shack",
    rating: 4.6,
    deliveryTime: "15-20 mins",
    tags: ["Burgers", "Snacks", "Quick Bites"],
    hygieneGrade: "A",
  },
  {
    id: "VND-03",
    name: "Bean & Brew Coffee Co.",
    rating: 4.9,
    deliveryTime: "10-15 mins",
    tags: ["Coffee", "Beverages", "Desserts"],
    hygieneGrade: "A+",
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

export function getAvailableDeliverySlots(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const baseSlots = [
    {
      slot: "08:00 AM - 08:45 AM (Breakfast Slot)",
      cutoff: 10 * 60,
    },
    {
      slot: "12:30 PM - 01:00 PM (Lunch Slot 1)",
      cutoff: 14 * 60,
    },
    {
      slot: "01:00 PM - 01:30 PM (Lunch Slot 2)",
      cutoff: 14 * 60,
    },
    {
      slot: "06:30 PM - 07:00 PM (Dinner Slot 1)",
      cutoff: 20 * 60,
    },
    {
      slot: "07:30 PM - 08:00 PM (Dinner Slot 2)",
      cutoff: 20 * 60 + 30,
    },
    {
      slot: "09:30 PM - 10:00 PM (Late Night)",
      cutoff: 23 * 60,
    },
  ];

  const available = baseSlots
    .filter((s) => currentMinutes < s.cutoff)
    .map((s) => s.slot);

  if (available.length > 0) {
    return available;
  }

  return [
    "Tomorrow: 08:00 AM - 08:45 AM (Breakfast)",
    "Tomorrow: 12:30 PM - 01:00 PM (Lunch Slot 1)",
    "Tomorrow: 01:00 PM - 01:30 PM (Lunch Slot 2)",
    "Tomorrow: 06:30 PM - 07:00 PM (Dinner Slot 1)",
    "Tomorrow: 09:30 PM - 10:00 PM (Late Night)",
  ];
}

export function getActiveServiceBanner(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (currentMinutes < 10 * 60) {
    return {
      title: "Breakfast & Day Delivery Slots Open",
      badgeColor: "bg-emerald-600",
    };
  }
  if (currentMinutes < 14 * 60) {
    return {
      title: "Lunch Delivery Slots Open",
      badgeColor: "bg-emerald-600",
    };
  }
  if (currentMinutes < 20 * 60 + 30) {
    return {
      title: "Dinner Delivery Slots Open",
      badgeColor: "bg-emerald-600",
    };
  }
  if (currentMinutes < 23 * 60) {
    return {
      title: "Late Night Delivery Slots Open",
      badgeColor: "bg-slate-700",
    };
  }
  return {
    title: "Kitchen Closed for Today · Pre-Orders Open for Tomorrow",
    badgeColor: "bg-slate-500",
  };
}

const dropLocations = [
  "Hostel Block B - Room 204 (Doorstep)",
  "Hostel Block B - Ground Floor Foyer",
  "Hostel Block A - Main Entrance",
  "Campus Main Gate Security Booth",
];

export default function Marketplace() {
  const { user } = useAuth();
  const isDemo = isDemoUser(user) || user?.isDemo || user?.email === "nafeesh@campus.edu";
  const studentRegId = user?.studentId || user?.registrationNumber || "";
  const studentDisplayName = user?.name || "Student";
  const [items, setItems] = useState(initialFoodItems);

  const loadMarketplaceItems = async () => {
    try {
      const liveItems = await fetchMenuItems();
      if (Array.isArray(liveItems) && liveItems.length > 0) {
        const normalizedLive = liveItems.map((m) => {
          const isDiner =
            !m.vendorId ||
            m.vendorId === "VND-2026-09" ||
            m.vendorId === "VND-01" ||
            m.vendorId === "VND-2026-01" ||
            /campus diner/i.test(m.vendor || "");

          return {
            id: m.id || m.itemId || m._id,
            itemId: m.itemId || m.id,
            name: m.name,
            vendor: isDiner ? "Campus Diner & Cafe" : (m.vendor || "Campus Diner & Cafe"),
            vendorId: isDiner ? "VND-01" : (m.vendorId || "VND-01"),
            price: Number(m.price) || 0,
            category: m.category || "Main Dishes",
            image: m.image || "/food/rice_and_curry.jpg",
            available: m.available !== false,
            rating: m.rating || 4.8,
            isHalal: m.isHalal !== undefined ? Boolean(m.isHalal) : true,
            isSpicy: m.isSpicy !== undefined ? Boolean(m.isSpicy) : false,
            isVeg: m.isVeg !== undefined ? Boolean(m.isVeg) : false,
            prepTime: m.prepTime || "15 mins",
            calories: m.calories || "",
            description: m.description || "",
          };
        });

        const liveNames = new Set(normalizedLive.map((x) => x.name.trim().toLowerCase()));
        const otherVendors = initialFoodItems.filter(
          (init) => !liveNames.has(init.name.trim().toLowerCase()) && init.vendorId !== "VND-01"
        );

        setItems([...normalizedLive, ...otherVendors]);
      }
    } catch (err) {
      console.warn("Could not load dynamic menu items in marketplace:", err);
    }
  };

  useEffect(() => {
    loadMarketplaceItems();

    const handleMenuSync = () => {
      loadMarketplaceItems();
    };

    window.addEventListener("smartstay-menu-updated", handleMenuSync);
    window.addEventListener("storage", handleMenuSync);
    const syncInterval = setInterval(loadMarketplaceItems, 8000);

    return () => {
      window.removeEventListener("smartstay-menu-updated", handleMenuSync);
      window.removeEventListener("storage", handleMenuSync);
      clearInterval(syncInterval);
    };
  }, []);
  const [myOrders, setMyOrders] = useState(() =>
    studentRegId ? readFoodOrders().filter((order) => order.studentId === studentRegId) : []
  );
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(() => getAvailableDeliverySlots());
  const [selectedSlot, setSelectedSlot] = useState(() => getAvailableDeliverySlots()[0]);
  const [activeBanner, setActiveBanner] = useState(() => getActiveServiceBanner());

  useEffect(() => {
    const updateSlots = () => {
      const slots = getAvailableDeliverySlots();
      setAvailableSlots(slots);
      setSelectedSlot((prev) => (slots.includes(prev) ? prev : slots[0]));
      setActiveBanner(getActiveServiceBanner());
    };

    updateSlots();
    const interval = setInterval(updateSlots, 30000);
    return () => clearInterval(interval);
  }, []);

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
    window.addEventListener("smartstay-food-orders-updated", refreshOrders);
    return () => {
      window.removeEventListener("storage", refreshOrders);
      window.removeEventListener("smartstay-food-orders-updated", refreshOrders);
    };
  }, [studentRegId]);

  const addToCart = (item) => {
    if (item.available === false) return;
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
        apiFetch("/food-orders", {
          method: "POST",
          body: {
            orderNo: newOrder.id,
            studentId: newOrder.studentId || "STD-2026-101",
            studentName: newOrder.studentName,
            regNo: newOrder.regNo,
            vendorId: newOrder.vendorId === "VND-01" ? "VND-2026-09" : newOrder.vendorId,
            vendor: newOrder.vendor,
            deliverySlotId: null,
            timeSlot: newOrder.timeSlot,
            deliveryLocation: newOrder.deliveryLocation,
            paymentMethod: newOrder.paymentMethod,
            subtotal: newOrder.subtotal,
            deliveryFee: newOrder.deliveryFee,
            convenienceFee: hostelConvenience,
            totalAmount: newOrder.totalAmount,
            items: newOrder.items,
          },
        }).catch(() => {});
        addRealNotification({
          id: `order-placed-${newOrder.id}`,
          title: "Food Order Placed",
                    message: `Your food order #${newOrder.id} (${newOrder.vendor}) for LKR ${newOrder.totalAmount.toLocaleString()} has been placed.`,
          type: "food",
        }, user);
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

    try {
      const target = updated.find((o) => o.id === orderId);
      if (target) {
        addRealNotification({
          id: `order-step-${target.id}-${target.status}`,
          title: `Food Order ${target.status}`,
          message: `Your food order #${target.id} (${target.vendor}) is now ${target.status}.`,
          type: "food",
        }, user);
      }
    } catch {}
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
      {/* Top Banner & Context Toolbar */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${activeBanner.badgeColor}`} />
            <span className="text-xs font-medium text-slate-700">
              {activeBanner.title}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mt-1.5">
            Campus Dining & Gate Delivery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Resident: <span className="text-slate-800 font-medium">{studentDisplayName}</span> (ID:{" "}
            <span className="font-mono text-slate-700 font-medium">{studentRegId}</span>) · Drop-off at {user?.building || "Hostel Residence"}
          </p>
        </div>

        {/* Primary View Action Switches */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setActiveView(activeView === "orders" ? "menu" : "orders")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
              activeView === "orders"
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ClipboardList size={15} />
            <span>My Orders</span>
            {myOrders.length > 0 && (
              <span
                className={`flex h-5 min-w-5 px-1.5 items-center justify-center rounded font-mono text-[11px] font-medium ${
                  activeView === "orders" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {myOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ShoppingCart size={15} />
            <span>Basket</span>
            {totalCartCount > 0 && (
              <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded bg-white text-slate-900 font-mono text-[11px] font-medium">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Order Confirmed Banner */}
      {orderConfirmed && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-950">
                  Order confirmed · #{orderConfirmed.id}
                </h3>
                <p className="mt-1 text-xs text-emerald-900 leading-relaxed">
                  Your order from {orderConfirmed.vendor} has been sent to the kitchen.
                  Collect during slot <span className="font-mono">{orderConfirmed.timeSlot}</span> at {orderConfirmed.deliveryLocation}.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-emerald-950">
                  <span>Total: LKR {orderConfirmed.totalAmount.toLocaleString()}</span>
                  <span className="text-emerald-400">·</span>
                  <span>Payment: {orderConfirmed.paymentMethod}</span>
                  <span className="text-emerald-400">·</span>
                  <span>Ref: {studentRegId}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOrderConfirmed(null)}
              className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* VIEW: MY ORDERS & TRACKING */}
      {activeView === "orders" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Active Orders & Delivery Tracking
              </h3>
              <p className="text-xs text-slate-500">
                Live preparation, delivery arrival slots, and gate clearance
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Refresh Status</span>
            </button>
          </div>

          {myOrders.length === 0 ? (
            <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600 mb-3">
                <ClipboardList size={22} />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No active orders in queue</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Browse approved campus vendors and reserve a meal for your preferred gate delivery slot.
              </p>
              <button
                onClick={() => setActiveView("menu")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>Browse Menu</span>
                <ArrowRight size={13} />
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
                    className="rounded-xl border border-slate-200/80 bg-white p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-medium text-slate-900">
                            {order.id}
                          </span>
                          <span className="text-slate-300">·</span>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {order.vendor || "Campus Vendor"}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          Placed: {order.createdAt} · Slot: {order.timeSlot}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span>Drop-off: <strong>{order.deliveryLocation || "Hostel Block B"}</strong></span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <span
                          className={`rounded-md px-2.5 py-0.5 text-[11px] font-medium border ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : order.status === "Out for Delivery"
                                ? "bg-slate-900 text-white border-slate-900"
                                : order.status === "Preparing"
                                  ? "bg-slate-100 text-slate-800 border-slate-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="pt-1">
                      <div className="grid grid-cols-4 gap-2">
                        {steps.map((step, idx) => {
                          const isDone = currentStep >= idx;
                          return (
                            <div key={step} className="space-y-1">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isDone ? "bg-slate-900" : "bg-slate-100"
                                }`}
                              />
                              <span
                                className={`block text-[11px] font-mono ${
                                  isDone ? "text-slate-900 font-medium" : "text-slate-400"
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
                        {order.items?.map((i) => `${i.qty}× ${i.name}`).join(", ") || "Meals bundle"}
                      </div>
                      <div className="font-semibold font-mono tabular-nums text-slate-900 text-sm">
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
          {/* Approved Campus Outlets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Approved campus food outlets
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Security Gate Authorized</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {vendorsList.map((v) => {
                const isSelected = selectedVendor === v.name;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVendor(isSelected ? "All" : v.name)}
                    className={`rounded-xl border p-4 sm:p-5 transition-colors cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-slate-900 bg-slate-50/60"
                        : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                            <Store size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">{v.name}</h4>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              ~ {v.deliveryTime} · Grade {v.hygieneGrade}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          <Star size={11} className="text-amber-500 fill-amber-500" />
                          <span>{v.rating}</span>
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {v.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[11px] text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        {isSelected ? "Active filter" : "Select outlet"}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-900">
                          <Check size={14} /> Selected
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          <ChevronRight size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 space-y-4">
            {/* Row 1: Search Bar + Dietary Preferences */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search menu items or vendors..."
                  className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Dietary Tags */}
              <div className="flex items-center gap-1.5 self-start sm:self-center">
                <span className="text-xs text-slate-500 mr-1">
                  Diet:
                </span>
                {["All", "Halal", "Veg", "Spicy"].map((diet) => (
                  <button
                    key={diet}
                    onClick={() => setDietaryFilter(diet)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer border ${
                      dietaryFilter === diet
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {diet === "Veg" ? "Vegetarian" : diet}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Categories */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 font-mono self-end sm:self-center">
                Showing {filteredItems.length} items
                {selectedVendor !== "All" && ` · ${selectedVendor}`}
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const inCartItem = cart.find((c) => c.id === item.id);
              const qty = inCartItem?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-colors hover:border-slate-300"
                >
                  {/* Image & Clean Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-full w-full object-cover transition duration-300 ${!item.available ? "opacity-50 grayscale-[40%]" : ""}`}
                    />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {!item.available && (
                        <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Sold Out
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-medium text-slate-800 shadow-xs border border-slate-200/70">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span>{item.rating}</span>
                      </span>
                      {item.isHalal && (
                        <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-xs border border-slate-200/70">
                          Halal
                        </span>
                      )}
                      {item.isVeg && (
                        <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-medium text-emerald-800 shadow-xs border border-slate-200/70">
                          Veg
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-medium text-rose-800 shadow-xs border border-slate-200/70">
                          Spicy
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-2.5 right-2.5 rounded-md bg-white/95 font-mono px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-xs border border-slate-200/70">
                      ~ {item.prepTime}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Store size={13} className="text-slate-400" />
                        <span>{item.vendor}</span>
                      </div>
                      <h3 className="mt-1 text-sm font-semibold text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-normal">Price</span>
                        <span className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                          LKR {item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      {!item.available ? (
                        <span className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-400 select-none">
                          Sold Out
                        </span>
                      ) : qty === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/60"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold font-mono tabular-nums text-slate-900 px-1">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
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
        <div className="fixed bottom-6 inset-x-4 max-w-lg mx-auto z-40">
          <div className="flex items-center justify-between rounded-xl bg-slate-900 text-white p-3.5 px-5 shadow-lg border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-white">
                  {totalCartCount} {totalCartCount === 1 ? "item" : "items"} · {cart[0]?.vendor}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                Total: <span className="text-white font-medium">LKR {grandTotal.toLocaleString()}</span>
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white text-slate-900 px-3.5 py-1.5 text-xs font-medium hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Review Order</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Cart Conflict Modal */}
      {cartConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Single Vendor Order Rule
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Your basket currently contains items from <strong>{cartConflictModal.existingVendor}</strong>.
                Each delivery slot is dispatched individually through a dedicated vendor QR pass.
              </p>
              <p className="text-xs text-slate-700 font-medium mt-2">
                Replace existing items and order from <strong>{cartConflictModal.newVendor}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleResolveConflict("keep")}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Keep Existing Cart
              </button>
              <button
                onClick={() => handleResolveConflict("replace")}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
              >
                Replace & Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER PLACED SUCCESSFULLY MODAL */}
      {showSuccessModal && orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Order placed successfully
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your order has been sent to {orderConfirmed.vendor} and is being prepared.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-slate-900">
                    {orderConfirmed.id}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-600 truncate max-w-[180px]">
                    {orderConfirmed.vendor}
                  </span>
                </div>
                <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  {orderConfirmed.status}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-1 py-1">
                {orderConfirmed.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span className="truncate pr-2">
                      <strong className="text-slate-900 font-mono">{item.qty}×</strong> {item.name}
                    </span>
                    <span className="font-mono text-slate-900 shrink-0">
                      LKR {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 gap-1 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 font-mono">
                <div>Slot: {orderConfirmed.timeSlot}</div>
                <div>Drop: {orderConfirmed.deliveryLocation}</div>
              </div>

              {/* Payment & Total */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 font-medium text-slate-700">
                <span>{orderConfirmed.paymentMethod}</span>
                <span className="text-sm font-semibold font-mono text-slate-900">
                  LKR {orderConfirmed.totalAmount?.toLocaleString()}
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
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ClipboardList size={14} />
                <span>Track Order</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-xl border-l border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-slate-700" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Food Order Basket ({totalCartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cart Items Scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  <ShoppingCart size={28} className="mx-auto text-slate-300 mb-2" />
                  Your food cart is currently empty
                </div>
              ) : (
                <>
                  <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium flex items-center gap-1.5">
                      <Store size={14} className="text-slate-500" />
                      Vendor: <strong>{cart[0]?.vendor}</strong>
                    </span>
                    <button
                      onClick={() => setCart([])}
                      className="text-rose-600 font-medium hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-3"
                      >
                        <div className="flex-1 pr-3">
                          <h4 className="text-xs font-medium text-slate-900">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono font-medium text-slate-700">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-slate-600 hover:bg-white rounded transition-colors cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-mono font-medium text-slate-900 px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-slate-600 hover:bg-white rounded transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Configuration */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <Clock size={13} className="text-slate-500" />
                        <span>Delivery time slot</span>
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
                      >
                        {availableSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <MapPin size={13} className="text-slate-500" />
                        <span>Hostel drop-off point</span>
                      </label>
                      <select
                        value={selectedDropLocation}
                        onChange={(e) => setSelectedDropLocation(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
                      >
                        {dropLocations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-700 block mb-1.5">
                        Settlement method
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setPaymentOption("room_bill")}
                          className={`rounded-lg border p-2 text-left transition-colors cursor-pointer ${
                            paymentOption === "room_bill"
                              ? "border-slate-900 bg-white font-medium text-slate-900"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
                          }`}
                        >
                          Hostel Bill
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentOption("cash")}
                          className={`rounded-lg border p-2 text-left transition-colors cursor-pointer ${
                            paymentOption === "cash"
                              ? "border-slate-900 bg-white font-medium text-slate-900"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
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
              <div className="border-t border-slate-200 p-5 space-y-3 bg-white">
                <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans">Subtotal</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">Gate delivery</span>
                    <span>{deliveryFee === 0 ? "FREE" : `LKR ${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">Packaging fee</span>
                    <span>LKR {hostelConvenience}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-sm text-slate-900">
                    <span className="font-sans">Total due</span>
                    <span className="tabular-nums">
                      LKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Placing order...</span>
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
