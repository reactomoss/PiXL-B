import * as React from 'react';
import {
  PlasmicNavBars,
  DefaultNavBarsProps,
} from './plasmic/pi_xl_b/PlasmicNavBars';
import { HTMLElementRefOf } from '@plasmicapp/react-web';
import useWallet from 'hooks/useWallet';

export interface NavBarsProps extends DefaultNavBarsProps {}

function NavBars_(props: NavBarsProps, ref: HTMLElementRefOf<'header'>) {
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();

  const handleSyncButton = (e) => {
    e.preventDefault();
    !walletAddress ? connectWallet() : disconnectWallet();
  };

  return (
    <PlasmicNavBars
      root={{ ref }}
      {...props}
      synced={walletAddress ? true : undefined}
      syncButton={{ onClick: handleSyncButton }}
    />
  );
}

const NavBars = React.forwardRef(NavBars_);
export default NavBars;
