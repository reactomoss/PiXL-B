import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Toaster } from 'react-hot-toast';
import { Contracts } from 'config';
import EntryCoin from './EntryCoin';
import Inventory from './Inventory';
import './Unity.css';
import useWallet from 'hooks/useWallet';
import useUnityGame from 'hooks/useUnityGame';
import { getGameContractAction } from 'redux/actions';

const unityConfig = {
  loaderUrl: 'Build/1.loader.js',
  dataUrl: 'Build/1.data.unityweb',
  frameworkUrl: 'Build/1.framework.js.unityweb',
  codeUrl: 'Build/1.wasm.unityweb',
};

const UnityComponent = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: any) => state.gameState);
  const contracts = useSelector((state: any) => state.contractState.contracts);
  const { walletAddress } = useWallet();
  const unityContext = useUnityContext(unityConfig);
  const { getInitialCoins } = useUnityGame(unityContext);
  const loadingPercentage = Math.round(unityContext.loadingProgression * 100);

  document.onfullscreenchange = function (event) {
    unityContext.requestFullscreen(false);
  };

  useEffect(() => {
    unityContext.sendMessage('AccessController', 'WalletConnected', walletAddress || '');
  }, [walletAddress, unityContext]);

  useEffect(() => {
    walletAddress && getInitialCoins();
  }, [dispatch, walletAddress, getInitialCoins]);

  useEffect(() => {
    [Contracts.PixlGame, Contracts.Pixltez].forEach(address => {
      if (!contracts.find(c => c.address === address)) {
        dispatch(getGameContractAction(address))
      }
    });
  }, [dispatch, contracts])

  return (
    <>
      <div className="unity-container">
        <Toaster />
        <Unity
          unityProvider={unityContext.unityProvider}
          style={{
            height: 540,
            width: 950,
            background: '#555',
          }}
        />
        {unityContext.isLoaded === false && (
          <div className="loading-overlay">
            <p>Loading... ({loadingPercentage}%)</p>
          </div>
        )}
      </div>

      {unityContext.isLoaded && (
        <div className="item-container">
          {!gameState.gameStarted && (
            <EntryCoin sendMessage={unityContext.sendMessage}></EntryCoin>
          )}
          {gameState.gameStarted && (
            <Inventory sendMessage={unityContext.sendMessage}></Inventory>
          )}
        </div>
      )}
    </>
  );
};

export default UnityComponent;
