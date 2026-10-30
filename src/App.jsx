import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Otp from './pages/Otp';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <main className="mobile-app-shell">
      <Routes>
        {/* Public-only routes: redirect to / if already logged in */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <PublicOnlyRoute>
              <Otp />
            </PublicOnlyRoute>
          }
        />

        {/* Protected routes: redirect to /login if not authenticated */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Restaurants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetail />
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default App;
