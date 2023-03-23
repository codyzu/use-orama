// eslint-disable-line unicorn/filename-case
import React from 'react';
import ReactDOM from 'react-dom/client';
import {type Schema} from '@orama/orama';
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
      options={{
        components: {
          elapsed: {
            // Make the elapsed time human readable
            format: 'human',
          },
        },
      }}
    >
      <App />
    </OramaProvider>
  </React.StrictMode>,
);
