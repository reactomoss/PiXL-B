import { useEffect, useCallback } from 'react';
import { IUnityContextHook } from 'react-unity-webgl/distribution/interfaces/unity-context-hook';
import toast from 'react-hot-toast';
import * as service from 'services';

const useUnityQuest = (unityContext: IUnityContextHook) => {
  const {
    sendMessage,
    addEventListener,
    removeEventListener,
  } = unityContext;

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

  useEffect(() => {
    addEventListener('ShareQuest', handleShareQuest);
    addEventListener('QuestCompleted', handleQuestCompleted);

    return () => {
      removeEventListener('ShareQuest', handleShareQuest);
      removeEventListener('QuestCompleted', handleQuestCompleted);
    }
  })
};

export default useUnityQuest;