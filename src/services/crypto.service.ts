import Web3 from 'web3';
import { AddressData, BalanceData, TokenBalance } from '@/types/crypto';
import ERC20_ABI from '@/contracts/erc20Abi';

export async function queryTokenBalance(
  web3: Web3,
  tokenAddress: string,
  walletAddress: string
): Promise<TokenBalance> {
  const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
  const balance = await contract.methods.balanceOf(walletAddress).call();
  return { tokenAddress, balance };
}

export async function queryWalletBalance(
  web3: Web3,
  walletAddress: string
): Promise<BalanceData> {
  const balance = await web3.eth.getBalance(walletAddress);
  return { address: walletAddress, balance };
}

export async function queryBalances(
  web3: Web3,
  addressData: AddressData
): Promise<[BalanceData[], TokenBalance[]]> {
  const { tokens, wallets } = addressData;

  const batchSize = 10; // Adjust the batch size as per request

  const walletBatches = chunkArray(wallets, batchSize);
  const tokenBatches = chunkArray(tokens, batchSize);

  const walletBalancePromises = walletBatches.flatMap((batch) =>
    batch.map((walletAddress) => queryWalletBalance(web3, walletAddress))
  );
  const tokenBalancePromises = tokenBatches.flatMap((batch) =>
    batch.flatMap((tokenAddress) =>
      wallets.map((walletAddress) =>
        queryTokenBalance(web3, tokenAddress, walletAddress)
      )
    )
  );

  // Perform these queries in parallel
  return await Promise.all([
    Promise.all(walletBalancePromises),
    Promise.all(tokenBalancePromises),
  ]);
}

const chunkArray = <T>(array: T[], size: number): T[][] =>
  array
    .filter((_, index) => index % size === 0)
    .map((_, index) => array.slice(index * size, (index + 1) * size));

export function calculateTotalTokenBalance(
  tokenBalances: TokenBalance[]
): Map<string, string> {
  return tokenBalances.reduce(
    (totalTokenBalances, { tokenAddress, balance }) => {
      if (totalTokenBalances.has(tokenAddress)) {
        const currentBalance = totalTokenBalances.get(tokenAddress);
        const updatedBalance = Web3.utils
          .toBN(currentBalance)
          .add(Web3.utils.toBN(balance));
        totalTokenBalances.set(tokenAddress, updatedBalance.toString());
      } else {
        totalTokenBalances.set(tokenAddress, balance);
      }
      return totalTokenBalances;
    },
    new Map<string, string>()
  );
}
