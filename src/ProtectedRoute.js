import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, requiredRole, ...rest }) => {
  const isAuthenticated = localStorage.getItem('userId') !== null;
  const userRole = localStorage.getItem('role');

  // Exclude home route from redirection logic
  if (rest.path === '/' || rest.path === '') {
    return <Route {...rest} element={<Element />} />;
  }

  // Check if the user is authenticated and has the required role
  const isAuthorized = isAuthenticated && (!requiredRole || userRole === requiredRole);

  return (
    <Route
      {...rest}
      element={
        isAuthorized ? (
          <Element />
        ) : (
          <Navigate to="/"  replace />
        )
      }
    />
  );
};

export default ProtectedRoute;
