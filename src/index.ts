import * as dotenv from 'dotenv';
import { calculateTotalTokenBalance, queryBalances } from '@/services/crypto';
import { writeTokens, writeWallets } from '@/helpers/csv';
import { initWeb3 } from '@/helpers/crypto';
import { getInputData } from '@/helpers/config';

async function main() {
  //init .env
  dotenv.config();

  const web3 = initWeb3();

  // Get wallet & token addresses from input file
  const addressData = getInputData();

  // Get balance of wallet & token's balances
  const [walletBalances, tokenBalances] = await queryBalances(
    web3,
    addressData
  );

  //calculate total balance of token addresses
  const totalTokenBalances = calculateTotalTokenBalance(tokenBalances);

  // write output to files
  writeWallets(walletBalances);
  writeTokens(totalTokenBalances);
}

main().catch(console.error);
