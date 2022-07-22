import { call, put, takeEvery } from 'redux-saga/effects'
import * as ApiConstants from '../api';
import * as tzstats from '../../services/tzstats';
import { Contracts } from 'config';

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

function* getEntryCoinsSaga(action) {
  try {
    const { contracts, walletAddress } = action.payload;
    const contract = contracts.find(c => c.contract.address === Contracts.Pixltez);
    if (!contract) {
      throw new Error('Can not find PiXLtez contract');
    }
    const ledgerKey = contract.ledgerKeys.find(it => it.key[0] === walletAddress && it.key[1] === '0');
    if (!ledgerKey) {
      throw new Error('Can not find ledger key');
    }
    const bigmapId = contract.contract.bigmaps.ledger;
    const result = yield call(tzstats.getBigmapValue, bigmapId, ledgerKey.hash);
    if (result.status === 200) {
      yield put({
        type: ApiConstants.API_GET_ENTRY_COINS_SUCCESS,
        payload: result.data,
      });
    } else {
      throw new Error('Failed to get entry coins');
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_GET_ENTRY_COINS_ERROR,
      error: error,
    });
  }
}

function* getGameItemsSaga(action) {
  try {
    // const result = yield call(tzstats.getBigmapValue, action.payload);
    // if (result.status === 200) {
    //   yield put({
    //     type: ApiConstants.API_GET_GAME_ITEMS_SUCCESS,
    //     payload: result.data,
    //   });
    // } else {
    //   throw new Error('Failed to get game items');
    // }
  } catch (error) {
    yield put({
      type: ApiConstants.API_GET_GAME_ITEMS_ERROR,
      error: error,
    });
  }
}

export default function* tezosSaga() {
  yield takeEvery(ApiConstants.API_GET_CONTRACT_LOAD, getContractSaga);
  yield takeEvery(ApiConstants.API_GET_ENTRY_COINS_LOAD, getEntryCoinsSaga);
  yield takeEvery(ApiConstants.API_GET_GAME_ITEMS_LOAD, getGameItemsSaga);
}
