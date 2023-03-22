import {useContext, useEffect} from 'react';
import {oramaContext} from './context.js';

export function useSearchableData(data: any[]): void {
  const {setData} = useContext(oramaContext);
  useEffect(() => {
    setData(data);
  }, [data]);
}
