import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IUnityContextHook } from 'react-unity-webgl/distribution/interfaces/unity-context-hook';
import { ItemType } from 'types';
import toast from 'react-hot-toast';
import * as service from 'services';
import Lang from 'lang/en';
import useGameContract from './useGameContract';
import usePixltez from './usePixltez';
import {
  setLoadingStateAction,
  setGameStartedAction,
  addGameItemsAction,
  setEntryCoinAction,
} from 'redux/actions';

const useUnityGame = (unityContext: IUnityContextHook) => {
  const dispatch = useDispatch();
  const { getWalletTokens } = useGameContract();
  const { findEntryCoin } = usePixltez();
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

  const getInitialCoins = async () => {
    try {
      dispatch(setLoadingStateAction(true));
      if (await findEntryCoin()) {
        const coins = [
          {
            id: 0,
            name: Lang.entryCoinName,
            alt: Lang.entryCoinAlt,
            imageSrc:
              'https://cloudflare-ipfs.com/ipfs/QmPTFsFgEYfS3VV9uaTWfWUQGVqbaHa1t2npBUQZ4NiAvP',
          },
        ];
        dispatch(setEntryCoinAction(coins));
      }
    } catch (error) {
      console.error(error);
      toast.error(Lang.noEntryCoinFound);
    } finally {
      dispatch(setLoadingStateAction(false));
    }
  };

  return {
    getInitialCoins,
  }
};

export default useUnityGame;
