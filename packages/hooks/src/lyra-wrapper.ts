import {type Lyra, type PropertiesSchema} from '@lyrasearch/lyra';

export type LyraWrapper = {ready: boolean; db?: Lyra<PropertiesSchema>};
