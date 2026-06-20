import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Tipe data buat ngerapihin TypeScript
interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi buat narik data dari server backend lu
const fetchServices = async () => {
    try {
      console.log("Mencoba narik data dari backend..."); // CCTV 1
      const response = await axios.get('http://192.168.2.4:3000/api/services');
      
      console.log("Data berhasil ditarik! Ini isinya:", response.data); // CCTV 2
      
      // Nah, kadang backend ngirim langsung array, kadang dibungkus 'data'. 
      // Kita bikin pintar aja:
      const actualData = response.data.data ? response.data.data : response.data;
      
      setServices(actualData); 
      setLoading(false);
    } catch (error) {
      console.error('Gagal narik data:', error);
      setLoading(false);
    }
  };

  // Otomatis narik data pas halaman web dibuka
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div>
      {/* Bagian Header Halaman */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen Layanan</h1>
          <p className="text-gray-500 mt-1">Atur menu potongan rambut dan harga di sini.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Bagian Tabel Konten */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium">Nama Layanan</th>
              <th className="p-4 font-medium">Harga</th>
              <th className="p-4 font-medium">Durasi</th>
              <th className="p-4 font-medium">Deskripsi</th>
              <th className="p-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Belum ada data layanan.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800 font-medium">{service.name}</td>
                  <td className="p-4 text-gray-600">Rp {service.price.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-gray-600">{service.duration} Menit</td>
                  <td className="p-4 text-gray-500 text-sm">{service.description}</td>
                  <td className="p-4 flex justify-center space-x-3">
                    <button className="text-blue-500 hover:text-blue-700" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700" title="Hapus">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}