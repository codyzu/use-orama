import {useContext, useEffect} from 'react';
import {lyraContext} from './context.js';

export default function useSearchableData(data: any[]) {
  const {setData} = useContext(lyraContext);
  useEffect(() => {
    setData(data);
  }, [data]);
}
