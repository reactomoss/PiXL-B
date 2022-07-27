import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Lang from 'lang/en';
import useWallet from './useWallet';
import { getGameItemsAction, setGameStartedAction } from 'redux/actions';
import * as service from 'services';
import { Contracts } from 'config';

const useUnityGame = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: any) => state.gameState);
  const { walletAddress } = useWallet();

  const handleGameStarted = useCallback(() => {
    console.log('Game Started')
    dispatch(setGameStartedAction(true));
    
    // Get inventory items.
    if (walletAddress) {
      const { contracts } = gameState;
      const contract = contracts.find(c => c.contract.address === Contracts.PixlGame);
      if (contract) {
        dispatch(getGameItemsAction(contract, walletAddress));
      }
    }
  }, [dispatch, walletAddress, gameState]);
  
  const handleGameOver = async (userName, score) => {
    console.log('Game Over')
    try {
      const result = await service.setGraveyardEntry(userName, score);
      if (result) {
        toast.success(Lang.deathToGraveyard);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleGameStarted,
    handleGameOver,
  }
};

export default useUnityGame;
