import * as ApiConstants from '../api';

export const getContractAction = (address: string) => ({
  type: ApiConstants.API_GET_CONTRACT_LOAD,
  payload: address,
});
