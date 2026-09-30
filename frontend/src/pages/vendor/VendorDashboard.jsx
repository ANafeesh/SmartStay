import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Store,
  DollarSign,
  Package,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";

const initialMenuItems = [
  {
    id: "FD-101",
    name: "Chicken Kottu Roti (Full)",
    category: "Main Dishes",
    price: 850,
    available: true,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "FD-103",
    name: "Egg Fried Rice with Chili Paste",
    category: "Main Dishes",
    price: 650,
    available: true,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "FD-106",
    name: "Devilled Chicken Portion",
    category: "Sides",
    price: 700,
    available: false,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=400",
  },
];

function VendorDashboard() {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Main Dishes");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setCategory(item.category);
      setPrice(item.price);
      setImage(item.image);
    } else {
      setEditingItem(null);
      setName("");
      setCategory("Main Dishes");
      setPrice("");
      setImage("");
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();

    if (editingItem) {
      setMenuItems(
        menuItems.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                name,
                category,
                price: parseFloat(price),
                image:
                  image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
              }
            : i,
        ),
      );
    } else {
      const newItem = {
        id: `FD-${Math.floor(100 + Math.random() * 900)}`,
        name,
        category,
        price: parseFloat(price),
        available: true,
        image:
          image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
      };
      setMenuItems([newItem, ...menuItems]);
    }

    setIsModalOpen(false);
  };

  const toggleAvailability = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems(menuItems.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Vendor Menu Management
            </h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
              Approved
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage your restaurant food catalog, prices, and stock availability.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition"
        >
          <Plus size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Catalog
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            Total Listed Items
          </p>
          <h3 className="mt-0.5 text-2xl font-bold text-slate-900">
            {menuItems.length} Items
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Check size={20} />
            </div>
            <span className="text-xs font-semibold text-emerald-600">
              Active
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            In-Stock Items
          </p>
          <h3 className="mt-0.5 text-2xl font-bold text-slate-900">
            {menuItems.filter((i) => i.available).length} Ready
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <X size={20} />
            </div>
            <span className="text-xs font-semibold text-rose-600">
              Unavailable
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            Out of Stock Items
          </p>
          <h3 className="mt-0.5 text-2xl font-bold text-slate-900">
            {menuItems.filter((i) => !i.available).length} Off
          </h3>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs"
          >
            <div>
              <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2.5 right-2.5 rounded-lg bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white">
                  {item.category}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {item.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">
                    LKR {item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              {/* Availability Toggle */}
              <button
                onClick={() => toggleAvailability(item.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
              >
                {item.available ? (
                  <ToggleRight size={24} className="text-emerald-600" />
                ) : (
                  <ToggleLeft size={24} className="text-slate-400" />
                )}
                <span
                  className={
                    item.available ? "text-emerald-700" : "text-slate-400"
                  }
                >
                  {item.available ? "In Stock" : "Out of Stock"}
                </span>
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingItem ? "Edit Food Item" : "Add Food Item"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chicken Kottu Roti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="Main Dishes">Main Dishes</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="850"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500"
                >
                  {editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;
