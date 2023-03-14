import {useContext} from 'react';
import {lyraContext} from './context.js';

export default function useSetSearchableData() {
  const {setData} = useContext(lyraContext);
  return setData;
}
