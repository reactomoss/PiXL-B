import { call, put, takeEvery } from 'redux-saga/effects';
import * as ApiConstants from '../api';
import * as tzstats from '../../services/tzstats';
import { GameTokens } from 'config';

function* getContractSaga(action) {
  try {
    const result = yield call(tzstats.getContract, action.payload);
    if (result.status !== 200) {
      throw new Error('Failed to get contract data');
    }
    const contract = result.data;
    yield put({
      type: ApiConstants.API_GET_CONTRACT_SUCCESS,
      payload: {
        address: contract.address,
        bigmaps: contract.bigmaps,
      },
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
    const { contract, walletAddress, tokenId } = action.payload;
    const ledger = contract.bigmaps.ledger;
    const key = `${walletAddress},${tokenId}`;

    const result = yield call(tzstats.getBigmapValue, ledger, key);
    if (result.status !== 200) {
      throw new Error('Failed to get contract data');
    }
    yield put({
      type: ApiConstants.API_GET_ENTRY_COINS_SUCCESS,
      payload: {
        address: contract.address,
        entrycoin: result.data,
      }
    });
  } catch (error) {
    yield put({
      type: ApiConstants.API_GET_ENTRY_COINS_ERROR,
      error: error,
    });
  }
}

function* getGameItemsSaga(action) {
  try {
    const { contract, walletAddress } = action.payload;
    const item = contract.ledger.find((it) => 
      it.key['0'] === walletAddress &&
      it.key['1'] === '' + GameTokens.HealthPotion
    );
    console.log('Health Potions', item)
    yield put({
      type: ApiConstants.API_GET_GAME_ITEMS_SUCCESS,
      payload: {
        tokenId: GameTokens.HealthPotion,
        amount: Number(item.value),
      },
    });
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
