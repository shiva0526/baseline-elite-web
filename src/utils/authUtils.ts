
import { NavigateFunction } from 'react-router-dom';

export const logout = (navigate: NavigateFunction) => {
  // Clear authentication data
  localStorage.removeItem('userRole');
  
  // Redirect to login page
  navigate('/login');
};
