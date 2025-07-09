import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Food } from "../../../types/foodTypes";

interface CartItem extends Food {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

// Helper to load cart items from AsyncStorage
const loadCartFromStorage = async (): Promise<CartItem[]> => {
  try {
    const storedCart = await AsyncStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to load cart from storage", error);
    return [];
  }
};

// Helper to calculate total quantity and total price
const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalQuantity, totalPrice };
};

// Initial state
const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCartError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    initializeCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    addToCart(state, action: PayloadAction<Food>) {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item._id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item) {
        item.quantity = quantity;
      }
      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.totalQuantity;
      state.totalPrice = totals.totalPrice;
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

// Thunk to initialize cart from AsyncStorage
export const initializeCart = () => async (dispatch: any) => {
  dispatch(cartSlice.actions.setCartLoading(true));
  try {
    const cartItems = await loadCartFromStorage();
    dispatch(cartSlice.actions.initializeCart(cartItems));
  } catch (error) {
    dispatch(cartSlice.actions.setCartError("Failed to load cart"));
    console.error(error);
  } finally {
    dispatch(cartSlice.actions.setCartLoading(false));
  }
};

// Thunk to persist cart to AsyncStorage after updates
const persistCart = (items: CartItem[]) => async (dispatch: any) => {
  try {
    await AsyncStorage.setItem("cartItems", JSON.stringify(items));
  } catch (error) {
    dispatch(cartSlice.actions.setCartError("Failed to save cart"));
    console.error(error);
  }
};

// Enhanced action creators that persist changes
export const addToCartAndPersist = (item: Food) => async (dispatch: any) => {
  dispatch(cartSlice.actions.addToCart(item));
  dispatch(persistCart(cartSlice.getInitialState().items));
};

export const removeFromCartAndPersist = (id: string) => async (dispatch: any) => {
  dispatch(cartSlice.actions.removeFromCart(id));
  dispatch(persistCart(cartSlice.getInitialState().items));
};

export const updateQuantityAndPersist = (payload: { id: string; quantity: number }) => async (dispatch: any) => {
  dispatch(cartSlice.actions.updateQuantity(payload));
  dispatch(persistCart(cartSlice.getInitialState().items));
};

export const clearCartAndPersist = () => async (dispatch: any) => {
  dispatch(cartSlice.actions.clearCart());
  dispatch(persistCart([]));
};

export const {
  setCartLoading,
  setCartError,
  initializeCart: initializeCartAction,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.totalQuantity;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.totalPrice;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

export default cartSlice.reducer;