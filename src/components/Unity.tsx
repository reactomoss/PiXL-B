import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Toaster } from 'react-hot-toast';
import { Contracts } from 'config';
import EntryCoin from './EntryCoin';
import Inventory from './Inventory';
import './Unity.css';
import useWallet from 'hooks/useWallet';
import { getGameContractAction, getEntryCoinsAction } from 'redux/actions';
import useUnityGame from 'hooks/useUnityGame';
import useUnityQuest from 'hooks/useUnityQuest';
import useUnityItems from 'hooks/useUnityItems';

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
  const { sendMessage, addEventListener, removeEventListener } = unityContext;
  const unityGame = useUnityGame();
  const unityQuest = useUnityQuest();
  const unityItems = useUnityItems(sendMessage);
  const loadingPercentage = Math.round(unityContext.loadingProgression * 100);

  document.onfullscreenchange = function (event) {
    unityContext.requestFullscreen(false);
  };

  useEffect(() => {
    sendMessage('AccessController', 'WalletConnected', walletAddress || '');
  }, [walletAddress, sendMessage]);

  useEffect(() => {
    [Contracts.PixlGame, Contracts.Pixltez].forEach(address => {
      if (!contracts.find(c => c.contract.address === address)) {
        dispatch(getGameContractAction(address))
      }
    });
  }, [dispatch, contracts])

  useEffect(() => {
    if (walletAddress && !gameState.initEntryCoins) {
      const contract = contracts.find(c => c.contract.address === Contracts.Pixltez);
      contract && dispatch(getEntryCoinsAction(contract, walletAddress));
    }
  }, [dispatch, walletAddress, contracts, gameState.initEntryCoins]);

  useEffect(() => {
    addEventListener('GameStarted', unityGame.handleGameStarted);
    addEventListener('GameOver', unityGame.handleGameOver);
    addEventListener('ShareQuest', unityQuest.handleShareQuest);
    addEventListener('QuestCompleted', unityQuest.handleQuestCompleted);
    addEventListener('MintThis', unityItems.handleMintItem);
    addEventListener('MintPiXLtez', unityItems.handleMintPiXLtez);
    addEventListener('GotItem', unityItems.handleGotItem);
    addEventListener('InventoryFull', unityItems.handleInventoryFull);
    addEventListener('RequestItem', unityItems.handleRequestItem);

    return () => {
      removeEventListener('GameStarted', unityGame.handleGameStarted);
      removeEventListener('GameOver', unityGame.handleGameOver);
      removeEventListener('ShareQuest', unityQuest.handleShareQuest);
      removeEventListener('QuestCompleted', unityQuest.handleQuestCompleted);
      removeEventListener('MintThis', unityItems.handleMintItem);
      removeEventListener('MintPiXLtez', unityItems.handleMintPiXLtez);
      removeEventListener('GotItem', unityItems.handleGotItem);
      removeEventListener('InventoryFull', unityItems.handleInventoryFull);
      removeEventListener('RequestItem', unityItems.handleRequestItem);
    };
  });

  const consumeItem = useCallback((tokenId) => {
    sendMessage('GameController', 'UseItem', tokenId);
  }, [sendMessage]);

  const insertCoin = useCallback((tokenId) => {
    sendMessage('AccessController', 'InsertCoin', tokenId);
  }, [sendMessage]);

  // const handleMintPiXLtez = () => {
  //   unityItems.handleMintPiXLtez(20);
  // }

  return (
    <>
      {/* <div>
        {gameState.gameStarted && (
          <div className="debug-menu">
            <button onClick={handleMintPiXLtez}>Mint PiXLtez</button>
          </div>
        )}
      </div> */}
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
            <EntryCoin insertCoin={insertCoin}></EntryCoin>
          )}
          {gameState.gameStarted && (
            <>              
              <Inventory consumeItem={consumeItem}></Inventory>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default UnityComponent;
