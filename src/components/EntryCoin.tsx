import { ItemType } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { setEntryCoinAction } from 'redux/actions';

type EntryCoinProps = {
  sendMessage: (gameObjectName: string, methodName: string, parameter?: any) => void;
};

const EntryCoin = ({ sendMessage }: EntryCoinProps): JSX.Element => {
  const dispatch = useDispatch();
  const entryCoins = useSelector((state: any) => state.gameState.entryCoins);

  const getElementId = (item: any, index: number) => {
    return `entrycoin_${index}`;
  }

  const handleItemClicked = (coin: ItemType, index: number) => {
    const elementId = getElementId(coin, index);
    const element = document.getElementById(elementId);
    if (element) {
      element.className = 'card animate__animated animate__backOutUp';
    }

    sendMessage('AccessController', 'InsertCoin', coin.id);

    setTimeout(() => {
      dispatch(setEntryCoinAction([]));
    }, 1000);
  };

  return (
    <>
      {entryCoins.map((coin, index) => (
        <div
          key={index}
          id={getElementId(coin, index)}
          onClick={(e) => handleItemClicked(coin, index)}
          className="card entry-card"
        >
          <img
            className="entry-coin"
            src={coin.imageSrc}
            alt={coin.alt}
            style={{
              height: '190px',
              width: '202px',
              marginTop: '10px',
            }}
          />
        </div>
      ))}
    </>
  );
};

export default EntryCoin;
