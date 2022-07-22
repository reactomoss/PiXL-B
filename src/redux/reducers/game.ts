import * as ApiConstants from '../api';

const initialState = {
  loading: false,
  gameStarted: false,
  entryCoins: [],
  gameItems: [],
  inventoryFull: false,
};

const gameReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ApiConstants.API_SET_LOADING_STATE: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case ApiConstants.API_SET_ENTRY_COINS: {
      return {
        ...state,
        entryCoins: action.payload,
      };
    }
    case ApiConstants.API_SET_GAME_STARTED: {
      return {
        ...state,
        gameStarted: action.payload,
      };
    }
    case ApiConstants.API_SET_GAME_ITEMS: {
      return {
        ...state,
        gameItems: action.payload,
      };
    }
    case ApiConstants.API_ADD_GAME_ITEMS: {
      return {
        ...state,
        gameItems: [...state.gameItems, ...action.payload],
      };
    }
    case ApiConstants.API_SET_INVENTORY_FULL: {
      return {
        ...state,
        inventoryFull: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default gameReducer;
