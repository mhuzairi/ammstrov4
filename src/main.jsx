import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Documentation from './Documentation.jsx'
import Repository from './Repository.jsx'
import Login from './Login.jsx'
import Blog from './Blog.jsx'
import AnnouncementsAdmin from './AnnouncementsAdmin.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/documentation",
    element: <Documentation />,
  },
  {
    path: "/repository",
    element: <Repository />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/admin",
    element: <AnnouncementsAdmin />,
  },
  {
    path: "/announcements-admin",
    element: <Navigate to="/admin" replace />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
