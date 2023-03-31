import {search, type Results, type SearchParams} from '@orama/orama';
import {useContext, useEffect, useState} from 'react';
import {oramaContext} from './context.js';

export function useSearch(parameters: SearchParams) {
  const ctx = useContext(oramaContext);
  const {db, isIndexed} = ctx;
  const [done, setDone] = useState<boolean>(false);
  const [results, setResults] = useState<Results>();

  useEffect(() => {
    setDone(false);
    setResults(undefined);

    if (!isIndexed) {
      return;
    }

    if (!parameters) {
      return;
    }

    let isCanceled = false;
    async function doSearch() {
      const results = await search(db!, parameters);

      // Don't update state of the component has been unmounted
      if (isCanceled) {
        return;
      }

      setResults(results);
      setDone(true);
    }

    void doSearch();

    return () => {
      isCanceled = true;
    };
  }, [isIndexed, parameters]);

  return {done, results};
}
