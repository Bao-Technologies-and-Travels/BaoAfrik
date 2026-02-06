import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UI state interface - for global UI states like modals, loading overlays, etc.
interface UiState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  globalLoading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | null;
}

// Initial state
const initialState: UiState = {
  isSidebarOpen: false,
  isSearchOpen: false,
  globalLoading: false,
  toastMessage: null,
  toastType: null,
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    clearToast: (state) => {
      state.toastMessage = null;
      state.toastType = null;
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSearch,
  setSearchOpen,
  setGlobalLoading,
  showToast,
  clearToast,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
