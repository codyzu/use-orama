import {createContext} from 'react';
import {type LyraWrapper} from './lyra-wrapper';

export const lyraContext = createContext<LyraWrapper>({
  isInitialized: false,
  isIndexed: false,
  setData: () => undefined,
});
