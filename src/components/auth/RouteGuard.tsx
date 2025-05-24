
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
    // Check for userRole in localStorage
    const userRole = localStorage.getItem('userRole');
    console.log('RouteGuard checking role:', { userRole, requiredRole });
    
    if (!userRole) {
      // Not logged in, redirect to login
      console.log('No user role found, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }
    
    if (userRole !== requiredRole) {
      // Wrong role, redirect to login
      console.log('Wrong role, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }
    
    // User is authorized
    console.log('User authorized');
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
