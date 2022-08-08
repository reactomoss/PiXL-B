import { useDispatch, useSelector } from 'react-redux';
import { setEntryCoinsAction } from 'redux/actions';

type EntryCoinProps = {
  insertCoin: (tokenId: any) => void;
};

const EntryCoin = ({ insertCoin }: EntryCoinProps): JSX.Element => {
  const dispatch = useDispatch();
  const entryCoins = useSelector((state: any) => state.gameState.entryCoins);

  const handleItemClicked = () => {
    const element = document.getElementById('entrycoin');
    if (element) {
      element.className = 'card animate__animated animate__backOutUp';
    }

    insertCoin(0);

    setTimeout(() => {
      dispatch(setEntryCoinsAction(0));
    }, 1000);
  };

  return (
    <>
      {entryCoins ? (
        <div
          id='entrycoin'
          onClick={(e) => handleItemClicked()}
          className="card entry-card"
        >
          <img
            className="entry-coin"
            src='/images/entrycoin.gif'
            alt='PiXL Entry Coin'
            style={{
              height: '190px',
              width: '202px',
              marginTop: '10px',
            }}
          />
        </div>
      ): (
        <></>
      )}
    </>
  );
};

export default EntryCoin;
