import * as ApiConstants from '../api';

export const getGameContractAction = (address: string) => ({
  type: ApiConstants.API_GET_CONTRACT_LOAD,
  payload: address,
});
