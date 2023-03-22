import {createContext} from 'react';
import {type Lyra, type PropertiesSchema} from '@lyrasearch/lyra';

export type OramaContext = {
  isInitialized: boolean;
  isIndexed: boolean;
  db?: Lyra<PropertiesSchema>;
  setData: (data: any[]) => void;
};

export const oramaContext = createContext<OramaContext>({
  isInitialized: false,
  isIndexed: false,
  setData: () => undefined,
});
