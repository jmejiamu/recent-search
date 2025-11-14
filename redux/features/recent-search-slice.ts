import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecentSearchItem {
  idDrink: string;
  name: string;
  image: string;
  type: string;
  instructions: string;
  glass: string;
}
interface RecentSearchState {
  items: RecentSearchItem[];
}

const initialState: RecentSearchState = {
  items: [],
};

const recentSearchSlice = createSlice({
  name: "recentSearch",
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<RecentSearchItem>) => {
      state.items.unshift(action.payload);
      // Keep only the last 10 searches
      state.items = state.items.slice(0, 10);
    },
    removeOneItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.idDrink !== action.payload
      );
    },
    clearSearches: (state) => {
      state.items = [];
    },
  },
});

export const { addSearch, clearSearches, removeOneItem } =
  recentSearchSlice.actions;
export default recentSearchSlice.reducer;
