import * as ApiConstants from '../api';

const initialState = {
  loading: false,
  contracts: [] as any[],
  error: null,
};

const contractReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ApiConstants.API_GET_CONTRACT_LOAD: {
      return {
        ...state,
        loading: true,
      };
    }
    case ApiConstants.API_GET_CONTRACT_SUCCESS: {
      const contracts = [...state.contracts];
      const index = contracts.findIndex(c => c.address === action.payload.address);
      if (index >= 0) {
        contracts.splice(index, 1);
      }
      contracts.push(action.payload);
      console.log('contracts', contracts)
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
    default: {
      return state;
    }
  }
};

export default contractReducer;
