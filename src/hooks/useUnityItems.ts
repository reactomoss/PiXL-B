import { useEffect, useCallback } from 'react';
import { IUnityContextHook } from 'react-unity-webgl/distribution/interfaces/unity-context-hook';

const useUnityItems = (unityContext: IUnityContextHook) => {
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    requestFullscreen,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = unityContext;

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
};

export default useUnityItems;