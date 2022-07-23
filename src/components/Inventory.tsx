import { GameTokens } from 'config';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUseItemStateAction } from 'redux/actions';
import './Inventory.css';

type InventoryProps = {
  consumeItem: (tokenId: any) => void;
};

const getItemImage = (tokenId) => {
  switch (tokenId) {
    case GameTokens.HealthPotion:
      return 'https://cloudflare-ipfs.com/ipfs/QmNNtaYpP1N8tPdJCiDSCnzx8n8yEd8Qm6rx7vYwFji2qy';
  }

  return '';
}

const Inventory = ({ consumeItem }: InventoryProps): JSX.Element => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: any) => state.gameState);
  const { gameItems, useItemState } = gameState;

  const invenItems = useMemo(() => {
    console.log('gameItems', gameItems)
    return gameItems.reduce((prev, item) => {
      const amount = Number(item.amount);
      if (amount > 0) {
        prev = prev.concat(new Array(amount).fill(item));
      }
      return prev;      
    }, [])
  }, [gameItems])

  const getElementId = (item: any, index: number) => {
    return `inventory_item_${item.tokenId}_${index}`;
  }

  const handleItemClicked = (item: any, index: number) => {
    if (!useItemState) {
      const elementId = getElementId(item, index);
      const element = document.getElementById(elementId);
      if (element) {
        element.className = 'card animate__animated animate__backOutUp';
      }
      
      dispatch(setUseItemStateAction(true));

      setTimeout(() => {
        consumeItem(item.tokenId);
      }, 1)
    }
  };

  return (
    <>
      {invenItems.map((item, index) => (
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
