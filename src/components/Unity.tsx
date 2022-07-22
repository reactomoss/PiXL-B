import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Unity, useUnityContext } from 'react-unity-webgl';
import toast, { Toaster } from 'react-hot-toast';
import Lang from 'lang/en';
import EntryCoin from './EntryCoin';
import Inventory from './Inventory';
import './Unity.css';
import useWallet from 'hooks/useWallet';
import usePixltez from 'hooks/usePixltez';
import {
  setLoadingStateAction,
  setEntryCoinAction,
} from 'redux/actions';
import useUnityGame from 'hooks/useUnityGame';

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
  const { walletAddress } = useWallet();
  const { findEntryCoin } = usePixltez();
  const unityContext = useUnityContext(unityConfig);
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    requestFullscreen,
    sendMessage,
    addEventListener,
  } = unityContext;
  useUnityGame(unityContext);

  const unity = useMemo(() => {
    return {
      sendMessage,
      addEventListener,
    }
  }, [sendMessage, addEventListener])

  document.onfullscreenchange = function (event) {
    requestFullscreen(false);
  };

  useEffect(() => {
    sendMessage('AccessController', 'WalletConnected', walletAddress || '');
  }, [walletAddress, sendMessage]);

  useEffect(() => {
    console.log('getInitialCoins')
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
            <EntryCoin sendMessage={sendMessage}></EntryCoin>
          }
          {gameState.gameStarted && 
            <Inventory sendMessage={sendMessage}></Inventory>
          }
        </div>
      )}
    </>
  );
};

export default UnityComponent;
