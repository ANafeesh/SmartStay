import { useState } from "react";
import {
  Search,
  Plus,
  UtensilsCrossed,
  Edit2,
  Trash2,
  X,
  Clock,
} from "lucide-react";

const initialItems = [
  {
    id: "ITEM-01",
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
  },
  {
    id: "ITEM-02",
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
  },
  {
    id: "ITEM-03",
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
  },
  {
    id: "ITEM-04",
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
  },
  {
    id: "ITEM-05",
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
  },
];

export default function FoodItems() {
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "Main Dishes",
    price: "",
    prepTime: "15 mins",
    calories: "450 kcal",
    description: "",
    isHalal: true,
    isVeg: false,
    isSpicy: false,
  });

  const categories = ["All", "Main Dishes", "Fast Food", "Snacks", "Beverages"];

  const toggleAvailability = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
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
      isHalal: item.isHalal,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setItems(
        items.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                ...form,
                price: Number(form.price),
              }
            : i,
        ),
      );
    } else {
      const newItem = {
        id: `ITEM-0${items.length + 1}`,
        ...form,
        price: Number(form.price),
        available: true,
      };
      setItems([newItem, ...items]);
    }
    setModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
              Canteen Menu Catalog
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Outlet: <strong className="text-slate-800">Campus Diner & Cafe</strong> &middot; Daily Meal Items &amp; Pricing</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
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
                      {item.id} Â· {item.category}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleAvailability(item.id)}
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
                {item.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 flex items-center gap-1">
                  <Clock size={11} /> {item.prepTime}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                  {item.calories}
                </span>
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
                    ðŸŒ¶ï¸ Spicy
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Selling Price</span>
                <span className="text-base font-black text-slate-900">
                  LKR {item.price}
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
                  onClick={() => handleDelete(item.id)}
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
                    Preparation Time
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
                    Calories
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
                  placeholder="Ingredients and culinary notes..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isHalal}
                    onChange={(e) => setForm({ ...form, isHalal: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Halal Certified</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVeg}
                    onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSpicy}
                    onChange={(e) => setForm({ ...form, isSpicy: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Spicy</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-xs cursor-pointer"
                >
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
