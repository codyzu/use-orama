# use-orama

## React hooks for using Orama search

## 🚧 TODO: publish to npm, then update examples deps so they can used in codesandbox

### Quickstart

⏬ Install with your favorite package manager

```bash
# npm
npm install use-orama

# pnpm
pnpm add use-orama

# yarn
yarn add use-orama
```

📦 Wrap your components with the `<OramaProvider>` and define the schema

```jsx
import {OramaProvider} from 'use-orama';

const schema = {title: 'string', description: 'string'};

// ...
export function AppWithSearch() {
  return (
    <OramaProvider schema={schema}>
      <App />
    <OramaProvider>
  )
}
```

🔍 Do some searching!

```jsx
import {useSearchableData, useSearch} from 'use-orama';

const data = [
  {title: 'Gostbusters', description: 'Best movie ever made'},
  {title: 'Gooneys', description: 'Best movie of all time'},
];

const searchParameters = {term: 'ever'};

function App() {
  useSearchableData(data);
  const {done, results} = useSearch(searchParameters);

  if (!done) {
    return (<>Still searching</>);
  }

  return (
    <>
      {results.hits.map(
        hit => <div key={hit.id}>{hit.document.title}: {hit.document.descriptions}</div>
      )}
    </>
  );
}
```

It also integrates nicely with async fetching of the searchable data

```jsx
import {useSetSearchableData, useSearch} from 'use-orama';
const searchParameters = {term: 'ever'};

function App() {
  const setSearchableData = useSetSearchableData();

  useEffect(() => {
    async function fetchData() {
      const result = await fetch('https://your.api/data');
      setSearchableData(await result.json());
    }
    fetchData();
  }, [])

  if (!done) {
    return (<>Still searching</>);
  }

  return (
    <>
      {results.hits.map(
        hit => <div key={hit.id}>{hit.document.title}: {hit.document.descriptions}</div>
      )}
    </>
  );
}
```

⚠️ Notes:
* `useSearchableData` and `useSearch` do not need to be in the same component, but they do need to have a common `<OramaProvider>` ancestor.
* To avoid excessive rerenders, the Orama options, schema, searchable data, and search parameters should either be declared in a scope exterior to the components or use react's `useMemo` or `useState` to avoid creating new objects on every render.

### API

#### `<OramaProvider>`

Provider component that provides a common context for interfacing with Orama.
By making an `<OramaProvider>` a common ancestor, components that set the searchable data and perform the search are decoupled.

**Properties**

| Property | Description | Default |
|-|-|-|
| `schema` | Orama schema | _no default, this must be defined_ |
| `options` | Orama instance options | `{}` (empty object) |

#### `useSearchableData(data: any[]): void`

Sets the data to be indexed by Orama as a parameter to the hook.
Useful in cases when the data is constant.
`useSearchableData` and `useSetSearchableData` are mutually exclusive, use one or the other.

**Parameters**

| Parameter | Description |
|-|-|
| `data` | The data to index with orama |

#### `useSetSearchableData(): (data: any[]) => void`

Returns a callback function that can be used to set the data to be indexed Orama.
Useful in cases when the data is retrieved asynchronously via an API or database.
`useSearchableData` and `useSetSearchableData` are mutually exclusive, use one or the other.

**Parameters**

| Parameter | Description |
|-|-|
| return | setter callback that can be called with the data to be indexed with orama |


#### `useSearch(parameters: SearchParams<PropertiesSchema>): {done: boolean; results: SearchResult<PropertiesSchema> | undefined; }`

Sets the search parameters for Orama and returns the search results.
A convenience boolean, `done` is also returned to easily determine when searching is done.

**Parameters**

| Parameter | Description | Default |
|-|-|-|
| return | `{done, results}` An object with a boolean `done` that will be true when indexing and searching is done and `results` that contains the Orama search results (will be `undefined` when `done` is false) | |
