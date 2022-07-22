import { CA_SET_CONTRACT_DATA } from '../action';

const initialState = {
  loadingStatus: false,
  contract: null,
  bigmaps: null,
};

const contractReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CA_SET_CONTRACT_DATA: {
      const contract = action.payload;
      return {
        ...state,
        contract,
        bigmaps: contract.bigmaps,
      };
    }
    default: {
      return state;
    }
  }
};

export default contractReducer;
