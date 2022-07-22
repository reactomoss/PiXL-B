import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './reducers/game';
import contractReducer from './reducers/contract';

export default configureStore({
  reducer: {
    gameState: gameReducer,
    contractState: contractReducer,
  },
})
