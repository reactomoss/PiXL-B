import { ItemType } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { setEntryCoinsAction } from 'redux/actions';

type EntryCoinProps = {
  sendMessage: (gameObjectName: string, methodName: string, parameter?: any) => void;
};

const EntryCoin = ({ sendMessage }: EntryCoinProps): JSX.Element => {
  const dispatch = useDispatch();
  const entryCoins = useSelector((state: any) => state.gameState.entryCoins);

  const getElementId = (index: number) => {
    return `entrycoin_${index}`;
  }

  const handleItemClicked = (coin: ItemType, index: number) => {
    const elementId = getElementId(index);
    const element = document.getElementById(elementId);
    if (element) {
      element.className = 'card animate__animated animate__backOutUp';
    }

    sendMessage('AccessController', 'InsertCoin', 0);

    setTimeout(() => {
      dispatch(setEntryCoinsAction(0));
    }, 1000);
  };

  return (
    <>
      {entryCoins > 0 && new Array(entryCoins).fill(0).map((coin, index) => (
        <div
          key={index}
          id={getElementId(index)}
          onClick={(e) => handleItemClicked(coin, index)}
          className="card entry-card"
        >
          <img
            className="entry-coin"
            src='https://cloudflare-ipfs.com/ipfs/QmPTFsFgEYfS3VV9uaTWfWUQGVqbaHa1t2npBUQZ4NiAvP'
            alt='PiXL Entry Coin'
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
