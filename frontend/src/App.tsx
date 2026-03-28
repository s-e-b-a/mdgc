import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import VideoGamesPage from '@/pages/VideoGamesPage';
import PlatformsPage from '@/pages/PlatformsPage';
import HardwarePage from '@/pages/HardwarePage';
import AccessoriesPage from '@/pages/AccessoriesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'videogames', element: <VideoGamesPage /> },
      { path: 'platforms', element: <PlatformsPage /> },
      { path: 'hardware', element: <HardwarePage /> },
      { path: 'accessories', element: <AccessoriesPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
