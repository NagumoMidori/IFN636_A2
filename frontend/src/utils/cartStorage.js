// Annotate this part for checking cartFacade is working 2026/05/12



/* export const CART_STORAGE_KEY = 'exploreAustraliaCart';
export const CART_UPDATED_EVENT = 'exploreAustraliaCartUpdated';

const isBrowser = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/images/bondi_beach.jpg';
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/images')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) return `http://localhost:5001${imageUrl}`;
  return imageUrl;
};

const emitCartUpdated = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const getCartItems = () => {
  if (!isBrowser()) return [];

  try {
    const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
};

export const saveCartItems = (items) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  emitCartUpdated();
};

export const addCartItem = (item) => {
  const items = getCartItems();
  const cartItem = {
    ...item,
    cartItemId: item.cartItemId || `${item.tour}-${Date.now()}`,
    quantity: Number(item.quantity) || 1,
    unitPrice: Number(item.unitPrice) || 0,
    totalPrice: (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1),
  };

  saveCartItems([...items, cartItem]);
  return cartItem;
};

export const updateCartItem = (cartItemId, updates) => {
  const items = getCartItems();
  const nextItems = items.map((item) => {
    if (item.cartItemId !== cartItemId) return item;

    const quantity = Number(updates.quantity ?? item.quantity) || 1;
    const unitPrice = Number(updates.unitPrice ?? item.unitPrice) || 0;

    return {
      ...item,
      ...updates,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };
  });

  saveCartItems(nextItems);
  return nextItems;
};

export const removeCartItem = (cartItemId) => {
  const nextItems = getCartItems().filter((item) => item.cartItemId !== cartItemId);
  saveCartItems(nextItems);
  return nextItems;
};

export const clearCart = () => {
  saveCartItems([]);
};

export const getCartCount = () => getCartItems().reduce((count, item) => count + (Number(item.quantity) || 0), 0);

export const subscribeToCartUpdates = (handler) => {
  if (!isBrowser()) return () => {};
  window.addEventListener(CART_UPDATED_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
};
 */