import { readFileSync } from 'fs';
import { AddressData } from '@/types/crypto';

export const getInputData: () => AddressData = () => {
  const jsonString = readFileSync(
    `config/${process.env.INPUT_DATA_FILE_NAME}.json`,
    'utf8'
  );
  return JSON.parse(jsonString);
};
