import * as React from 'react';
import { useSelector } from 'react-redux';
import { PlasmicPlay, DefaultPlayProps } from './plasmic/pi_xl_b/PlasmicPlay';
import { HTMLElementRefOf } from '@plasmicapp/react-web';
import useDayPass from '../hooks/useDayPass';
import useWallet from '../hooks/useWallet';
import UnityComponent from './Unity';
import { DayPassToken } from 'config';

export interface PlayProps extends DefaultPlayProps {}

function Play_(props: PlayProps, ref: HTMLElementRefOf<'div'>) {
  const entryCoins = useSelector((state: any) => state.gameState.entryCoins);
  const [holding, setHolding] = React.useState(false);
  const { walletAddress } = useWallet();

  React.useEffect(() => {
    if (walletAddress && entryCoins) {
      /*getTokenTime(DayPassToken.DayPass).then((token) => {
        if (token) {
          setHolding(true);
        }
      });*/
      setHolding(true);
    }
  }, [walletAddress, entryCoins]);

  const handleTicketImageClick = () => {
    window.open('https://ab2.gallery/asset/794691991', '_blank')
  }

  const ticketImage = () => {
    return (
      <div style={{ cursor: 'pointer' }}>
        <img
          src={holding? 'images/ticket.png' : 'images/buyToken.png' }
          alt="Ticket"
          onClick={handleTicketImageClick}
        />
      </div>
    );
  };

  return (
    <PlasmicPlay
      root={{ ref }}
      {...props}
      ticketImage={ticketImage()}
      unity={<UnityComponent />}
    />
  );
}

const Play = React.forwardRef(Play_);
export default Play;
