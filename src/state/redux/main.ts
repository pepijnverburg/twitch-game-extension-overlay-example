import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { StateMessage } from './store';

export interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

export interface WindowZoomBreakpoint {
  minWidth: number;
  windowZoom: number;
}

export interface MainState {
  windowSize: WindowSize;
  contentId: string;
  content: StateMessage;
}

export interface SetContentAction {
  type: string;
  payload: StateMessage;
}

export interface SetPausedAction {
  type: string;
  payload: boolean;
}

export interface SetWindowSizeAction {
  type: string;
  payload: {
    windowSize: WindowSize;
  };
}

export const initialMainState: MainState = {
  windowSize: {
    width: undefined,
    height: undefined,
  },
  contentId: '',
  content: {},
};

export const mainSlice = createSlice({
  name: 'main',
  initialState: initialMainState,
  reducers: {
    setContent: (state: MainState, action: SetContentAction): MainState => {
      const content = action.payload;

      return {
        ...state,
        contentId: uuidv4(),
        content,
      };
    },
    setWindowSize: (state: MainState, action: SetWindowSizeAction): MainState => {
      const { windowSize } = action.payload;
      const { width } = windowSize;

      // guard: check if the width is valid
      if (!width) {
        return state;
      }

      return {
        ...state,
        windowSize,
      }
    },
  },
});

export const { setContent, setWindowSize } = mainSlice.actions;
