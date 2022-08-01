import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import pako from 'pako';
import atob from 'atob';
import { map, isEmpty, isString } from 'lodash';

import { mainSlice, setContent } from './main';
import { playerSlice, setPlayer } from './player';
import { logger } from '../../logger';
import { authSlice } from './auth';
import { inventorySlice, setInventory } from './inventory';
import { overlaySlice, setOverlay } from './overlay';

export interface Item {
  id: number;
  quantity: number;
}

export type StateMessageItem = number[];

export interface StateMessage {
  playerName?: string | null;
  inventory?: StateMessageItem[] | null;
  inventoryPrice?: number | null;
  topPosition?: number | null;
}

export interface StateToActionEntry {
  key: keyof StateMessage;
  action: Function;
}

export const rootReducer = combineReducers({
  main: mainSlice.reducer,
  auth: authSlice.reducer,
  player: playerSlice.reducer,
  inventory: inventorySlice.reducer,
  overlay: overlaySlice.reducer,
});

const customizedMiddleware = getDefaultMiddleware({
  immutableCheck: false,
  serializableCheck: false,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: customizedMiddleware,
});

export type RootState = ReturnType<typeof rootReducer>;

export const parseContent = (compressedContent: string): StateMessage => {

  // guard: attempt to directly parse the content to JSON
  // to support uncompressed payloads as well for future versions
  try {
    const parsedContent = JSON.parse(compressedContent);
    return parsedContent;
  } catch (error) {
    // ignore errors and just continue
  }

  // start with decoding the base64 string
  const decodedBase64Content = atob(compressedContent);

  // now we can decompress the GZIP
  const decompressedContent = pako.ungzip(decodedBase64Content);

  // decode the data to UTF8 charset
  const decodedUtf8Content = new TextDecoder('utf-8').decode(decompressedContent);

  // finally we can parse to JSON
  const parsedContent: StateMessage = JSON.parse(decodedUtf8Content);

  return parsedContent;
};

export const parseItems = (unparsedItems: StateMessageItem[] | null): Item[] | null => {
  if (unparsedItems === null) {
    return null;
  }

  return map(unparsedItems, (unparsedItem: StateMessageItem): Item => {
    const [id, quantity = 0] = unparsedItem;
    const item: Item = {
      id,
      quantity,
    };

    return item;
  });
};

export const parseItemTabs = (unparsedTabs: StateMessageItem[][] | null): Item[][] | null => {

  if (unparsedTabs === null) {
    return null;
  }

  return map(unparsedTabs, (unparsedTab: StateMessageItem[]): Item[] => {
    return parseItems(unparsedTab) ?? [];
  });
};

// map a state message to actions that are only
// triggered when the key is found which will allow us
// to in the future send out dedicated events for for example a full bank
const stateToActionEntries: StateToActionEntry[] = [{
  key: 'inventory',
  action: setInventory,
},{
  key: 'playerName',
  action: setPlayer,
}, {
  key: 'topPosition',
  action: setOverlay,
}];

export const handleStateMessage = (rawContent: StateMessage | string): void => {
  let content: StateMessage = {};

  logger.info(`Updating to new global state...`);

  // Guard: check if the content is valid.
  if (isEmpty(rawContent)) {
    logger.error(`Invalid content received for the global state!`);
    return;
  }

  // Parse the content when it is compressed
  // it is possible to receive an object from tests.
  if (isString(rawContent)) {
    content = parseContent(rawContent);
  } else {
    content = rawContent;
  }

  logger.info(`Valid content received for the global state:`);
  console.info(content);
  // console.log(rawContent);

  // Always store the latest content to allow
  // for an instant update when the UI is unpaused
  store.dispatch(setContent(content));

  map(stateToActionEntries, (stateToActionEntry) => {
    const { key, action } = stateToActionEntry;

    if (content?.[key] === undefined) {
      return;
    }

    store.dispatch(action(content));
  });
};

export default store;
