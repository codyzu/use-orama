// eslint-disable-line unicorn/filename-case
import React from 'react';
import ReactDOM from 'react-dom/client';
import {type Schema, stemmers} from '@orama/orama';
import {OramaProvider} from 'use-orama';
import App from './App';
import './index.css';

const schema: Schema = {
  title: 'string',
  description: 'string',
};

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <OramaProvider
      schema={schema}
      components={{
        // Use the english stemmer for our data
        tokenizer: {stemmer: stemmers.english},
        // Our data has number ids, orama needs string ids
        getDocumentIndexId: (doc) => String(doc.id),
      }}
    >
      <App />
    </OramaProvider>
  </React.StrictMode>,
);
