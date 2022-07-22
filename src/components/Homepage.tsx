import * as React from 'react';
import {
  PlasmicHomepage,
  DefaultHomepageProps,
} from './plasmic/pi_xl_b/PlasmicHomepage';
import { HTMLElementRefOf } from '@plasmicapp/react-web';
import { useNavigate } from 'react-router-dom';

export interface HomepageProps extends DefaultHomepageProps {}

function Homepage_(props: HomepageProps, ref: HTMLElementRefOf<'div'>) {
  const navigate = useNavigate();

  const handleStartGame = (e) => {
    e.preventDefault();
    navigate('/play');
  };

  return (
    <PlasmicHomepage
      root={{ ref }}
      {...props}
      playButton={{
        onClick: (e) => handleStartGame(e),
      }}
      playGameButton={{
        onClick: (e) => handleStartGame(e),
      }}
      playNowButton={{
        onClick: (e) => handleStartGame(e),
      }}
    />
  );
}

const Homepage = React.forwardRef(Homepage_);
export default Homepage;
