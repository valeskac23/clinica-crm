import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importas tu hook de autenticación

const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();

  // Es importante manejar el estado de carga mientras se verifica el token
  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/unauthorized" />; // O un mensaje de error
  }

  return children;
};

export default PrivateRoute;