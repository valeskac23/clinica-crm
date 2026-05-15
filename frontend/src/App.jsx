import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import AdminPanel from './pages/AdminPanel';
import UserDashboard from './pages/UserDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminPanel />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;