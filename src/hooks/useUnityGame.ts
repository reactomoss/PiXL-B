import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Lang from 'lang/en';
import { setGameStartedAction } from 'redux/actions';
import * as service from 'services';

const useUnityGame = () => {
  const dispatch = useDispatch();

  const handleGameStarted = useCallback(() => {
    console.log('Game Started')
    dispatch(setGameStartedAction(true));
  }, [dispatch]);
  
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
