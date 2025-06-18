import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import { isAdmin } from '../../utils/adminAuth';

const AdminRouteGuard = ({ children }) => {
  const { username } = useQuiz();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is an admin
    if (!username) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    // Check if user has admin privileges
    const adminStatus = isAdmin(username);
    setIsAuthorized(adminStatus);
    setIsLoading(false);
  }, [username]);

  if (isLoading) {
    // You could show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    // Redirect to admin login if not authorized
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRouteGuard;