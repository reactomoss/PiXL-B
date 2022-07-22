import * as ApiConstants from '../api';

const initialState = {
  loading: false,
  gameStarted: false,
  entryCoins: null,
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
    case ApiConstants.API_GET_ENTRY_COINS_LOAD: {
      return {
        ...state,
        loading: true,
      }
    }
    case ApiConstants.API_GET_ENTRY_COINS_SUCCESS: {
      console.log('entryCoins', action.payload)
      return {
        ...state,
        loading: false,
        entryCoins: Number(action.payload.value),
      }
    }
    case ApiConstants.API_GET_GAME_ITEMS_LOAD: {
      return {
        ...state,
        loading: true,
      }
    }
    case ApiConstants.API_GET_GAME_ITEMS_SUCCESS: {
      console.log('gameItems', action.payload)
      return {
        ...state,
        loading: false,
      }
    }
    default: {
      return state;
    }
  }
};

export default gameReducer;
