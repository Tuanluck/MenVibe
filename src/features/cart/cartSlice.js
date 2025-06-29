import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks cho các API endpoints
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId) => {
    const res = await fetch(`http://localhost:8080/api/cart/${userId}`);
    const data = await res.json();
    return data.items || [];
  }
);

export const fetchTotal = createAsyncThunk(
  'cart/fetchTotal',
  async (userId) => {
    const res = await fetch(`http://localhost:8080/api/cart/${userId}/total`);
    const data = await res.json();
    return data.total || 0;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ userId, productId, quantity }) => {
    const res = await fetch(
      `http://localhost:8080/api/cart/${userId}/add?productId=${productId}&quantity=${quantity}`,
      { method: 'POST' }
    );
    const data = await res.json();
    return data.item;
  }
);

export const increaseQuantity = createAsyncThunk(
  'cart/increaseQuantity',
  async ({ userId, productId }) => {
    await fetch(
      `http://localhost:8080/api/cart/${userId}/increase?productId=${productId}`,
      { method: 'PUT' }
    );
    return productId;
  }
);

export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async ({ userId, productId }) => {
    await fetch(
      `http://localhost:8080/api/cart/${userId}/decrease?productId=${productId}`,
      { method: 'PUT' }
    );
    return productId;
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, productId }) => {
    await fetch(
      `http://localhost:8080/api/cart/${userId}/remove?productId=${productId}`,
      { method: 'DELETE' }
    );
    return productId;
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId) => {
    await fetch(
      `http://localhost:8080/api/cart/${userId}/clear`,
      { method: 'DELETE' }
    );
  }
);

export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async ({ userId, items }) => {
    await fetch(
      `http://localhost:8080/api/cart/${userId}/save`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      }
    );
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateCart: (state, action) => {
      state.items = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // First handle all specific cases
    builder
      // Fetch cart
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      
      // Fetch total
      .addCase(fetchTotal.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      
      // Add item
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(item => item.productId === action.payload.productId);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.loading = false;
      })
      
      // Increase quantity
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        const item = state.items.find(item => item.productId === action.payload);
        if (item) item.quantity += 1;
        state.loading = false;
      })
      
      // Decrease quantity
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        const item = state.items.find(item => item.productId === action.payload);
        if (item && item.quantity > 1) item.quantity -= 1;
        state.loading = false;
      })
      
      // Remove item
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload);
        state.loading = false;
      })
      
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.loading = false;
      })
      
      // Save cart
      .addCase(saveCart.fulfilled, (state) => {
        state.loading = false;
      });

    // Then add the matchers after all specific cases
    builder
      // Xử lý trạng thái chung
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        }
      );
  },
});

export const { updateCart, setError } = cartSlice.actions;
export default cartSlice.reducer;