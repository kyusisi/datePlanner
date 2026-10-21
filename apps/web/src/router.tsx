import { createBrowserRouter, Link } from 'react-router';
import { Layout } from './components/Layout';
import { ErrorState } from './components/Feedback';
import {
  HomePage,
  LoginPage,
  PlacesPage,
  PlansPage,
  MapPage,
  SettingsPage,
} from './pages/Pages';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: (
      <main className="mx-auto max-w-lg p-6">
        <ErrorState message="화면을 불러오지 못했어요." />
        <Link to="/">홈으로 이동</Link>
      </main>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/places', element: <PlacesPage /> },
      { path: '/plans', element: <PlansPage /> },
      { path: '/map', element: <MapPage /> },
      { path: '/settings', element: <SettingsPage /> },
      {
        path: '*',
        element: (
          <>
            <h1>페이지를 찾을 수 없어요</h1>
            <Link to="/" className="action inline-block">
              홈으로 이동
            </Link>
          </>
        ),
      },
    ],
  },
]);
