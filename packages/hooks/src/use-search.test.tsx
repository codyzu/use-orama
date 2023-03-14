// eslint-disable-line unicorn/filename-case
import {renderHook, waitFor} from '@testing-library/react';
import {describe, it, expect, beforeEach} from 'vitest';
import {useEffect} from 'react';
import {type PropertiesSchema, type SearchResult} from '@lyrasearch/lyra';
import {useSearch} from './use-search';
import {Provider} from './Provider';
import useSetSearchableData from './use-set-searchable-data';
import useSearchableData from './use-searchable-data';

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
  it('can set data with callback returned from useSetSearchableData', async () => {
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

  it('can set data directly with useSearchableData', async () => {
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

  it('is never done when schema is not set', async () => {
    data = [{value: 'a'}, {value: 'b'}];
    propertiesSchema = undefined;
    let searchParameters = {term: 'a'};

    const {result, rerender} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).not.toBe(true);
    });

    searchParameters = {term: 'b'};
    rerender();

    await waitFor(() => {
      expect(result.current.done).not.toBe(true);
    });
  });

  it('is never done when data is not set', async () => {
    data = undefined;
    let searchParameters = {term: 'a'};

    const {result, rerender} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).not.toBe(true);
    });

    searchParameters = {term: 'b'};
    rerender();

    await waitFor(() => {
      expect(result.current.done).not.toBe(true);
    });
  });

  it('sets done to false after clearing data', async () => {
    data = [{value: 'a'}, {value: 'b'}];
    const searchParameters = {term: 'a'};

    const {result, rerender} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
    });

    data = undefined;
    rerender();

    await waitFor(() => {
      expect(result.current.done).not.toBe(true);
    });
  });

  it('sets done to false after clearing schema', async () => {
    data = [{value: 'a'}, {value: 'b'}];
    const searchParameters = {term: 'a'};

    const {result, rerender} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
    });

    propertiesSchema = undefined;
    rerender();

    await waitFor(() => {
      expect(result.current.done).not.toBe(true);
    });
  });

  it('sets done to false after clearing search parameters', async () => {
    data = [{value: 'a'}, {value: 'b'}];
    let searchParameters: any = {term: 'a'};

    const {result, rerender} = customRender(() => {
      useSearchableData(data!);
      return useSearch(searchParameters);
    });

    await waitFor(() => {
      expect(result.current.done).toBe(true);
    });

    searchParameters = undefined;
    rerender();

    await waitFor(() => {
      expect(result.current.done).not.toBe(true);
    });
  });
});
