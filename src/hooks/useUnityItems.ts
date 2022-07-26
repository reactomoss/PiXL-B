import { useDispatch, useSelector } from 'react-redux';
import { ItemType } from 'types';
import * as service from 'services';
import * as notification from 'services/notification';
import Lang from 'lang/en';
import useGameContract from 'hooks/useGameContract';
import {
  addGameItemsAction,
  setInventoryFullAction,
  setUseItemStateAction,
} from 'redux/actions';
import useWallet from './useWallet';
import { useCallback } from 'react';

const useUnityItems = (sendMessage: any) => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: any) => state.gameState);
  const { walletAddress } = useWallet();
  const { mintToken, getPixltezBalance } = useGameContract();
  const { useItemState } = gameState;

  const sendGameController = (methodName: string, parameter?: any) => {
    sendMessage('GameController', methodName, parameter);
  };

  const handleMintItem = async (itemName: string) => {
    console.log('MintThis:', itemName, walletAddress);
    if (!walletAddress) {
      notification.error('MintItem', 'PiXL', Lang.connectYourWallet);
      return;
    }
    if (!itemName) {
      console.error('Invalid item name');
      return;
    }

    try {
      const transaction = await mintToken(0);
      console.log('mintItem.transaction', transaction);
      if (!transaction) {
        throw new Error('Failed to mint item');
      }

      await service.updateMintResult(walletAddress as string, itemName);

      const mintedItem = {
        name: itemName,
        imageSrc: '/whitney-with-microphone.png',
        alt: 'Health Potion',
      } as ItemType;
      dispatch(addGameItemsAction([mintedItem]));

      sendGameController('ItemMinted', itemName);
      notification.info('MintItem', 'PiXL', `Item ${itemName} has been successfully minted`);
    
    } catch (error) {
      console.error(error);
      sendGameController('SendError', 'Failed to mint item');
      notification.error('MintItem', 'PiXL', `Failed to mint item ${itemName}`);
    }
  };

  const handleMintPiXLtez = async (amount: number) => {
    console.log('MintPiXLtez', amount);
    if (!walletAddress) {
      notification.error('MintItem', 'PiXL', Lang.connectYourWallet);
      return;
    }
    try {
      const result = await service.mintPixltez(walletAddress, amount);
      if (!result) {
        throw new Error('Server Error');
      }

      sendGameController('PiXLtezMinted', amount);

      const balance = await getPixltezBalance();
      sendGameController('UpdatePiXLTez', balance);

      notification.info('MintPixltez', 'PiXL', Lang.pixltezMinted);
    } catch (err) {
      console.error(err);
      sendGameController('SendError', Lang.pixltezMintFailed);
      notification.error('MintItem', 'PiXL', Lang.pixltezMintFailed);
    }
  };

  const handleItemAdded = useCallback((itemName: string) => {
    console.log('ItemAdded', itemName, useItemState);
    if (useItemState) {
      dispatch(setUseItemStateAction(false));
      notification.info('ItemAdded', 'PiXL', `${itemName} Added to Game`);
    }

    /*console.log('OnGotItem', itemId);
    const items = gameItems.filter((item) => item.alt !== itemId.toString());
    dispatch(addGameItemsAction(items));
    dispatch(setInventoryFullAction(false));
    toast.success('Item has been added your inventory');*/
  }, [dispatch, useItemState]);

  const handleInventoryFull = () => {
    dispatch(setInventoryFullAction(true));
    //service.reInsertCard(sentItemId); //TODO
  };

  const handleRequestItem = async (item: string) => {
    /*console.log('OnRequestItem', item);
    if (tezos && walletAddress) {
      toast.success('Looking for Beets Entry Token');

      const result = await getRequestedItem(tezos, walletAddress, item);
      if (result) {
        sendGameController('ActivateEvent', 'Has Beets Token');
      }
      toast.success('Beets Entry token found click on the token to enter');

      setGameItems([
        {
          alt: Lang.entryCoinAlt,
          imageSrc:
            'https://cloudflare-ipfs.com/ipfs/QmeHk5t7csY793KM9sRiWwsGENhzhf5jJoiZrjweSw2AQB',
          name: Lang.entryCoinName,
          id: 1,
        },
      ]);
    }*/
  };
  
  return {
    handleMintItem,
    handleMintPiXLtez,
    handleItemAdded,
    handleInventoryFull,
    handleRequestItem,
  }
};

export default useUnityItems;
