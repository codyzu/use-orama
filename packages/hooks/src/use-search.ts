import {
  search,
  type SearchResult,
  type PropertiesSchema,
  type SearchParams,
} from '@lyrasearch/lyra';
import {useContext, useEffect, useState} from 'react';
import {lyraContext} from './context';

export function useSearch(parameters: SearchParams<PropertiesSchema>) {
  const ctx = useContext(lyraContext);
  const {db, ready} = ctx;
  const [done, setDone] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult<PropertiesSchema>>();

  useEffect(() => {
    setDone(false);
    setResults(undefined);

    if (!ready) {
      return;
    }

    async function doSearch() {
      setResults(await search(db!, parameters));
      setDone(true);
    }

    void doSearch();
  }, [ready, parameters]);

  return {done, results};
}
