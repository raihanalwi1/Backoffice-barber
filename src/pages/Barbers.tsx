import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, UserCheck, UserX } from 'lucide-react';

interface Barber {
  id: number;
  name: string;
  phone: string;
  email: string;
  experience: number;
  status: string;
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    status: 'Aktif'
  });

  const fetchBarbers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/barbers');
      const actualData = response.data.data ? response.data.data : response.data;
      setBarbers(actualData);
      setLoading(false);
    } catch (error) {
      console.error('Gagal narik data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const handleSaveBarber = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 VALIDASI EKSTRA: Cek kalau user cuma nginput spasi kosong doang
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      alert('Waduh, data nggak boleh kosong atau cuma spasi doang bes!');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(), // trim() buat motong spasi berlebih di awal/akhir
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        experience: Number(formData.experience),
        status: formData.status
      };

      if (editingId) {
        await axios.put(`http://localhost:3000/api/barbers/${editingId}`, payload);
        alert('Data kapster berhasil diupdate!');
      } else {
        await axios.post('http://localhost:3000/api/barbers', payload);
        alert('Mantap! Akun kapster baru berhasil dibuat!');
      }
      
      closeForm();
      fetchBarbers();
    } catch (error) {
      console.error('Gagal simpan kapster:', error);
      alert('Waduh, gagal menyimpan data nih.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const isConfirm = window.confirm(`Yakin mau menghapus kapster "${name}"?`);
    if (!isConfirm) return;

    try {
      await axios.delete(`http://localhost:3000/api/barbers/${id}`);
      alert('Data kapster berhasil dihapus!');
      fetchBarbers();
    } catch (error) {
      console.error('Gagal hapus kapster:', error);
      alert('Gagal menghapus data kapster.');
    }
  };

  const openEditForm = (barber: Barber) => {
    setEditingId(barber.id);
    setFormData({
      name: barber.name,
      phone: barber.phone,
      email: barber.email || '',
      experience: barber.experience.toString(),
      status: barber.status
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', phone: '', email: '', experience: '', status: 'Aktif' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen Kapster</h1>
          <p className="text-gray-500 mt-1">Atur data tim tukang cukur BarberOnCall lu di sini.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Kapster</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? '📝 Edit Data Kapster' : '✨ Tambah Akun Kapster Baru'}
              </h2>
              {!editingId && (
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  *Password default otomatis diset: <span className="bg-blue-100 px-1 rounded">barber123</span>
                </p>
              )}
            </div>
            <button onClick={closeForm} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSaveBarber} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" required
                    maxLength={50} // 🔒 Max 50 karakter
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Login (Aplikasi Barber)</label>
                  <input 
                    type="email" required
                    maxLength={50} // 🔒 Max 50 karakter
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                    placeholder="Contoh: budi@barber.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                  <input 
                    type="tel" required
                    minLength={10}
                    maxLength={14}
                    value={formData.phone} 
                    onChange={(e) => {
                        // 🔒 RESTRUKTUR: Cuma boleh input angka (0-9)
                        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({...formData, phone: onlyNums});
                    }}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                    placeholder="Contoh: 081234567890"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pengalaman (Tahun)</label>
                    <input 
                      type="number" required 
                      min="0" // 🔒 Nggak boleh minus
                      max="50" // 🔒 Maksimal 50 tahun (biar masuk akal)
                      value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                      placeholder="Contoh: 5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status Kapster</label>
                    <select
                      value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                    >
                      <option value="Aktif">🟢 Aktif (Siap)</option>
                      <option value="Nonaktif">🔴 Nonaktif (Cuti)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button 
                type="button" onClick={closeForm}
                className="px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                {editingId ? 'Update Data' : 'Simpan & Buat Akun'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium w-1/4">Info Kapster</th>
              <th className="p-4 font-medium w-1/4">Kontak</th>
              <th className="p-4 font-medium w-1/6">Pengalaman</th>
              <th className="p-4 font-medium w-1/6">Status</th>
              <th className="p-4 font-medium text-center w-1/12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
            ) : barbers.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data kapster.</td></tr>
            ) : (
              barbers.map((barber) => (
                <tr key={barber.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="text-gray-800 font-medium">{barber.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{barber.email || 'Email belum diatur'}</p>
                  </td>
                  <td className="p-4 text-gray-600">{barber.phone}</td>
                  <td className="p-4 text-gray-600">{barber.experience} Tahun</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      barber.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {barber.status === 'Aktif' ? <UserCheck size={14} /> : <UserX size={14} />}
                      <span>{barber.status}</span>
                    </span>
                  </td>
                  <td className="p-4 flex justify-center space-x-3">
                    <button onClick={() => openEditForm(barber)} className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(barber.id, barber.name)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded" title="Hapus">
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