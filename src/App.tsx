import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services'; // <-- INI YANG BENER BES!

// Bikin file terpisah juga buat dua ini di folder pages biar makin rapi
const Barbers = () => <h1 className="text-2xl font-semibold text-gray-800">Manajemen Kapster</h1>;

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