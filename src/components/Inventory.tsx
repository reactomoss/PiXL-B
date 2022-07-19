import { useSelector } from 'react-redux';
import { UnityProps } from 'types';
import './Inventory.css';

type InventoryProps = {
  unity: UnityProps;
};

const Inventory = ({ unity }: InventoryProps): JSX.Element => {
  const gameItems = useSelector((state: any) => state.gameState.gameItems);

  const getElementId = (item: any, index: number) => {
    return `inventory_item_${item.id}_${index}`;
  }

  const handleItemClicked = (item: any, index: number) => {
    const elementId = getElementId(item, index);
    const element = document.getElementById(elementId);
    if (element) {
      element.className = 'card animate__animated animate__backOutUp';
    }
    unity.sendMessage('GameController', 'UseItem', 0);
  };

  return (
    <>
      {gameItems.map((item, index) => (
        <div
          key={index}
          id={getElementId(item, index)}
          onClick={(e) => handleItemClicked(item, index)}
          className="card"
        >
          <img
            className="ml-auto mr-auto"
            src={item.imageSrc}
            alt={item.alt}
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
