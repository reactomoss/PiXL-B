import { call, put, takeEvery } from 'redux-saga/effects';
import * as ApiConstants from '../api';
import * as tzstats from '../../services/tzstats';
import { GameTokens, PixlTokens } from 'config';

function* getContractSaga(action) {
  try {
    const result = yield call(tzstats.getContract, action.payload);
    if (result.status !== 200) {
      throw new Error('Failed to get contract data');
    }

    const contract = result.data;
    const ledger = yield call(
      tzstats.getBigmapValues,
      contract.bigmaps.ledger
    );    
    if (ledger.status !== 200) {
      throw new Error('Failed to get ledger keys');
    }

    const token_metadata = yield call(
      tzstats.getBigmapValues,
      contract.bigmaps.token_metadata
    );    
    if (token_metadata.status !== 200) {
      throw new Error('Failed to get token metadata keys');
    }

    yield put({
      type: ApiConstants.API_GET_CONTRACT_SUCCESS,
      payload: {
        contract: result.data,
        ledger: ledger.data,
        token_metadata: token_metadata.data,
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
    const { contract, walletAddress } = action.payload;
    const item = contract.ledger.find(
      (it) =>
        it.key[0] === walletAddress &&
        it.key[1] === PixlTokens.InitCoin.toString()
    );
    if (!item) {
      throw new Error('Can not find ledger key');
    }
    yield put({
      type: ApiConstants.API_GET_ENTRY_COINS_SUCCESS,
      payload: item,
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
    const items = contract.ledger.filter((it) => it.value === walletAddress);
    if (!items) {
      throw new Error('Can not find tokens');
    }
    const healthPotions = items.filter(item => {
      const metadata = contract.token_metadata.find(m => m.key === item.key);
      return (metadata && metadata.value['1']['symbol'] === GameTokens.HealthPotion);
    })
    yield put({
      type: ApiConstants.API_GET_GAME_ITEMS_SUCCESS,
      payload: {
        tokenId: GameTokens.HealthPotion,
        amount: healthPotions.length,
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
