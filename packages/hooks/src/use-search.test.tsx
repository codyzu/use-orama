// eslint-disable-line unicorn/filename-case
import {
  render,
  screen,
  renderHook,
  type RenderOptions,
  waitFor,
  type RenderHookOptions,
} from '@testing-library/react';
// Import type from '@testing-library/react/dist/@testing-li';
import {describe, it, expect, beforeEach} from 'vitest';
import {useEffect, useMemo, type ReactNode} from 'react';
import {type PropertiesSchema, type SearchResult} from '@lyrasearch/lyra';
import {useSearch} from './use-search';
import {Provider} from './Provider';
import useSetSearchableData from './use-set-searchable-data';
import useSearchableData from './use-searchable-data';
// Import {createLyra} from './create-index';

// Type Options = RenderOptions<
//   typeof import('@testing-library/dom/types/queries'),
//   HTMLElement,
//   HTMLElement
// >;
// type Wrapper = React.JSXElementConstructor<{
//   children: React.ReactElement;
// }>;
// const customRender = (
//   ui: JSX.Element,
//   {providerProps, ...renderOptions}: any,
// ) => {
//   return render(<Provider {...providerProps}>{ui}</Provider>, renderOptions);
// };

// const wrapper = ({
//   children,
//   data,
//   schema,
// }: {
//   children: ReactNode;
//   data: any;
//   schema: PropertiesSchema;
// }) => {
//   console.log('The data is', data);
//   return (
//     <Provider data={!data} schema={schema}>
//       {children}
//     </Provider>
//   );
// };

let data: any[] | undefined;
let propertiesSchema: PropertiesSchema | undefined;

beforeEach(() => {
  data = undefined;
  propertiesSchema = {value: 'string'};
});

function customRender(
  hook: (initialProps: unknown) => {
    done: boolean;
    results: SearchResult<PropertiesSchema> | undefined;
  },
) {
  return renderHook(hook, {
    wrapper: (props: any) => <Provider schema={propertiesSchema} {...props} />,
  });
}

describe('useSearch', () => {
  it('can set data with useSetSearchableData', async () => {
    data = [{value: 'a'}, {value: 'b'}];

    const searchParameters = {term: 'a'};
    const {result} = customRender(() => {
      const setData = useSetSearchableData();

      useEffect(() => {
        setData(data!);
      });

      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data![0],
      );
    });
  });

  it('can set data with useSearchableData', async () => {
    data = [{value: 'a'}, {value: 'b'}];

    const searchParameters = {term: 'a'};
    const {result} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data![0],
      );
    });
  });

  it('can change the search parameter', async () => {
    data = [{value: 'a'}, {value: 'b'}];

    let searchParameters = {term: 'a'};
    const {result, rerender} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data?.[0],
      );
    });

    // Update the search term and rerender
    searchParameters = {term: 'b'};
    rerender();

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data![1],
      );
    });
  });

  it('can change the searchable data', async () => {
    data = [{value: 'a'}, {value: 'b'}];

    let searchParameters = {term: 'c'};
    const {result, rerender} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(0);
    });

    // Change the data and the search term
    data = [{value: 'c'}, data[1]];
    searchParameters = {term: 'c'};

    rerender();

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data![0],
      );
    });
  });
});
