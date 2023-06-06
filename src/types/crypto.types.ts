export interface AddressData {
  tokens: string[];
  wallets: string[];
}

export interface BalanceData {
  address: string;
  balance: string;
}

export interface TokenBalance {
  tokenAddress: string;
  balance: string;
}
