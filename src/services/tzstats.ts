import axios from 'axios';
import { TZSTATS_URL } from '../config';

export const getContract = (address: string) => {
  const url = `${TZSTATS_URL}/explorer/contract/${address}`;
  return axios.get(url)
}

export const getBigmap = (id: string) => {
  const url = `${TZSTATS_URL}/explorer/bigmap/${id}`;
  return axios.get(url)
}

export const getBigmapKeys = (id: string) => {
  const url = `${TZSTATS_URL}/explorer/bigmap/${id}/keys`;
  return axios.get(url)
}

export const getBigmapValues = (id: string) => {
  const url = `${TZSTATS_URL}/explorer/bigmap/${id}/values`;
  return axios.get(url)
}

export const getBigmapValue = (id: string, key: string) => {
  const url = `${TZSTATS_URL}/explorer/bigmap/${id}/${key}`;
  return axios.get(url)
}
