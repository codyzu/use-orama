import {createContext} from 'react';
import {type Lyra, type PropertiesSchema} from '@lyrasearch/lyra';

export type LyraContext = {
  isInitialized: boolean;
  isIndexed: boolean;
  db?: Lyra<PropertiesSchema>;
  setData: (data: any[]) => void;
};

export const lyraContext = createContext<LyraContext>({
  isInitialized: false,
  isIndexed: false,
  setData: () => undefined,
});
