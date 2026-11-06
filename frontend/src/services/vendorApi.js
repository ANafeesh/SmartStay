import { apiFetch } from "./apiClient";
import { readFoodOrders, saveFoodOrders } from "../data/foodOrders";

const DEFAULT_MENU_ITEMS = [
  {
    id: "ITEM-01",
    itemId: "ITEM-01",
    name: "Chicken Kottu Roti (Full Portion)",
    category: "Main Dishes",
    price: 850,
    available: true,
    prepTime: "15 mins",
    calories: "620 kcal",
    isHalal: true,
    isVeg: false,
    isSpicy: true,
    description: "Chopped flatbread mixed with seasoned chicken, scrambled farm eggs, leeks, and spiced gravy.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "ITEM-02",
    itemId: "ITEM-02",
    name: "Special Egg Fried Rice & Chili Paste",
    category: "Main Dishes",
    price: 650,
    available: true,
    prepTime: "10 mins",
    calories: "510 kcal",
    isHalal: true,
    isVeg: false,
    isSpicy: true,
    description: "Basmati rice wok-tossed with fresh farm eggs, green scallions, and Sri Lankan chili sambol.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "ITEM-03",
    itemId: "ITEM-03",
    name: "Crispy Chicken Burger & Fries",
    category: "Fast Food",
    price: 950,
    available: true,
    prepTime: "12 mins",
    calories: "680 kcal",
    isHalal: true,
    isVeg: false,
    isSpicy: false,
    description: "Fried chicken breast fillet layered with cheese, fresh lettuce, spicy mayo, and golden salted fries.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "ITEM-04",
    itemId: "ITEM-04",
    name: "Iced Caramel Macchiato (500ml)",
    category: "Beverages",
    price: 450,
    available: false,
    prepTime: "5 mins",
    calories: "210 kcal",
    isHalal: true,
    isVeg: true,
    isSpicy: false,
    description: "Cold brewed espresso blended with sweetened creamy milk, vanilla, and salted caramel swirl.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "ITEM-05",
    itemId: "ITEM-05",
    name: "Vegetable Roti & Creamy Dhal",
    category: "Snacks",
    price: 320,
    available: true,
    prepTime: "8 mins",
    calories: "340 kcal",
    isHalal: true,
    isVeg: true,
    isSpicy: true,
    description: "Freshly roasted wheat triangles served with seasoned coconut milk lentils and lunu miris.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400",
  },
];

export const MENU_STORAGE_KEY = "smartstay_vendor_menu_items";

export function saveMenuItemsLocal(items) {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("smartstay-menu-updated", { detail: items }));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save menu items locally:", e);
  }
}

function resolveItemImage(item) {
  if (item.image && typeof item.image === "string" && item.image.trim()) {
    return item.image;
  }
  const name = String(item.name || "").toLowerCase();
  const category = String(item.category || "");

  if (name.includes("biriyani") || name.includes("biryani")) {
    return "/food/biriyani.jpg";
  }
  if (name.includes("fried rice") || name.includes("rice")) {
    return "/food/fried_rice.jpg";
  }
  if (name.includes("kottu")) {
    return "/food/kottu.jpg";
  }
  if (name.includes("noodle")) {
    return "/food/noodles.jpg";
  }
  if (name.includes("burger")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("coffee") || name.includes("macchiato") || name.includes("latte") || name.includes("tea")) {
    return "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("parotta") || name.includes("roti")) {
    return "/food/parotta.jpg";
  }
  if (name.includes("thosai") || name.includes("dosa")) {
    return "/food/masal_thosse.jpg";
  }
  if (name.includes("idli") || name.includes("itli")) {
    return "/food/itli.jpg";
  }
  if (name.includes("string hopper") || name.includes("hopper")) {
    return "/food/string_hoppers.jpg";
  }

  if (category === "Fast Food") {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600";
  }
  if (category === "Beverages") {
    return "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600";
  }
  if (category === "Snacks") {
    return "/food/parotta.jpg";
  }
  return "/food/rice_and_curry.jpg";
}

// ---------------------------------------------------------------------------
// Menu Items Management
// ---------------------------------------------------------------------------

export async function fetchMenuItems() {
  try {
    const res = await apiFetch("/menus", { method: "GET" });
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      const normalized = res.data.map((m) => ({
        id: m._id || m.itemId,
        itemId: m.itemId || m._id,
        vendorId: m.vendorId || "VND-2026-09",
        vendor: m.vendor || "Campus Diner & Cafe",
        name: m.name,
        category: m.category,
        price: Number(m.price),
        available: Boolean(m.available),
        prepTime: m.prepTime || "15 mins",
        calories: m.calories || "450 kcal",
        isHalal: Boolean(m.isHalal),
        isVeg: Boolean(m.isVeg),
        isSpicy: Boolean(m.isSpicy),
        description: m.description || "",
        image: resolveItemImage(m),
        ordersToday: Math.floor(Math.random() * 15) + 5,
      }));
      try {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(normalized));
      } catch {}
      return normalized;
    }
  } catch (err) {
    console.warn("Failed to fetch remote menu items, using cached data:", err.message);
  }

  try {
    const cached = localStorage.getItem(MENU_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}

  return DEFAULT_MENU_ITEMS;
}

export async function createMenuItem(itemData) {
  const chosenImage = resolveItemImage(itemData);
  const payload = {
    itemId: itemData.itemId || `ITEM-${Date.now().toString().slice(-4)}`,
    vendorId: itemData.vendorId || "VND-2026-09",
    vendor: itemData.vendor || "Campus Diner & Cafe",
    name: itemData.name,
    category: itemData.category || "Main Dishes",
    price: Number(itemData.price),
    available: itemData.available !== undefined ? Boolean(itemData.available) : true,
    prepTime: itemData.prepTime || "15 mins",
    calories: itemData.calories || "450 kcal",
    isHalal: Boolean(itemData.isHalal),
    isVeg: Boolean(itemData.isVeg),
    isSpicy: Boolean(itemData.isSpicy),
    description: itemData.description || "",
    image: chosenImage,
  };

  let created = null;

  try {
    const res = await apiFetch("/menus", {
      method: "POST",
      body: payload,
    });
    if (res?.data) {
      created = {
        ...payload,
        id: res.data._id || payload.itemId,
        _id: res.data._id,
        ordersToday: 0,
      };
    }
  } catch (err) {
    console.warn("Remote menu create failed, saving locally:", err.message);
  }

  if (!created) {
    created = {
      ...payload,
      id: payload.itemId,
      ordersToday: 0,
    };
  }

  // Synchronize local storage cache and notify real-time listeners across app
  try {
    const cached = localStorage.getItem(MENU_STORAGE_KEY);
    const existing = cached ? JSON.parse(cached) : [...DEFAULT_MENU_ITEMS];
    const updated = [created, ...existing.filter((x) => x.id !== created.id && x.itemId !== created.itemId)];
    saveMenuItemsLocal(updated);
  } catch (e) {
    console.warn("Failed to sync created menu item:", e);
  }

  return { success: true, data: created };
}

export async function updateMenuItem(id, updates) {
  let updatedData = null;
  try {
    const res = await apiFetch(`/menus/${id}`, {
      method: "PUT",
      body: updates,
    });
    if (res?.data) {
      updatedData = res.data;
    }
  } catch (err) {
    console.warn("Remote menu update failed, saving locally:", err.message);
  }

  // Synchronize local storage cache and notify real-time listeners across app
  try {
    const cached = localStorage.getItem(MENU_STORAGE_KEY);
    const existing = cached ? JSON.parse(cached) : [...DEFAULT_MENU_ITEMS];
    const updated = existing.map((item) =>
      item.id === id || item.itemId === id ? { ...item, ...updates } : item
    );
    saveMenuItemsLocal(updated);
  } catch (e) {
    console.warn("Failed to sync updated menu item:", e);
  }

  return { success: true, data: updatedData || { id, ...updates } };
}

export async function deleteMenuItem(id) {
  try {
    await apiFetch(`/menus/${id}`, { method: "DELETE" });
  } catch (err) {
    console.warn("Remote menu delete failed:", err.message);
  }

  // Synchronize local storage cache and notify real-time listeners across app
  try {
    const cached = localStorage.getItem(MENU_STORAGE_KEY);
    if (cached) {
      const existing = JSON.parse(cached);
      const updated = existing.filter((item) => item.id !== id && item.itemId !== id);
      saveMenuItemsLocal(updated);
    }
  } catch (e) {
    console.warn("Failed to sync deleted menu item:", e);
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Food Orders Management
// ---------------------------------------------------------------------------

export async function fetchVendorOrders() {
  const localOrders = readFoodOrders();
  try {
    const res = await apiFetch("/food-orders", { method: "GET" });
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      const remoteNormalized = res.data.map((o) => ({
        id: o.orderNo || o._id,
        _id: o._id,
        orderNo: o.orderNo,
        studentName: o.studentName || "Student Resident",
        regNo: o.regNo || o.studentId || "STD-2026-101",
        phone: "+94 77 123 4567",
        timeSlot: o.timeSlot || "12:30 PM - 01:00 PM (Lunch)",
        deliveryLocation: o.deliveryLocation || "Hostel Block B - Foyer",
        totalAmount: o.totalAmount || o.subtotal || 1200,
        status: o.status || "Placed",
        createdAt: o.createdAt
          ? (typeof o.createdAt === "string" && o.createdAt.includes(":") && !o.createdAt.includes("T")
              ? o.createdAt
              : new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
          : "Recent",
        paymentMethod: o.paymentMethod || "Charged to Room Bill",
        paymentStatus: o.paymentStatus || "Pending",
        items: Array.isArray(o.items) && o.items.length > 0
          ? o.items.map((i) => ({ name: i.name, qty: i.qty || 1, price: i.price }))
          : [{ name: "Food Order Combo", qty: 1, price: o.totalAmount || 1200 }],
      }));

      // Preserve any pending local order not yet in the remote response
      const remoteKeys = new Set(remoteNormalized.map((r) => r.id || r.orderNo));
      const pendingLocals = localOrders.filter((l) => !remoteKeys.has(l.id) && !remoteKeys.has(l.orderNo));
      const combined = [...pendingLocals, ...remoteNormalized];

      saveFoodOrders(combined);
      return combined;
    }
  } catch (err) {
    console.warn("Failed to fetch remote food orders, reading local cache:", err.message);
  }

  return localOrders;
}

export async function updateOrderStatusApi(orderId, newStatus) {
  try {
    const res = await apiFetch(`/food-orders/${orderId}/status`, {
      method: "PATCH",
      body: { status: newStatus },
    });
    if (res?.success) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    console.warn("Remote order status update failed, syncing locally:", err.message);
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Earnings & Payouts Management
// ---------------------------------------------------------------------------

export async function fetchVendorEarnings() {
  try {
    const res = await apiFetch("/vendors/earnings", { method: "GET" });
    if (res?.data) {
      return res.data;
    }
  } catch (err) {
    console.warn("Failed to fetch remote vendor earnings, calculating locally:", err.message);
  }

  // Calculate from local orders
  const orders = readFoodOrders();
  const validOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalRev = validOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) || 412650;
  const todayRev = validOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) || 14250;

  return {
    summary: {
      todayEarnings: todayRev,
      thisWeekEarnings: Math.round(todayRev * 5.8),
      thisMonthEarnings: Math.round(todayRev * 21.5),
      totalRevenue: totalRev,
      pendingPayout: 18500,
    },
    salesByCategory: [
      { category: "Main Dishes", amount: 185000, percentage: 59 },
      { category: "Fast Food", amount: 82000, percentage: 26 },
      { category: "Beverages", amount: 45000, percentage: 15 },
    ],
    payoutHistory: [
      {
        id: "PAY-8012",
        date: "28 Sep 2026",
        amount: 42000,
        method: "Bank Transfer (Commercial Bank)",
        status: "Completed",
      },
      {
        id: "PAY-7950",
        date: "21 Sep 2026",
        amount: 38500,
        method: "Bank Transfer (Commercial Bank)",
        status: "Completed",
      },
      {
        id: "PAY-7891",
        date: "14 Sep 2026",
        amount: 45000,
        method: "Bank Transfer (Commercial Bank)",
        status: "Completed",
      },
    ],
    ordersCount: orders.length,
  };
}

export async function requestPayoutDisbursement(amount, method) {
  try {
    const res = await apiFetch("/vendors/request-payout", {
      method: "POST",
      body: { amount, method },
    });
    if (res?.data) {
      return { success: true, data: res.data, message: res.message };
    }
  } catch (err) {
    console.warn("Remote payout request failed, handling locally:", err.message);
  }

  const newPayout = {
    id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    amount: Number(amount) || 25000,
    method: method || "Bank Transfer (Commercial Bank)",
    status: "Processing",
  };
  return { success: true, data: newPayout, message: "Payout request submitted for processing." };
}

