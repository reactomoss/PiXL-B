export const ENV = 'production';

export const API_BASE_URL_SERVER = 'https://pixl-dev.herokuapp.com';
export const API_BASE_URL_LOCAL = 'http://localhost:5000';
export const API_BASE_URL = API_BASE_URL_SERVER;

export const TZSTATS_URL_MAINNET = 'https://api.tzstats.com';
export const TZSTATS_URL_GHOSTNET = 'https://api.ghost.tzstats.com';
export const TZSTATS_URL = TZSTATS_URL_GHOSTNET;

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

export const Contracts = {
  Pixltez: 'KT1MRn2mPk9XLZibGpMdWv5yU7VhLAS58CpJ',
  PixlGame_NFT: 'KT1NEE7o79oodu2d2RCf7Hc1ZCMpUar8X2CM',
  PixlGame_Fungile: 'KT19eGPe6cQuVP89r7ES8Hs6eZzz3xmgx5UC',
  DayPass: 'KT19jQhzpQNpsUrKYaRZQYapku8p8ML1FueD',
}

