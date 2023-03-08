// eslint-disable-line unicorn/filename-case
import {
  render,
  screen,
  renderHook,
  type RenderOptions,
  waitFor,
} from '@testing-library/react';
// Import type from '@testing-library/react/dist/@testing-li';
import {describe, it, expect} from 'vitest';
import {useMemo, type ReactNode} from 'react';
import {type PropertiesSchema} from '@lyrasearch/lyra';
import {useSearch} from './use-search';
import {Provider} from './provider';
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

describe('useSearch', () => {
  it('performs a search', async () => {
    const data = [{value: 'a'}, {value: 'b'}];
    const schema: PropertiesSchema = {value: 'string'};

    const searchParameters = {term: 'a'};
    const {result, rerender} = renderHook(
      (...args) => {
        console.log('args', args);
        return useSearch(searchParameters);
      },
      {
        wrapper: (props: any) => (
          <Provider data={data} schema={schema} {...props} />
        ),
      },
    );

    rerender();

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data[0],
      );
    });
  });

  it('performs multiple searches', async () => {
    const data = [{value: 'a'}, {value: 'b'}];
    const schema: PropertiesSchema = {value: 'string'};

    let searchParameters = {term: 'a'};
    const {result, rerender} = renderHook(() => useSearch(searchParameters), {
      wrapper: (props: any) => (
        <Provider data={data} schema={schema} {...props} />
      ),
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
    });

    searchParameters = {term: 'b'};

    rerender();

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data[1],
      );
    });
  });

  it('can change data', async () => {
    let data = [{value: 'a'}, {value: 'b'}];
    const schema: PropertiesSchema = {value: 'string'};

    let searchParameters = {term: 'a'};
    const {result, rerender} = renderHook(() => useSearch(searchParameters), {
      wrapper: (props: any) => (
        <Provider data={data} schema={schema} {...props} />
      ),
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
    });

    data = [{value: 'c'}, data[1]];

    searchParameters = {term: 'c'};

    rerender();

    await waitFor(() => {
      expect(result.current.done).toBe(true);
      expect(result.current.results?.hits).toHaveLength(1);
      expect(result.current.results?.hits.map((hit) => hit.document)).toContain(
        data[0],
      );
    });
  });
});
