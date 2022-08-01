import { createSlice } from '@reduxjs/toolkit';

import { StateMessage } from './store';

export interface Player {
  playerName: string;
}

export type PlayerState = Player;

export interface SetPlayerAction {
  type: string;
  payload: StateMessage;
}

export const initialPlayerState: PlayerState = {
  playerName: '',
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,
  reducers: {
    setPlayer: (state: PlayerState, action: SetPlayerAction): PlayerState => {
      const { playerName } = action.payload;

      return {
        ...state,
        playerName: playerName ?? initialPlayerState.playerName,
      };
     },
  },
});

export const { setPlayer } = playerSlice.actions;