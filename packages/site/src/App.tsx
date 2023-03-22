import {useEffect, useState} from 'react';
import {useSearch, useSearchableData} from 'use-lyra';
import './App.css';

type Product = {
  id: number;
  title: string;
  description: string;
};

type Response = {
  products: Product[];
};

function App() {
  const [posts, setPosts] = useState<any[]>();

  useEffect(() => {
    async function getData() {
      const result = await fetch('https://dummyjson.com/products?limit=100');
      const data = (await result.json()) as Response;

      // Orama will explode if ids are not strings
      const dataWithStringIds = data.products.map((doc) => ({
        ...doc,
        id: doc.id.toString(),
      }));

      setPosts(dataWithStringIds);
    }

    void getData();
  }, []);

  const [searchParameters, setSearchParameters] = useState<{term: string}>();

  (useSearchableData as (data: any[]) => void)(posts!);
  const {done, results} = useSearch(searchParameters!);

  const [searchTerm, setSearchTerm] = useState('');

  console.log({done, results});

  return (
    <>
      <h2>useOrama hooks exerciser</h2>
      <form
        className="search-bar"
        onSubmit={(event) => {
          event.preventDefault();
          setSearchParameters({term: searchTerm});
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <button type="submit">Search</button>
      </form>
      <h3>
        {`${results?.count ?? '0'} results in ${results?.elapsed ?? '0 μs'}`}
      </h3>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>description</th>
          </tr>
        </thead>
        <tbody>
          {results?.hits?.map((hit) => (
            <tr key={hit.id}>
              <td>{hit.document.title as string}</td>
              <td>{hit.document.description as string}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
