import * as ApiConstants from '../api';

const initialState = {
  loading: false,
  contracts: [] as any[],
  gameStarted: false,
  entryCoinLoaded: false,
  entryCoins: null,
  gameItemsLoaded: false,
  gameItems: [] as any[],
  inventoryFull: false,
  useItemState: false,
};

const gameReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ApiConstants.API_GET_CONTRACT_LOAD: {
      return {
        ...state,
        loading: true,
      };
    }
    case ApiConstants.API_GET_CONTRACT_SUCCESS: {
      const contracts = [...state.contracts];
      const index = contracts.findIndex((c: any) => c.address === action.payload.address);
      if (index >= 0) {
        contracts.splice(index, 1);
      }
      contracts.push(action.payload);
      return {
        ...state,
        loading: false,
        contracts
      };
    }
    case ApiConstants.API_GET_CONTRACT_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    }
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
    case ApiConstants.API_SET_USE_ITEM_STATE: {
      return {
        ...state,
        useItemState: action.payload,
      };
    }
    case ApiConstants.API_GET_ENTRY_COINS_LOAD: {
      return {
        ...state,
        loading: true,
      }
    }
    case ApiConstants.API_GET_ENTRY_COINS_SUCCESS: {
      const { entrycoin } = action.payload;
      console.log('entrycoin', entrycoin)
      return {
        ...state,
        loading: false,
        entryCoinLoaded: true, 
        entryCoins: Number(entrycoin.value),
      }
    }
    case ApiConstants.API_GET_GAME_ITEMS_LOAD: {
      return {
        ...state,
        loading: true,
      }
    }
    case ApiConstants.API_GET_GAME_ITEMS_SUCCESS: {
      const { tokenId, amount } = action.payload;
      const gameItems = [...state.gameItems];
      const item = gameItems.find((i: any) => i.tokenId === tokenId);
      if (item) {
        item.amount = amount;
      } else {
        gameItems.push(action.payload);
      }
      console.log('gameItems', action.payload, gameItems)
      return {
        ...state,
        loading: false,
        gameItemsLoaded: true,
        gameItems,
      }
    }
    default: {
      return state;
    }
  }
};

export default gameReducer;
