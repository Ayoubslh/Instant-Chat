import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// app
import './index.css';
import App from './App.jsx';
// redux
import { Provider } from 'react-redux';
import { store } from '@/store';
// toast
import { Toaster } from 'react-hot-toast';
// query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './components/ui/theme-provider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <App />
          <Toaster />
        </StrictMode>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  </ThemeProvider>
);
