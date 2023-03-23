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

    async function doSearch() {
      setResults(await search(db!, parameters));
      setDone(true);
    }

    void doSearch();
  }, [isIndexed, parameters]);

  return {done, results};
}
