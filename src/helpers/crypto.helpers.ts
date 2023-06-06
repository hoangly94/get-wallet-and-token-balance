import Web3 from 'web3';

export function initWeb3() {
  return new Web3(process.env.PROVIDER_URL);
}
