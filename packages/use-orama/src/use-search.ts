import {
  search,
  type SearchResult,
  type PropertiesSchema,
  type SearchParams,
} from '@lyrasearch/lyra';
import {useContext, useEffect, useState} from 'react';
import {oramaContext} from './context.js';

export function useSearch(parameters: SearchParams<PropertiesSchema>) {
  const ctx = useContext(oramaContext);
  const {db, isIndexed} = ctx;
  const [done, setDone] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult<PropertiesSchema>>();

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
