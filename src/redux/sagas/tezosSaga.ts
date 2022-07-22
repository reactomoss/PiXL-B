import { call, put, takeEvery } from 'redux-saga/effects'
import * as ApiConstants from '../api';
import * as tzstats from '../../services/tzstats';

function* getContractSaga(action) {
  try {
    const result = yield call(tzstats.getContract, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_CONTRACT_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      throw new Error('Failed to get contract data');
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_GET_CONTRACT_ERROR,
      error: error,
    });
  }
}

export default function* tezosSaga() {
  yield takeEvery(ApiConstants.API_GET_CONTRACT_LOAD, getContractSaga);
}
