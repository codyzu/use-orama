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

      console.log('raw data', data);
      const fixedData = data.products.map((doc) => ({
        ...doc,
        id: doc.id.toString(),
      }));
      console.log('data', fixedData);
      setPosts(fixedData);
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
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            setSearchParameters({term: searchTerm});
          }}
        >
          Search
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          textAlign: 'left',
        }}
      >
        {results?.hits?.map((hit) => (
          <div key={hit.id} style={{display: 'contents'}}>
            <div style={{}}>{hit.document.title as string}</div>
            <div style={{}}>{hit.document.description as string}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
