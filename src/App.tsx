import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services'; // <-- INI YANG BENER BES!
import Barbers from './pages/Barbers'; // <-- INI YANG BENER BES!

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/barbers" element={<Barbers />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}