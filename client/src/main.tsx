import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AdminApp } from './AdminApp'
import { SocketLoading } from './SocketLoading/SocketLoading'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminApp />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketLoading >
      <RouterProvider router={router} />
    </SocketLoading>
  </React.StrictMode>,
)
