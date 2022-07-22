import * as ApiConstants from '../api';

const initialState = {
  loading: false,
  contract: null,
  bigmaps: null,
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
      const contract = action.payload;
      return {
        ...state,
        loading: false,
        contract,
        bigmaps: contract.bigmaps,
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
