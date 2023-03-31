import {createContext} from 'react';
import {type Orama, type Schema} from '@orama/orama';

export type OramaContext = {
  isIndexed: boolean;
  db?: Orama;
  setData: (data: any[]) => void;
};

export const oramaContext = createContext<OramaContext>({
  isIndexed: false,
  setData: () => undefined,
});
