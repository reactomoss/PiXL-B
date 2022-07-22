import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IUnityContextHook } from 'react-unity-webgl/distribution/interfaces/unity-context-hook';
import toast from 'react-hot-toast';
import * as service from 'services';
import {
  getEntryCoinAction,
  setEntryCoinAction,
  setGameStartedAction,
  addGameItemsAction,
  setInventoryFullAction,
} from 'redux/actions';

const useUnityGame = (unityContext: IUnityContextHook) => {
  const dispatch = useDispatch();
  const {
    sendMessage,
    addEventListener,
    removeEventListener,
  } = unityContext;

  const handleGameOver = async (userName, score) => {
    try {
      const result = await service.setGraveyardEntry(userName, score);
      if (result) {
        toast.success('Your death has been added to The Graveyard');
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
      dispatch(getEntryCoinAction(true));

      const item = await getWalletItems(0);
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
      dispatch(getEntryCoinAction(false));
    }
  }

  useEffect(() => {
    addEventListener('GameOver', handleGameOver);
    addEventListener('GameStarted', handleGameStarted);

    return () => {
      removeEventListener('GameOver', handleGameOver);
      removeEventListener('GameStarted', handleGameStarted);
    }
  })
};

export default useUnityGame;