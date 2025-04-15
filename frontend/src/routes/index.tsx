import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products/Products';
import Categories from '../pages/Categories/Categories';
import Auth from '../pages/Auth/Auth';
import Cart from '../pages/Cart/Cart';
import { PrivateRoute } from '../components/PrivateRoute';
import About from '../pages/About/About';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Products />} />
      <Route path="/categorias" element={<Categories />} />
      <Route path="/auth" element={<Auth />} />
      <Route 
        path="/cart" 
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } 
      />
      <Route path="/carrinho" element={<Navigate to="/cart" replace />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
    </Routes>
  );
};