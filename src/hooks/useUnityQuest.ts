import toast from 'react-hot-toast';
import * as service from 'services';
import Lang from 'lang/en';
import useWallet from './useWallet';

const useUnityQuest = () => {
  const { walletAddress } = useWallet();

  const handleShareQuest = async (questDetails, Id) => {
    const result = await service.shareQuest(questDetails, Id).catch((error) => {
      toast.error("Server Didn't Respond, contact the admin");
    });
    if (result) {
      alert('Quest has been shared');
    }
  };

  const handleQuestCompleted = async function (questId: number) {
    console.log('QuestCompleted:', questId);
    if (!walletAddress) {
      toast.error(Lang.connectYourWallet);
      return;
    }
    try {
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
    }
  };

  return {
    handleShareQuest,
    handleQuestCompleted,
  }
};

export default useUnityQuest;
