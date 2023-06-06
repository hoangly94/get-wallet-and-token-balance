import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { BalanceData } from '@/types/crypto';
import Web3 from 'web3';

export async function writeWallets(walletBalances: BalanceData[]) {
  // Create output path if not exist
  await createOutputPath();

  const walletCSVStringBuffer = ['Wallet Address,Balance (ETH)'];
  for (const { address, balance } of walletBalances) {
    walletCSVStringBuffer.push(`${address},${Web3.utils.fromWei(balance)}`);
  }
  const filePath = `${process.env.OUTPUT_PATH}/${process.env.OUTPUT_WALLET_FILE}`;
  writeFileSync(filePath, walletCSVStringBuffer.join('\n'));
}

export async function writeTokens(totalTokenBalances: Map<string, string>) {
  // Create output path if not exist
  await createOutputPath();

  const tokenCSVStringBuffer = ['Token Address,Total Balance'];
  for (const [tokenAddress, balance] of totalTokenBalances.entries()) {
    tokenCSVStringBuffer.push(`${tokenAddress},${Web3.utils.fromWei(balance)}`);
  }
  const filePath = `${process.env.OUTPUT_PATH}/${process.env.OUTPUT_TOKEN_FILE}`;
  writeFileSync(filePath, tokenCSVStringBuffer.join('\n'));
}

export function createOutputPath() {
  const outputPath = process.env.OUTPUT_PATH;
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }
}
