import { GameTokens } from 'config';
import { useSelector } from 'react-redux';
import './Inventory.css';

type InventoryProps = {
  sendMessage: (gameObjectName: string, methodName: string, parameter?: any) => void;
};

const getItemImage = (tokenId) => {
  switch (tokenId) {
    case GameTokens.HealthPotion:
      return 'https://cloudflare-ipfs.com/ipfs/QmNNtaYpP1N8tPdJCiDSCnzx8n8yEd8Qm6rx7vYwFji2qy';
  }

  return '';
}

const Inventory = ({ sendMessage }: InventoryProps): JSX.Element => {
  const gameItems = useSelector((state: any) => state.gameState.gameItems);

  const getElementId = (item: any, index: number) => {
    return `inventory_item_${item.tokenId}_${index}`;
  }

  const handleItemClicked = (item: any, index: number) => {
    const elementId = getElementId(item, index);
    const element = document.getElementById(elementId);
    if (element) {
      element.className = 'card animate__animated animate__backOutUp';
    }
    sendMessage('GameController', 'UseItem', 0);
  };

  return (
    <>
      {gameItems && gameItems.map((item, index) => (
        <div
          key={index}
          id={getElementId(item, index)}
          onClick={(e) => handleItemClicked(item, index)}
          className="card"
        >
          <img
            className="item"
            src={getItemImage(item.tokenId)}
            alt={'Game Item'}
            style={{
              height: '202px',
              width: '202px',
            }}
          />
        </div>
      ))}
    </>
  );
};

export default Inventory;
