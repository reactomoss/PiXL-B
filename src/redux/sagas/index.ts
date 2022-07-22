import { all, fork } from 'redux-saga/effects';
import tezosSaga from './tezosSaga';

export default function* rootSaga() {
  yield all([
    fork(tezosSaga),
  ])
}
