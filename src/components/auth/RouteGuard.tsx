
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole: 'coach' | 'parent';
}

const RouteGuard = ({ children, requiredRole }: RouteGuardProps) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // This would typically check an authentication token from localStorage
    // For demonstration, we'll check for a 'userRole' in localStorage
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole || userRole !== requiredRole) {
      // Not logged in or wrong role, redirect to login
      navigate('/login', { replace: true });
      return;
    }
    
    setAuthorized(true);
  }, [navigate, requiredRole]);

  // Show nothing while checking authorization
  if (!authorized) {
    return null;
  }

  // Render children if authorized
  return <>{children}</>;
};

export default RouteGuard;
