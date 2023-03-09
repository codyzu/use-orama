import {
  type Lyra,
  type PropertiesSchema,
  create,
  insertBatch,
} from '@lyrasearch/lyra';
import {type ReactNode, useState, useEffect, useMemo} from 'react';
import {lyraContext} from './context';

export function Provider({
  children,
  schema,
  options,
}: {
  children: ReactNode;
  schema: PropertiesSchema;
  options?: any;
}) {
  const [db, setDb] = useState<Lyra<PropertiesSchema>>();
  const [isIndexed, setIsIndexed] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    async function initLyra() {
      setIsIndexed(false);
      setDb(undefined);
      setIsInitialized(false);

      console.log('schema', schema, 'options', options, 'data', data);

      const db = await create({schema, ...options});
      setIsInitialized(true);
      setDb(db);
    }

    void initLyra();
  }, [schema, options]);

  useEffect(() => {
    async function insertData() {
      setIsIndexed(false);

      // Data not yet set
      if (!data) {
        return;
      }

      // Indexing hasn't finished yet
      if (!isInitialized) {
        return;
      }

      await insertBatch(db!, data);
      setIsIndexed(true);
    }

    void insertData();
  }, [isInitialized, data]);

  return (
    <lyraContext.Provider value={{db, isInitialized, isIndexed, setData}}>
      {children}
    </lyraContext.Provider>
  );
}

// Export const Provider = lyraContext.Provider;
