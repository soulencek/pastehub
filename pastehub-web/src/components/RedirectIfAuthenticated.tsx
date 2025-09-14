import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
}

const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null;
  };
  
  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
