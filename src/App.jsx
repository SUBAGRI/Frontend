import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CreateOrder from "./pages/CreateOrderPage";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import Orders from './pages/Orders';
import AdminPage from './pages/AdministradorPage';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/orders/create/facturas" element={
          <ProtectedRoute>
            <CreateOrder tipo='facturas' />
          </ProtectedRoute>
        } />
        
        <Route path="/orders/create/recibidas" element={
          <ProtectedRoute>
            <CreateOrder tipo='recibidas' />
          </ProtectedRoute>
        } />
        
        <Route path="/orders/create/clientes" element={
          <ProtectedRoute>
            <CreateOrder tipo='clientes' />
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App
