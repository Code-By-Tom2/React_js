import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}