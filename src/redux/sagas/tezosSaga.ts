import { call, put, takeEvery } from 'redux-saga/effects'
import * as ApiConstants from '../api';
import * as tzstats from '../../services/tzstats';

function* getContractSaga(action) {
  try {
    const result = yield call(tzstats.getContract, action.payload);
    if (result.status !== 200) {
      throw new Error('Failed to get contract data');
    }

    const contract = result.data;
    const ledgerKeys = yield call(tzstats.getBigmapKeys, contract.bigmaps.ledger);
    if (ledgerKeys.status !== 200) {
      throw new Error('Failed to get contract data');
    }

    yield put({
      type: ApiConstants.API_GET_CONTRACT_SUCCESS,
      payload: {
        contract: result.data,
        ledgerKeys: ledgerKeys.data,
      }
    });
  } catch (error) {
    yield put({
      type: ApiConstants.API_GET_CONTRACT_ERROR,
      error: error,
    });
  }
}

function* getBigmapValuesSaga(action) {
  try {
    const result = yield call(tzstats.getBigmapValue, action.payload);
    if (result.status === 200) {
      yield put({
        type: ApiConstants.API_GET_ENTRY_COINS_SUCCESS,
        payload: result.data,
      });
    } else {
      throw new Error('Failed to get contract data');
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_GET_ENTRY_COINS_ERROR,
      error: error,
    });
  }
}

export default function* tezosSaga() {
  yield takeEvery(ApiConstants.API_GET_CONTRACT_LOAD, getContractSaga);
  yield takeEvery(ApiConstants.API_GET_ENTRY_COINS_LOAD, getBigmapValuesSaga);
}
