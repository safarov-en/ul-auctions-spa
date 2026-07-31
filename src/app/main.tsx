import '../index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProviderApp } from './providers/QueryProvider.component';
import { RouterProviderApp } from './providers/RouterProvider.component';

async function enableMocking() {
  if (import.meta.env.PROD) {
    return;
  }

  const { worker } = await import('../shared/mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryProviderApp>
        <RouterProviderApp />
      </QueryProviderApp>
    </React.StrictMode>
  );
});