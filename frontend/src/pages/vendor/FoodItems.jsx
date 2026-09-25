import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Utensils,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

function FoodItems() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [foodItems, setFoodItems] = useState([
    {
      id: 1,
      name: "Chicken Rice & Curry",
      category: "Rice & Curry",
      price: 450,
      status: "Available",
      orders: 42,
    },
    {
      id: 2,
      name: "Chicken Burger",
      category: "Burgers",
      price: 650,
      status: "Available",
      orders: 31,
    },
    {
      id: 3,
      name: "Cheese Pizza",
      category: "Pizza",
      price: 850,
      status: "Available",
      orders: 25,
    },
    {
      id: 4,
      name: "Vegetable Roti",
      category: "Short Eats",
      price: 180,
      status: "Unavailable",
      orders: 18,
    },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Rice & Curry",
    price: "",
  });

  const filteredItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewItem((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!newItem.name || !newItem.price) {
      alert("Please enter food name and price.");
      return;
    }

    const item = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      status: "Available",
      orders: 0,
    };

    setFoodItems((previous) => [...previous, item]);

    setNewItem({
      name: "",
      category: "Rice & Curry",
      price: "",
    });

    setShowForm(false);
  };

  const toggleAvailability = (id) => {
    setFoodItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Available" ? "Unavailable" : "Available",
            }
          : item,
      ),
    );
  };

  const deleteItem = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food item?",
    );

    if (!confirmed) return;

    setFoodItems((previous) => previous.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-smart-teal">
            Vendor Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
            Food Items
          </h1>

          <p className="mt-2 text-sm text-smart-secondary">
            Manage the food items available in your marketplace.
          </p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Food Item
        </Button>
      </div>

      {/* Add Food Form */}
      {showForm && (
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-smart-primary">
              Add New Food Item
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Enter the details of your new menu item.
            </p>
          </div>

          <form onSubmit={handleAddItem} className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-smart-primary">
                Food Name
              </label>

              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="Example: Chicken Kottu"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-smart-primary">
                Category
              </label>

              <select
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
              >
                <option>Rice & Curry</option>
                <option>Short Eats</option>
                <option>Burgers</option>
                <option>Pizza</option>
                <option>Drinks</option>
                <option>Desserts</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-smart-primary">
                Price (Rs.)
              </label>

              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                placeholder="450"
                min="0"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
              />
            </div>

            <div className="flex gap-3 md:col-span-3">
              <Button type="submit">Add Item</Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <Card padding="p-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-smart-secondary"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food items..."
            className="w-full rounded-xl bg-smart-background py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-smart-blue/20"
          />
        </div>
      </Card>

      {/* Food Items */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              My Food Items
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              {filteredItems.length} item
              {filteredItems.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
              <Utensils size={26} />
            </div>

            <h3 className="mt-4 font-bold text-smart-primary">
              No food items found
            </h3>

            <p className="mt-1 text-sm text-smart-secondary">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Food Item
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Category
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Price
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Orders
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Status
                  </th>

                  <th className="pb-3 text-right text-xs font-semibold uppercase text-smart-secondary">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
                          <Utensils size={18} />
                        </div>

                        <span className="text-sm font-semibold text-smart-primary">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 text-sm text-smart-secondary">
                      {item.category}
                    </td>

                    <td className="py-4 text-sm font-semibold text-smart-primary">
                      Rs. {item.price.toLocaleString()}
                    </td>

                    <td className="py-4 text-sm text-smart-secondary">
                      {item.orders}
                    </td>

                    <td className="py-4">
                      <Badge
                        variant={
                          item.status === "Available" ? "success" : "danger"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>

                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          title="Toggle availability"
                          onClick={() => toggleAvailability(item.id)}
                          className="rounded-lg p-2 text-smart-secondary transition hover:bg-smart-background hover:text-smart-blue"
                        >
                          {item.status === "Available" ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                        <button
                          title="Edit item"
                          className="rounded-lg p-2 text-smart-blue transition hover:bg-smart-blue/10"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title="Delete item"
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg p-2 text-smart-danger transition hover:bg-smart-danger/10"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default FoodItems;
