import {useContext, useEffect} from 'react';
import {lyraContext} from './context.js';

export function useSearchableData(data: any[]): void {
  const {setData} = useContext(lyraContext);
  useEffect(() => {
    setData(data);
  }, [data]);
}
