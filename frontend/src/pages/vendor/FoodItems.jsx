import { useState } from "react";
import {
  Search,
  Plus,
  UtensilsCrossed,
  Tag,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";

const initialItems = [
  {
    id: "ITEM-01",
    name: "Chicken Kottu Roti (Full)",
    category: "Main Dishes",
    price: 850,
    available: true,
    description:
      "Chopped flatbread mixed with spiced chicken, eggs, and gravy.",
  },
  {
    id: "ITEM-02",
    name: "Egg Fried Rice",
    category: "Main Dishes",
    price: 650,
    available: true,
    description: "Basmati rice wok-tossed with fresh eggs and spring onions.",
  },
  {
    id: "ITEM-03",
    name: "Crispy Chicken Burger & Fries",
    category: "Fast Food",
    price: 950,
    available: true,
    description:
      "Fried chicken patty with lettuce, spicy mayo, and golden fries.",
  },
  {
    id: "ITEM-04",
    name: "Iced Milk Coffee (500ml)",
    category: "Beverages",
    price: 350,
    available: false,
    description: "Cold brewed espresso blended with sweetened milk and ice.",
  },
];

function FoodItems() {
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Main Dishes", "Fast Food", "Beverages"];

  const toggleAvailability = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Food Items Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage menu offerings, update item pricing, and toggle instant stock
            availability.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition shrink-0">
          <Plus size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Search and Category Filters */}
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
            placeholder="Search food item name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
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

      {/* Inventory Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-slate-300"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <UtensilsCrossed size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400">
                      {item.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    item.available
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-rose-50 text-rose-700 border border-rose-200/60"
                  }`}
                >
                  {item.available ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Price
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    Rs. {item.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      item.available
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    {item.available ? "Mark Sold Out" : "Enable Item"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodItems;
