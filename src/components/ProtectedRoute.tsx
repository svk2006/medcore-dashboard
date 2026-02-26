import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import EKGLoader from './EKGLoader';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) return <EKGLoader />;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
