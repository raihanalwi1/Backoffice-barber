import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Barbers from './pages/Barbers';
import Login from './pages/Login'; // <-- IMPORT HALAMAN LOGIN

// 🛡️ POS SATPAM: Cek token login di LocalStorage
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // Kalau belum login, tendang ke halaman login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🚪 JALUR BEBAS: Halaman Login (Sengaja nggak dibungkus AdminLayout) */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 JALUR TERKUNCI: Dashboard & Kawan-kawan */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/barbers" element={<Barbers />} />
                  <Route path="/services" element={<Services />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}