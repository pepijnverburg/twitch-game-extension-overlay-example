import { createSlice } from '@reduxjs/toolkit';

import Theme from '../../styles/Theme';
import { StateMessage } from './store';

export interface OverlayState {
  topPosition: number;
}

export interface SetOverlayAction {
  type: string;
  payload: StateMessage;
}

export const initialOverlayState: OverlayState = {
  topPosition: Theme.APP_DEFAULT_TOP,
};

export const overlaySlice = createSlice({
  name: 'overlay',
  initialState: initialOverlayState,
  reducers: {
    setOverlay: (state: OverlayState, action: SetOverlayAction): OverlayState => {
      const { topPosition } = action.payload;

      return {
        ...state,
        topPosition: topPosition || initialOverlayState.topPosition,
      };
    },
  },
});

export const { setOverlay } = overlaySlice.actions;