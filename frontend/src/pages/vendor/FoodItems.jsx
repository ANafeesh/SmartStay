import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  UtensilsCrossed,
  Edit2,
  Trash2,
  X,
  Clock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../services/vendorApi";

export default function FoodItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "Main Dishes",
    price: "",
    prepTime: "15 mins",
    calories: "450 kcal",
    description: "",
    image: "",
    isHalal: true,
    isVeg: false,
    isSpicy: false,
  });

  const categories = ["All", "Main Dishes", "Fast Food", "Snacks", "Beverages"];

  // Fetch real menu items from backend API
  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMenuItems();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to load food items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    const handleSync = () => loadItems();
    window.addEventListener("smartstay-menu-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("smartstay-menu-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const showNotification = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const toggleAvailability = async (id, currentAvailable) => {
    const updatedStatus = !currentAvailable;
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) =>
        item.id === id || item.itemId === id
          ? { ...item, available: updatedStatus }
          : item,
      ),
    );

    try {
      await updateMenuItem(id, { available: updatedStatus });
      showNotification(`Item availability set to ${updatedStatus ? "In Stock" : "Sold Out"}`);
    } catch (err) {
      console.error("Failed to update availability:", err);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      name: "",
      category: "Main Dishes",
      price: "",
      prepTime: "15 mins",
      calories: "450 kcal",
      description: "",
      image: "",
      isHalal: true,
      isVeg: false,
      isSpicy: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      prepTime: item.prepTime,
      calories: item.calories,
      description: item.description,
      image: item.image || "",
      isHalal: item.isHalal,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id && i.itemId !== id));
    try {
      await deleteMenuItem(id);
      showNotification("Menu item deleted from database.");
    } catch (err) {
      console.error("Failed to delete menu item:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const targetId = editingItem.id || editingItem.itemId;
      const updatedFields = {
        ...form,
        price: Number(form.price),
      };

      setItems((prev) =>
        prev.map((i) =>
          i.id === targetId || i.itemId === targetId
            ? { ...i, ...updatedFields }
            : i,
        ),
      );
      setModalOpen(false);

      try {
        await updateMenuItem(targetId, updatedFields);
        showNotification("Menu item updated successfully in MongoDB.");
      } catch (err) {
        console.error("Failed to update item:", err);
      }
    } else {
      const newItem = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        prepTime: form.prepTime,
        calories: form.calories,
        description: form.description,
        image: form.image,
        isHalal: form.isHalal,
        isVeg: form.isVeg,
        isSpicy: form.isSpicy,
        available: true,
      };

      setModalOpen(false);

      try {
        const res = await createMenuItem(newItem);
        if (res?.data) {
          setItems((prev) => [res.data, ...prev]);
        } else {
          setItems((prev) => [{ ...newItem, id: `ITEM-${Date.now()}` }, ...prev]);
        }
        showNotification("New food item added to live database!");
      } catch (err) {
        console.error("Failed to create item:", err);
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.itemId || item.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Food Menus & Catalog Inventory
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Live Database Catalog
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Outlet: <strong className="text-slate-800">Campus Diner & Cafe</strong> &middot; Daily Meal Items &amp; Pricing
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Notification Toast */}
      {actionMessage && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-3.5 text-emerald-950 flex items-center gap-2.5 text-xs font-bold animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food item name, spice level, or ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Inventory Grid */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm font-medium">Fetching real-time menu catalog from database...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-slate-400">
          <UtensilsCrossed size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No food items matched your criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try another search or add a new menu item.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id || item.itemId}
              className={`flex flex-col justify-between rounded-3xl border p-5 transition shadow-2xs ${
                item.available
                  ? "border-slate-200/80 bg-white hover:border-slate-300"
                  : "border-slate-200 bg-slate-50/70 opacity-80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <UtensilsCrossed size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-[11px] font-mono font-semibold text-slate-400">
                        {item.itemId || item.id} &middot; {item.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAvailability(item.id || item.itemId, item.available)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition ${
                      item.available
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                    title="Click to toggle availability"
                  >
                    {item.available ? "In Stock" : "Sold Out"}
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {item.description || "Freshly cooked food offering for hostel residents."}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 flex items-center gap-1">
                    <Clock size={11} /> {item.prepTime || "15 mins"}
                  </span>
                  {item.calories && (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                      {item.calories}
                    </span>
                  )}
                  {item.isHalal && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-100">
                      Halal
                    </span>
                  )}
                  {item.isVeg && (
                    <span className="rounded-md bg-green-50 px-2 py-0.5 font-bold text-green-700 border border-green-100">
                      Veg
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="rounded-md bg-rose-50 px-2 py-0.5 font-bold text-rose-700 border border-rose-100">
                      🌶️ Spicy
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Selling Price</span>
                  <span className="text-base font-black text-slate-900">
                    LKR {Number(item.price).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id || item.itemId)}
                    className="rounded-xl border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50 transition shadow-2xs cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? "Edit Menu Offering" : "Add New Menu Item"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Food Item Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Chicken Kottu Roti"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Main Dishes">Main Dishes</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="850"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={form.prepTime}
                    onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                    placeholder="15 mins"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Calories / Nutrition
                  </label>
                  <input
                    type="text"
                    value={form.calories}
                    onChange={(e) => setForm({ ...form, calories: e.target.value })}
                    placeholder="550 kcal"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe taste, ingredients, and portion size..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Food Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... or leave empty for smart category dish photo"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isHalal}
                    onChange={(e) => setForm({ ...form, isHalal: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Halal Certified</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVeg}
                    onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSpicy}
                    onChange={(e) => setForm({ ...form, isSpicy: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Spicy Item</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition cursor-pointer"
                >
                  {editingItem ? "Update Offering" : "Add to Live Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
