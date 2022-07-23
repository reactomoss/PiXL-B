import React from 'react';
import { Provider } from 'react-redux'
import { NotificationsProvider } from "@mantine/notifications";
import { NetworkOptions, TezosProvider } from './contexts/TezosContext';
import store from './redux/store'

const options = {
  appName: 'PiXL',
  networkType: 'ghostnet',
  rpc: 'https://rpc.ghostnet.teztnets.xyz',
} as NetworkOptions;

const Providers: React.FC<{ children?: JSX.Element | JSX.Element[] }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <TezosProvider options={options}>
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </TezosProvider>
    </Provider>
  );
};

export default Providers;
