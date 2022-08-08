export const ENV = 'production';

export const API_BASE_URL_SERVER = 'https://pixl-dev.herokuapp.com';
export const API_BASE_URL_LOCAL = 'http://localhost:5000';
export const API_BASE_URL = API_BASE_URL_SERVER;

export const TZSTATS_URL_MAINNET = 'https://api.tzstats.com';
export const TZSTATS_URL_GHOSTNET = 'https://api.ghost.tzstats.com';
export const TZSTATS_URL_JAKARTANET = 'https://api.jakarta.tzstats.com';
export const TZSTATS_URL = TZSTATS_URL_MAINNET;

export const TEST_GHOSTNET_OPTIONS = {
  appName: 'PiXL',
  networkType: 'ghostnet',
  rpc: 'https://rpc.ghostnet.teztnets.xyz',
};

export const TEST_NETWORK_OPTIONS = {
  appName: 'PiXL',
  networkType: 'jakartanet',
  rpc: 'https://jakartanet.tezos.marigold.dev',
};

export const MAIN_NETWORK_OPTIONS = {
  appName: 'PiXL',
  networkType: 'mainnet',
  rpc: 'https://mainnet.api.tez.ie',
};

export const NETWORK_OPTIONS = MAIN_NETWORK_OPTIONS;

export const TOKEN_PIXLTEZ = 0;
export const TOKEN_INITCOIN = 1;

export enum DayPassToken {
  DayPass = 0,
  WeeklyPass = 1,
  YearlyPass = 2,
  SpecialEventPass = 3,
}

export enum PixlTokens {
  Pixltez = 0,
  InitCoin = 1,
}

export enum GameTokens {
  HealthPotion = 0, //'5069584c4850', //0
  MagicPotion = 1,
}

export const Contracts_Jakarta = {
  Pixltez: 'KT1MRn2mPk9XLZibGpMdWv5yU7VhLAS58CpJ',
  Entrycoin: 'KT19mdP9CnGUHAD3tyFiK9iqAPoupUGUQRVK',
  PixlGame: 'KT1L526arNXJhuS9pqReuT7FCrRQXZ3p9fCJ',
  DayPass: 'KT19jQhzpQNpsUrKYaRZQYapku8p8ML1FueD',
}

export const Contracts = {
  Pixltez: 'KT1SGdop74rGobKAETcBPnz9yQkH38hZnpBh',
  Entrycoin: 'KT1JG7Axbggh9qK6DvV4MdSkX6cGRxmSAyw4',
  PixlGame: 'KT1Eo6czNVaZ23agErEHcq6A7cTGa4X5F6dr',
  DayPass: 'KT19jQhzpQNpsUrKYaRZQYapku8p8ML1FueD',
}

