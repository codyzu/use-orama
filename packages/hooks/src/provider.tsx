import {
  type Lyra,
  type PropertiesSchema,
  create,
  insertBatch,
} from '@lyrasearch/lyra';
import {type ReactNode, useState, useEffect, useMemo} from 'react';
import {lyraContext} from './context';
import {type LyraWrapper} from './lyra-wrapper';

export function Provider({
  children,
  data,
  schema,
  options,
}: {
  children: ReactNode;
  data: any;
  schema: PropertiesSchema;
  options?: any;
}) {
  const [db, setDb] = useState<Lyra<PropertiesSchema>>();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    async function initLyra() {
      setReady(false);
      setDb(undefined);

      console.log('schema', schema, 'options', options, 'data', data);

      const db = await create({schema, ...options});
      setDb(db);
      await insertBatch(db, data);
      setReady(true);
    }

    void initLyra();
  }, [data, schema, options]);

  return (
    <lyraContext.Provider value={{db, ready}}>{children}</lyraContext.Provider>
  );
}

// Export const Provider = lyraContext.Provider;
