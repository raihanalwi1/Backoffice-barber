import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/services');
      const actualData = response.data.data ? response.data.data : response.data;
      setServices(actualData);
      setLoading(false);
    } catch (error) {
      console.error('Gagal narik data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        duration: Number(formData.duration),
        description: formData.description
      };

      if (editingId) {
        await axios.put(`http://localhost:3000/api/services/${editingId}`, payload);
        alert('Data layanan berhasil diupdate!');
      } else {
        await axios.post('http://localhost:3000/api/services', payload);
        alert('Mantap! Layanan baru berhasil ditambah!');
      }
      
      closeForm();
      fetchServices();
    } catch (error) {
      console.error('Gagal simpan layanan:', error);
      alert('Waduh, gagal menyimpan data nih.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    const isConfirm = window.confirm(`Yakin mau menghapus layanan "${name}"?`);
    if (!isConfirm) return;

    try {
      await axios.delete(`http://localhost:3000/api/services/${id}`);
      alert('Layanan berhasil dihapus!');
      fetchServices();
    } catch (error) {
      console.error('Gagal hapus layanan:', error);
      alert('Gagal menghapus data layanan.');
    }
  };

  const openEditForm = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: service.description
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', price: '', duration: '', description: '' });
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen Layanan</h1>
          <p className="text-gray-500 mt-1">Atur menu potongan rambut dan harga di sini.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Layanan</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId ? '📝 Edit Data Layanan' : '✨ Buat Layanan Baru'}
            </h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSaveService} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Layanan</label>
                  <input 
                    type="text" required
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                    placeholder="Contoh: Cukur Fade Premium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp)</label>
                    <input 
                      type="number" required
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Durasi (Menit)</label>
                    <input 
                      type="number" required
                      value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all shadow-sm text-sm"
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>

              {/* BUNGKUSAN EDITOR: Ditambahin trik Flexbox & Scroll di sini biar header nempel */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Lengkap</label>
                <div className="bg-white rounded-xl border border-gray-300 overflow-hidden h-[220px] [&>.quill]:flex [&>.quill]:flex-col [&>.quill]:h-full [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:shrink-0 [&_.ql-container]:flex-1 [&_.ql-container]:overflow-y-auto">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.description} 
                    onChange={(value) => setFormData({...formData, description: value})}
                    placeholder="Tulis detailnya pake bold atau list di sini..."
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-2">
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
                {editingId ? 'Update Data' : 'Simpan Data'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium w-1/4">Nama Layanan</th>
              <th className="p-4 font-medium w-1/6">Harga</th>
              <th className="p-4 font-medium w-1/6">Durasi</th>
              <th className="p-4 font-medium w-1/3">Deskripsi</th>
              <th className="p-4 font-medium text-center w-1/12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data layanan.</td></tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800 font-medium">{service.name}</td>
                  <td className="p-4 text-gray-600">Rp {service.price.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-gray-600">{service.duration} Menit</td>
                  <td className="p-4 text-gray-500 text-sm">
                    <div 
                      className="line-clamp-2 max-w-sm prose prose-sm text-gray-500" 
                      title={stripHtml(service.description)}
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                  </td>
                  <td className="p-4 flex justify-center space-x-3">
                    <button onClick={() => openEditForm(service)} className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(service.id, service.name)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded" title="Hapus">
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