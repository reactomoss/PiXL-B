import * as ApiConstants from '../api';

export const setLoadingStateAction = (status) => ({
  type: ApiConstants.API_SET_LOADING_STATE,
  payload: status,
});

export const getEntryCoinsAction = (contracts: any, walletAddress: string) => ({
  type: ApiConstants.API_GET_ENTRY_COINS_LOAD,
  payload: { contracts, walletAddress },
});

export const getGameItemsAction = (id: string, key: string) => ({
  type: ApiConstants.API_GET_GAME_ITEMS_LOAD,
  payload: { id, key },
});

export const setEntryCoinsAction = (coins) => ({
  type: ApiConstants.API_SET_ENTRY_COINS,
  payload: coins,
});

export const setGameStartedAction = (started) => ({
  type: ApiConstants.API_SET_GAME_STARTED,
  payload: started,
});

export const setGameItemsAction = (items) => ({
  type: ApiConstants.API_SET_GAME_ITEMS,
  payload: items,
});

export const addGameItemsAction = (items) => ({
  type: ApiConstants.API_ADD_GAME_ITEMS,
  payload: items,
});

export const setInventoryFullAction = (isInventoryFull: boolean) => ({
  type: ApiConstants.API_SET_INVENTORY_FULL,
  payload: isInventoryFull,
});