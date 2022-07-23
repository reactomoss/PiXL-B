import * as React from 'react';
import { PlasmicPlay, DefaultPlayProps } from './plasmic/pi_xl_b/PlasmicPlay';
import { HTMLElementRefOf } from '@plasmicapp/react-web';
import useDayPass from '../hooks/useDayPass';
import useWallet from '../hooks/useWallet';
import UnityComponent from './Unity';
import { DayPassToken } from 'config';

export interface PlayProps extends DefaultPlayProps {}

function Play_(props: PlayProps, ref: HTMLElementRefOf<'div'>) {
  const [holding, setHolding] = React.useState(false);
  const { walletAddress } = useWallet();
  const { getTokenTime } = useDayPass();

  React.useEffect(() => {
    if (walletAddress) {
      getTokenTime(DayPassToken.DayPass).then((token) => {
        if (token) {
          setHolding(true);
        }
      });
    }
  }, [walletAddress, getTokenTime]);

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
