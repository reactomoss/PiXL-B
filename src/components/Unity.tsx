import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Unity, useUnityContext } from 'react-unity-webgl';
import toast, { Toaster } from 'react-hot-toast';
import Lang from 'lang/en';
import { ItemType } from 'types';
import EntryCoin from './EntryCoin';
import Inventory from './Inventory';
import './Unity.css';
import useWallet from 'hooks/useWallet';
import * as service from 'services';
import usePixltez from 'hooks/usePixltez';
import useGame from 'hooks/useGame';
import { Contracts } from 'config';
import { getContract } from 'services/tzstats';
import {
  loadEntryCoinAction,
  setEntryCoinAction,
  setGameStartedAction,
  addGameItemsAction,
  setInventoryFullAction,
} from 'redux/action';

const unityConfig = {
  loaderUrl: 'Build/1.loader.js',
  dataUrl: 'Build/1.data.unityweb',
  frameworkUrl: 'Build/1.framework.js.unityweb',
  codeUrl: 'Build/1.wasm.unityweb',
};

const UnityComponent = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: any) => state.gameState);
  const contract = useSelector((state: any) => state.contractState.contract);
  const [running, setRunning] = useState(false);
  const { walletAddress } = useWallet();
  const { findEntryCoin } = usePixltez();
  const { mintItem, getWalletItems } = useGame();
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    requestFullscreen,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext(unityConfig);

  const unity = useMemo(() => {
    return {
      sendMessage,
      addEventListener,
    }
  }, [sendMessage, addEventListener])

  document.onfullscreenchange = function (event) {
    requestFullscreen(false);
  };

  const sendGameController = (methodName: string, parameter?: any) => {
    sendMessage('GameController', methodName, parameter);
  };

  const sendError = (parameter?: any) => {
    sendGameController('SendError', parameter);
  };

  useEffect(() => {
    sendMessage('AccessController', 'WalletConnected', walletAddress || '');
  }, [walletAddress, sendMessage]);

  const handleGameStarted = () => {
    dispatch(setGameStartedAction(true));
    loadInventoryItems();
  };

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

  const handleMintItem = async (itemName: string) => {
    console.log('MintThis:', itemName);
    if (!walletAddress) {
      toast.error(Lang.connectYourWallet);
      return;
    }
    if (!itemName) {
      console.error('Invalid item name');
      return;
    }

    try {
      const tokenId = await service.getTokenId(itemName);
      if (!tokenId) {
        throw new Error('Failed to get token ID from server');
      }

      const transaction = await mintItem(tokenId, itemName);
      console.log('mintItem', transaction);
      if (!transaction) {
        throw new Error('Failed to mint item');
      }

      await service.updateMintResult(walletAddress as string, itemName);

      const mintedItem = {
        name: itemName,
        imageSrc: '/whitney-with-microphone.png',
        alt: 'Game Item',
      } as ItemType;
      dispatch(addGameItemsAction([mintedItem]));

      sendGameController('ItemMinted', itemName);
      toast.success(`Item ${itemName} has been successfully minted`);
    }
    catch (error) {
      console.error(error);
      sendError('Failed to mint item');
      toast.error(`Failed to mint item ${itemName}`);
    }
  };

  const handleMintPiXLtez = async (amount: number) => {
    console.log('MintPiXLtez', amount);
    if (!walletAddress) {
      toast.error(Lang.connectYourWallet);
      return;
    }
    try {
      const result = await service.mintPixltez(walletAddress, amount);
      if (!result) {
        throw new Error('Server Error');
      }
      
      sendGameController('PiXLtezMinted', amount);
      toast.success(Lang.pixltezMinted);
    }
    catch (err) {
      console.error(err);
      sendError(Lang.pixltezMintFailed);
      toast.error(Lang.pixltezMintFailed);
    }
  };

  const handleShareQuest = async (questDetails, Id) => {
    const result = await service.shareQuest(questDetails, Id).catch((error) => {
      toast.error("Server Didn't Respond, contact the admin");
    });
    if (result) {
      alert('Quest has been shared');
    }
  };

  const handleQuestCompleted = async function (questId: number) {
    console.log('OnQuestCompleted:', questId);
    if (!walletAddress) {
      toast.error(Lang.connectYourWallet);
      return;
    }
    if (running) {
      return;
    }
    try {
      setRunning(true);

      const result = await service.updateQuestStatus(
        questId,
        walletAddress,
        'COMPLETED'
      );
      if (!result || !result.data) {
        throw new Error('Server Error');
      }
      toast.success(`Quest ${questId} has been updated succesfully`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update quest state');
    } finally {
      setRunning(false);
    }
  };

  const handleGotItem = (itemId: number) => {
    /*console.log('OnGotItem', itemId);
    const items = gameItems.filter((item) => item.alt !== itemId.toString());
    dispatch(addGameItemsAction(items));
    dispatch(setInventoryFullAction(false));
    toast.success('Item has been added your inventory');*/
  };

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

  useEffect(() => {
    addEventListener('GameOver', handleGameOver);
    addEventListener('MintThis', handleMintItem);
    addEventListener('MintPiXLtez', handleMintPiXLtez);
    addEventListener('ShareQuest', handleShareQuest);
    addEventListener('QuestCompleted', handleQuestCompleted);
    addEventListener('GotItem', handleGotItem);
    addEventListener('InventoryFull', handleInventoryFull);
    addEventListener('RequestItem', handleRequestItem);
    addEventListener('GameStarted', handleGameStarted);

    return () => {
      removeEventListener('GameOver', handleGameOver);
      removeEventListener('MintThis', handleMintItem);
      removeEventListener('MintPiXLtez', handleMintPiXLtez);
      removeEventListener('ShareQuest', handleShareQuest);
      removeEventListener('QuestCompleted', handleQuestCompleted);
      removeEventListener('GotItem', handleGotItem);
      removeEventListener('InventoryFull', handleInventoryFull);
      removeEventListener('RequestItem', handleRequestItem);
      removeEventListener('GameStarted', handleGameStarted);
    }
  })

  const loadInventoryItems = async () => {
    try {
      dispatch(loadEntryCoinAction(true));

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
      dispatch(loadEntryCoinAction(false));
    }
  }

  useEffect(() => {
    console.log('getInitialCoins')
    const getInitialCoins = async () => {
      try {
        dispatch(loadEntryCoinAction(true));
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
        dispatch(loadEntryCoinAction(false));
      }
    };
    walletAddress && getInitialCoins();

    /*if (walletAddress) {
      const gameItems = [
        {
            "name": "Health Potion",
            "imageSrc": "https://cloudflare-ipfs.com/ipfs/QmNNtaYpP1N8tPdJCiDSCnzx8n8yEd8Qm6rx7vYwFji2qy",
            "alt": "0",
            "unityCardIdentifier": 1
        }
      ];
      dispatch(setGameItemsAction(gameItems));
    }*/
  }, [dispatch, walletAddress, findEntryCoin]);

  const loadingPercentage = Math.round(loadingProgression * 100);

  return (
    <>
      <div className="unity-container">
        <Toaster />
        <Unity
          unityProvider={unityProvider}
          style={{
            height: 540,
            width: 950,
            background: '#555',
          }}
        />
        {isLoaded === false && (
          <div className="loading-overlay">
            <p>Loading... ({loadingPercentage}%)</p>
          </div>
        )}
      </div>

      {isLoaded && (
        <div className="item-container">
          {!gameState.gameStarted && 
            <EntryCoin unity={unity}></EntryCoin>
          }
          {gameState.gameStarted && 
            <Inventory unity={unity}></Inventory>
          }
        </div>
      )}
    </>
  );
};

export default UnityComponent;
