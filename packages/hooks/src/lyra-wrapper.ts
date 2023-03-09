import {type Lyra, type PropertiesSchema} from '@lyrasearch/lyra';

export type LyraWrapper = {
  isInitialized: boolean;
  isIndexed: boolean;
  db?: Lyra<PropertiesSchema>;
  setData: (data: any[]) => void;
};
