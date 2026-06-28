import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search } from 'lucide-react';

interface UserCustomer {
  id: number;
  nama: string;
  nomor_hp: string;
  email: string;
  created_at: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<UserCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const userRole = localStorage.getItem('adminRole') || '';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Nembak ke API users yang baru
        const response = await axios.get(`http://localhost:3000/api/users?role=${userRole}`);
        setCustomers(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Gagal narik data customer:', error);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [userRole]);

  const filteredCustomers = customers.filter(c => 
    c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nomor_hp.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Users className="mr-2 text-blue-600" size={24} />
            Data Pelanggan (Users)
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Daftar pengguna terdaftar di sistem BarberOnCall.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" placeholder="Cari nama atau no HP..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium">Nama Pelanggan</th>
              <th className="p-4 font-medium">Kontak (HP & Email)</th>
              <th className="p-4 font-medium">Tanggal Mendaftar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center text-gray-500">Memuat data pengguna...</td></tr>
            ) : filteredCustomers.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-gray-500">Kagak ada data pengguna bes.</td></tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{customer.nama}</td>
                  <td className="p-4">
                    <p className="text-sm text-gray-800">{customer.nomor_hp}</p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(customer.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}