import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Unity, useUnityContext } from 'react-unity-webgl';
import toast, { Toaster } from 'react-hot-toast';
import * as service from 'services';
import { Contracts } from 'config';
import Lang from 'lang/en';
import EntryCoin from './EntryCoin';
import Inventory from './Inventory';
import './Unity.css';
import useWallet from 'hooks/useWallet';
import { getGameContractAction, getEntryCoinsAction, setGameStartedAction, getGameItemsAction } from 'redux/actions';

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
  const loadingPercentage = Math.round(unityContext.loadingProgression * 100);

  document.onfullscreenchange = function (event) {
    unityContext.requestFullscreen(false);
  };

  useEffect(() => {
    unityContext.sendMessage('AccessController', 'WalletConnected', walletAddress || '');
  }, [walletAddress, unityContext]);

  useEffect(() => {
    [Contracts.PixlGame, Contracts.Pixltez].forEach(address => {
      if (!contracts.find(c => c.contract.address === address)) {
        dispatch(getGameContractAction(address))
      }
    });
  }, [dispatch, contracts])

  useEffect(() => {
    if (walletAddress && !gameState.entryCoins) {
      const contract = contracts.find(c => c.contract.address === Contracts.Pixltez);
      if (contract) {
        dispatch(getEntryCoinsAction(contracts, walletAddress));
      }
    }
  }, [dispatch, walletAddress, contracts, gameState.entryCoins]);

  const handleGameStarted = () => {
    console.log('handleGameStarted')
    dispatch(setGameStartedAction(true));
    
    const contract = contracts.find(c => c.contract.address === Contracts.PixlGame);
    if (contract) {
      const ledgerKey = contract.ledgerKeys.find(it => it.key[0] === walletAddress && it.key[1] === '0');
      if (ledgerKey) {
        const bigmapId = contract.contract.bigmaps.ledger;
        dispatch(getGameItemsAction(bigmapId, ledgerKey.hash));
      }
    }
  };

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

  useEffect(() => {
    unityContext.addEventListener('GameStarted', handleGameStarted);
    unityContext.addEventListener('GameOver', handleGameOver);

    return () => {
      unityContext.removeEventListener('GameStarted', handleGameStarted);
      unityContext.removeEventListener('GameOver', handleGameOver);
    };
  });

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
