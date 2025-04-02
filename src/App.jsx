import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CreateOrder from "./pages/CreateOrderPage";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import FatturaPage from './pages/FatturaPage';
import DataPage from './pages/DataPage';
import Orders from './pages/Orders';
import AdminPage from './pages/AdministradorPage';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
          <Route path="/orders/create/facturas" element={
          <ProtectedRoute>
            <CreateOrder tipo='facturas'/>
          </ProtectedRoute>
        } />
        <Route path="/orders/create/recibidas" element={
          <ProtectedRoute>
            <CreateOrder tipo='recibidas'/>
          </ProtectedRoute>
        } />
        <Route path="/orders/create/clientes" element={
          <ProtectedRoute>
            <CreateOrder tipo='clientes'/>
          </ProtectedRoute>
        } />

        <Route path="/Orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />

        <Route path="/Admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />

        <Route path="/Home" element={<Navigate to="/" />} />
        <Route path="/orders" element={<Navigate to="/Orders" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
