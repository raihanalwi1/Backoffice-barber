import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X, Shield, Search, User, MapPin } from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  region: string | null;
  created_at: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const myRole = localStorage.getItem('adminRole') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'cabang', // Default bikin role cabang
    region: 'Jaktim'
  });

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/admins?role=${myRole}`);
      setAdmins(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Gagal memuat data admin:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      return alert('Semua field wajib diisi lengkap ya bes!');
    }

    try {
      await axios.post('http://localhost:3000/api/admins', formData);
      alert('Mantap! Akun pengelola baru berhasil didaftarkan!');
      setIsFormOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'cabang', region: 'Jaktim' });
      fetchAdmins();
    } catch (error) {
      alert('Gagal menyimpan akun admin baru.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (name === localStorage.getItem('adminName')) {
      return alert('Kagak bisa hapus akun lu sendiri dong cuy! 😂');
    }
    if (!window.confirm(`Yakin mau menghapus hak akses admin untuk "${name}"?`)) return;

    try {
      await axios.delete(`http://localhost:3000/api/admins/${id}`);
      fetchAdmins();
    } catch (error) {
      alert('Gagal menghapus akun admin.');
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Shield className="mr-2 text-blue-600" size={24} />
            Otoritas Akun Pengelola (Backoffice)
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Halaman khusus Superadmin untuk mengatur hak akses tim pusat & cabang.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" placeholder="Cari nama atau role..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            />
          </div>

          <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm text-sm font-medium">
            <Plus size={18} /> <span>Tambah Akses</span>
          </button>
        </div>
      </div>

      {/* MODAL / FORM TAMBAH AKSES ADMIN */}
      {isFormOpen && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-2xl">
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">✨ Daftarkan Akun Pengelola Baru</h2>
            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-full"><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSaveAdmin} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pengelola</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm" placeholder="Contoh: Andi Cabang Jaktim" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Login</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm" placeholder="andi@barber.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm" placeholder="Minimal 6 karakter" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Level Tingkatan (Role)</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm">
                  <option value="cabang">Cabang (Terisolasi Per Region)</option>
                  <option value="admin">Admin Pusat (Full Akses Global)</option>
                  <option value="superadmin">Superadmin (Pemilik Sistem)</option>
                </select>
              </div>

              {/* 📍 Opsi wilayah kerja hanya muncul kalau rolenya 'cabang' */}
              {formData.role === 'cabang' && (
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Wilayah / Penempatan Cabang</label>
                  <select value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm">
                    <option value="Jaktim">Jakarta Timur</option>
                    <option value="Jaksel">Jakarta Selatan</option>
                    <option value="Bogor">Bogor</option>
                    <option value="Bandung">Bandung</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-sm text-gray-700 font-medium bg-gray-100 rounded-xl">Batal</button>
              <button type="submit" className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md">Simpan Hak Akses</button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE DATA ADMIN */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium">Nama Pengelola</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium text-center">Tingkatan / Wilayah</th>
              <th className="p-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Memuat data pengelola...</td></tr>
            ) : filteredAdmins.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Kagak ada data admin pengelola bes.</td></tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm"><User size={16} /></div>
                    <p className="text-gray-800 font-medium">{admin.name}</p>
                  </td>
                  <td className="p-4"><p className="text-gray-600 text-sm">{admin.email}</p></td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        admin.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                        admin.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {admin.role}
                      </span>
                      {admin.role === 'cabang' && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded flex items-center"><MapPin size={10} className="mr-1" /> {admin.region}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(admin.id, admin.name)} 
                      className="text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"
                      title="Cabut Akses Admin"
                    >
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