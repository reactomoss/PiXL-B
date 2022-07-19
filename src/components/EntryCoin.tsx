import { ItemType } from "../types";
import { useSelector } from 'react-redux';

type EntryCoinProps = {
  sendCoin: (coin: ItemType) => void,
};

const EntryCoin = ({ sendCoin }: EntryCoinProps): JSX.Element => {
  const gameState = useSelector((state: any) => state.gameState);
  console.log('gameState.entryCoins', gameState.entryCoins)

  const handleSendCoin = (index, coin: ItemType) => {
    const element = document.getElementById(`entrycoin_${index}`);
    if (element) {
      element.className = 'card animate__animated animate__backOutUp';
    }
    sendCoin(coin);
  };

  return (
    <section className="card-list mt-2 ml-auto mr-auto items-center justify-center">
      {gameState.entryCoins.map((coin, index) => (
        <div
          key={index}
          id={`entrycoin_${index}`}
          onClick={(e) => handleSendCoin(index, coin)}
          className="card entry-card"
        >
          <img
            className="entry-coin"
            src={coin.imageSrc}
            alt={coin.alt}
            style={{
              height: "190px",
              width: "202px",
              marginTop: "10px",
            }}
          />
        </div>
      ))}
    </section>
  );
};

export default EntryCoin;
