import {
  type Orama,
  type Schema,
  create,
  insertMultiple,
  type Components,
} from '@orama/orama';
import {type ReactNode, useState, useEffect} from 'react';
import {oramaContext} from './context.js';

export function OramaProvider({
  children,
  schema,
  language,
  components,
}: {
  children: ReactNode;
  schema: Schema;
  language?: string;
  components?: Components;
}) {
  const [db, setDb] = useState<Orama>();
  const [isIndexed, setIsIndexed] = useState<boolean>(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    setIsIndexed(false);
    setDb(undefined);

    // Don't create the Orama instance if there is no schema (Orama will throw)
    if (schema === undefined) {
      return;
    }

    // Data not yet set
    if (!data) {
      return;
    }

    // Data empty (convenience for cases when consumers start with an empty array to simplify react logic)
    if (data?.length === 0) {
      return;
    }

    let isInitCanceled = false;

    async function initOrama() {
      console.log('creating');
      const db = await create({schema, language, components});

      // Stop indexing if the component has been unmounted
      if (isInitCanceled) {
        console.log('create canceled');
        return;
      }

      console.log('inserting');
      await insertMultiple(db, data!);

      // Don't update state of the component has been unmounted
      if (isInitCanceled) {
        console.log('insert canceled');
        return;
      }

      console.log('inserted');

      setIsIndexed(true);
      setDb(db);
    }

    void initOrama();

    return () => {
      console.log('canceling');
      isInitCanceled = true;
    };
  }, [schema, language, components, data]);

  return (
    <oramaContext.Provider value={{db, isIndexed, setData}}>
      {children}
    </oramaContext.Provider>
  );
}
