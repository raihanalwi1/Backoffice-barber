import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Barbers from './pages/Barbers';
import Admins from './pages/Admins';
// import LaporanKeuangan from './pages/LaporanKeuangan';
import Login from './pages/Login'; // <-- IMPORT HALAMAN LOGIN

// 🛡️ POS SATPAM: Cek token login di LocalStorage
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    // Kalau belum login, tendang ke halaman login
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleGuard = ({ allowedRoles, children }: { allowedRoles: string[], children: ReactNode }) => {
  const role = localStorage.getItem('adminRole') || '';
  
  if (!allowedRoles.includes(role)) {
    return <div className="p-10 text-center text-red-500">Waduh, lu nggak punya akses ke sini bes!</div>;
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
                  <Route path="/services" element={<ProtectedRoute><RoleGuard allowedRoles={['superadmin']}><Services /></RoleGuard></ProtectedRoute>} />
                  <Route path="/admins" element={<ProtectedRoute><RoleGuard allowedRoles={['superadmin']}><Admins /></RoleGuard></ProtectedRoute>} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}