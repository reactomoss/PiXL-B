import * as React from 'react';
import {
  PlasmicNavBar,
  DefaultNavBarProps,
} from './plasmic/pi_xl_b/PlasmicNavBar';
import { HTMLElementRefOf } from '@plasmicapp/react-web';
import useWallet from 'hooks/useWallet';

export interface NavBarProps extends DefaultNavBarProps {}

function NavBar_(props: NavBarProps, ref: HTMLElementRefOf<'header'>) {
  //const history = useHistory();
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();

  const handleSyncButton = (e) => {
    e.preventDefault();
    !walletAddress ? connectWallet() : disconnectWallet();
  };

  /*const handleNavigateButton = (e: any, location: string) => {
    e.preventDefault();
    history.push(location);
  };*/

  return (
    <PlasmicNavBar
      root={{ ref }}
      {...props}
      synced={walletAddress ? true : undefined}
      syncButton={{ onClick: handleSyncButton }}
    />
  );
}

const NavBar = React.forwardRef(NavBar_);
export default NavBar;
