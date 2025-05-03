import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { home } from '@/router/home';
import { auth } from '@/router/auth';
import { dashboard } from '@/router/dashboard';
import { profile } from './router/profile';

const router = createBrowserRouter([home, auth, dashboard, profile]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
