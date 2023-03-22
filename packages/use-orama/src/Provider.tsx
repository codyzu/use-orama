import {
  type Lyra,
  type PropertiesSchema,
  create,
  insertBatch,
} from '@lyrasearch/lyra';
import {type ReactNode, useState, useEffect} from 'react';
import {oramaContext} from './context.js';

export function OramaProvider({
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
    async function initOrama() {
      setIsIndexed(false);
      setDb(undefined);
      setIsInitialized(false);

      // Don't create the Orama instance if there is no schema (Orama will throw)
      if (schema === undefined) {
        return;
      }

      const db = await create({schema, ...options});
      setIsInitialized(true);
      setDb(db);
    }

    void initOrama();
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
    <oramaContext.Provider value={{db, isInitialized, isIndexed, setData}}>
      {children}
    </oramaContext.Provider>
  );
}