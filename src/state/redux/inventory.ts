import { createSlice } from '@reduxjs/toolkit';

import { Item, StateMessage, parseItems } from './store';

export interface InventoryState {
  items: Item[] | null;
  totalPrice: number | undefined;
}

export interface SetInventoryAction {
  type: string;
  payload: StateMessage;
}

export const initialInventoryState: InventoryState = {
  items: null,
  totalPrice: 0,
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: initialInventoryState,
  reducers: {
    setInventory: (state: InventoryState, action: SetInventoryAction): InventoryState => {
      return {
        ...state,
        items: parseItems(action.payload.inventory ?? null),
        totalPrice: action.payload.inventoryPrice ?? 0,
      };
    },
  },
});

export const { setInventory } = inventorySlice.actions;
