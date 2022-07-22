import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IUnityContextHook } from 'react-unity-webgl/distribution/interfaces/unity-context-hook';
import toast from 'react-hot-toast';
import * as service from 'services';
import { ItemType } from 'types';
import Lang from 'lang/en';
import useGameContract from 'hooks/useGameContract';
import {
  setLoadingStateAction,
  setGameStartedAction,
  addGameItemsAction,
} from 'redux/actions';

const useUnityGame = (unityContext: IUnityContextHook) => {
  const dispatch = useDispatch();
  const { getWalletTokens } = useGameContract();
  const { addEventListener, removeEventListener } = unityContext;

  const handleGameOver = async (userName, score) => {
    try {
      const result = await service.setGraveyardEntry(userName, score);
      if (result) {
        toast.success(Lang.deathToGraveyard);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGameStarted = () => {
    dispatch(setGameStartedAction(true));
    loadInventoryItems();
  };

  const loadInventoryItems = async () => {
    try {
      dispatch(setLoadingStateAction(true));

      const item = await getWalletTokens(0);
      console.log('loadInventoryItems', item);
      if (item) {
        const { metadata } = item;
        const gameItem = {
          name: item.metadata.name as string,
          imageSrc: service.createImageSrc(metadata.displayUri) as string,
          alt: `${metadata.token_id.toString()}`,
          unityCardIdentifier: service.findUnityCardIdentifier(
            metadata.token_id
          ),
        } as ItemType;
        dispatch(addGameItemsAction([gameItem]));
      }
    } catch (error) {
      console.error(error);
      toast.error(Lang.noEntryCoinFound);
    } finally {
      dispatch(setLoadingStateAction(false));
    }
  };

  useEffect(() => {
    addEventListener('GameStarted', handleGameStarted);
    addEventListener('GameOver', handleGameOver);

    return () => {
      removeEventListener('GameStarted', handleGameStarted);
      removeEventListener('GameOver', handleGameOver);
    };
  });
};

export default useUnityGame;
