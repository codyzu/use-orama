import {useContext} from 'react';
import {oramaContext} from './context.js';

export function useSetSearchableData() {
  const {setData} = useContext(oramaContext);
  return setData;
}
