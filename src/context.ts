import {createContext} from 'react';
import {type Orama, type Schema} from '@orama/orama';

export type OramaContext = {
  isInitialized: boolean;
  isIndexed: boolean;
  db?: Orama;
  setData: (data: any[]) => void;
};

export const oramaContext = createContext<OramaContext>({
  isInitialized: false,
  isIndexed: false,
  setData: () => undefined,
});
