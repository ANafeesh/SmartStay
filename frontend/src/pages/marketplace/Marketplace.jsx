import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Star,
  Clock3,
  MapPin,
  Plus,
  Heart,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const categories = [
  "All",
  "Rice & Curry",
  "Short Eats",
  "Burgers",
  "Pizza",
  "Drinks",
  "Desserts",
];

const foods = [
  {
    id: 1,
    name: "Chicken Rice & Curry",
    vendor: "Campus Kitchen",
    category: "Rice & Curry",
    price: 450,
    rating: 4.8,
    time: "15-20 min",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    popular: true,
  },
  {
    id: 2,
    name: "Chicken Burger",
    vendor: "Food Hub",
    category: "Burgers",
    price: 650,
    rating: 4.7,
    time: "15-20 min",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    popular: true,
  },
  {
    id: 3,
    name: "Cheese Pizza",
    vendor: "Campus Bites",
    category: "Pizza",
    price: 850,
    rating: 4.6,
    time: "20-25 min",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    popular: false,
  },
  {
    id: 4,
    name: "Vegetable Roti",
    vendor: "Quick Eats",
    category: "Short Eats",
    price: 180,
    rating: 4.5,
    time: "10-15 min",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80",
    popular: false,
  },
  {
    id: 5,
    name: "Fresh Fruit Juice",
    vendor: "Juice Corner",
    category: "Drinks",
    price: 250,
    rating: 4.9,
    time: "5-10 min",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    popular: true,
  },
  {
    id: 6,
    name: "Chocolate Cake",
    vendor: "Sweet Spot",
    category: "Desserts",
    price: 350,
    rating: 4.8,
    time: "10-15 min",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    popular: false,
  },
];

function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "All" || food.category === selectedCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(search.toLowerCase()) ||
      food.vendor.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-smart-blue">
            SmartStay Marketplace
          </p>

          <h1 className="mt-1 text-3xl font-bold text-smart-primary">
            Food Marketplace
          </h1>

          <p className="mt-2 text-smart-secondary">
            Discover delicious food from approved campus vendors.
          </p>
        </div>

        {/* Cart */}
        <button className="relative flex items-center gap-3 self-start rounded-xl bg-smart-primary px-5 py-3 font-semibold text-white transition hover:bg-smart-blue md:self-auto">
          <ShoppingCart size={20} />

          <span>Cart</span>

          {cartCount > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-smart-accent px-1 text-xs">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-8">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-smart-secondary"
        />

        <input
          type="text"
          placeholder="Search food or vendors..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-smart-blue focus:ring-4 focus:ring-smart-blue/10"
        />
      </div>

      {/* Categories */}
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => {
          const active = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-smart-blue text-white shadow-sm"
                  : "bg-white text-smart-secondary hover:bg-smart-blue/10 hover:text-smart-blue"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Popular section */}
      {selectedCategory === "All" && !search && (
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-smart-primary">
                Popular Near You
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Student favorites this week
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {foods
              .filter((food) => food.popular)
              .map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  isFavorite={favorites.includes(food.id)}
                  onFavorite={() => toggleFavorite(food.id)}
                  onAdd={() => setCartCount((count) => count + 1)}
                />
              ))}
          </div>
        </section>
      )}

      {/* All foods */}
      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-smart-primary">
            {selectedCategory === "All" ? "All Food" : selectedCategory}
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            {filteredFoods.length} items available
          </p>
        </div>

        {filteredFoods.length === 0 ? (
          <Card>
            <div className="py-10 text-center">
              <p className="font-semibold text-smart-primary">No food found</p>

              <p className="mt-2 text-sm text-smart-secondary">
                Try another search or category.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                isFavorite={favorites.includes(food.id)}
                onFavorite={() => toggleFavorite(food.id)}
                onAdd={() => setCartCount((count) => count + 1)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FoodCard({ food, isFavorite, onFavorite, onAdd }) {
  return (
    <Card padding="p-0" className="group overflow-hidden">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <button
          onClick={onFavorite}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-smart-secondary shadow-sm backdrop-blur transition hover:text-smart-danger"
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
            className={isFavorite ? "text-smart-danger" : ""}
          />
        </button>

        {food.popular && (
          <div className="absolute left-3 top-3">
            <Badge variant="teal">Popular</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-smart-primary">{food.name}</h3>

            <p className="mt-1 text-sm text-smart-secondary">{food.vendor}</p>
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold text-smart-warning">
            <Star size={15} fill="currentColor" />
            {food.rating}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-smart-secondary">
          <span className="flex items-center gap-1">
            <Clock3 size={14} />
            {food.time}
          </span>

          <span className="flex items-center gap-1">
            <MapPin size={14} />
            Campus
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
          <div>
            <span className="text-xs text-smart-secondary">Price</span>

            <p className="text-lg font-bold text-smart-primary">
              Rs. {food.price}
            </p>
          </div>

          <Button
            size="sm"
            onClick={onAdd}
            className="inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Marketplace;
