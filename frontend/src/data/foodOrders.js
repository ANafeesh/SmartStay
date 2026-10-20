const FOOD_ORDERS_STORAGE_KEY = "smartstay-food-orders";

export function readFoodOrders(fallback = []) {
  try {
    const storedOrders = window.localStorage.getItem(FOOD_ORDERS_STORAGE_KEY);
    if (storedOrders === null) return fallback;

    const orders = JSON.parse(storedOrders);
    if (!Array.isArray(orders)) {
      throw new Error("Saved food orders must be a list.");
    }
    return orders;
  } catch (error) {
    console.error("Unable to read saved food orders.", error);
    return fallback;
  }
}

export function saveFoodOrders(orders) {
  window.localStorage.setItem(
    FOOD_ORDERS_STORAGE_KEY,
    JSON.stringify(orders),
  );
}
