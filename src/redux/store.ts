import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import gameReducer from './reducers/game';
import saga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

export default configureStore({
  reducer: {
    gameState: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

// then run the saga
sagaMiddleware.run(saga)
