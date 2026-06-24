import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, UserCheck, UserX, MapPin, Eye, Search, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import imageCompression from 'browser-image-compression';

// 🛠️ FIX IKON MARKER LEAFLET
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Barber {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  lat: number;
  lng: number;
  ktp_image: string;
  certificate_image: string;
  instagram: string;
  bank_account: string;
  created_at?: string; // 📅 Tambahan patokan waktu join
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailBarber, setDetailBarber] = useState<Barber | null>(null); 
  
  // 🔍 State buat Fitur Search & Limit Data
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsLimit, setItemsLimit] = useState<number>(10);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'Aktif',
    lat: -6.225017,
    lng: 106.900447,
    ktp_image: '',
    certificate_image: '',
    instagram: '',
    bank_account: ''
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
    const interval = setInterval(() => fetchBarbers(), 10000);
    return () => clearInterval(interval);
  }, []);

  // ⚙️ FUNGSI SAKTI: NGITUNG PENGALAMAN OTOMATIS BERDASARKAN TAHUN DAFTAR
  const calculateExperience = (createdAt?: string) => {
    if (!createdAt) return 0; // Kalau data lama belum punya created_at, anggap 0
    const joinYear = new Date(createdAt).getFullYear();
    const currentYear = new Date().getFullYear();
    const exp = currentYear - joinYear;
    return exp > 0 ? exp : 0; // Ga boleh minus
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      return alert('Cuma boleh upload file JPG atau PNG ya bes!');
    }
    if (file.size > 5 * 1024 * 1024) {
      return alert('Ukuran file kegedean! Maksimal 5MB bes!');
    }

    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
    } catch (error) {
      console.error(error);
      alert('Waduh, gagal mengkompresi gambar nih.');
    }
  };

  const handleSaveBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.length < 10 || !formData.email.trim()) {
      alert('Nama, Email harus diisi, dan Nomor HP minimal 10 digit ya bes!');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        experience: 0, // Sengaja kirim 0 biar ga ngerusak DB lama, karena sekarang dihitung otomatis
        status: formData.status,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        ktp_image: formData.ktp_image,
        certificate_image: formData.certificate_image,
        instagram: formData.instagram.trim(),
        bank_account: formData.bank_account.trim()
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
      fetchBarbers();
    } catch (error) {
      alert('Gagal menghapus data kapster.');
    }
  };

  const openEditForm = (barber: Barber) => {
    setEditingId(barber.id);
    setFormData({
      name: barber.name,
      phone: barber.phone,
      email: barber.email || '',
      status: barber.status,
      lat: Number(barber.lat) || -6.225017,
      lng: Number(barber.lng) || 106.900447,
      ktp_image: barber.ktp_image || '',
      certificate_image: barber.certificate_image || '',
      instagram: barber.instagram || '',
      bank_account: barber.bank_account || ''
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ 
      name: '', phone: '', email: '', status: 'Aktif', 
      lat: -6.225017, lng: 106.900447, 
      ktp_image: '', certificate_image: '', instagram: '', bank_account: '' 
    });
  };

  // 🎯 LOGIKA FILTER & SEARCH
  const filteredBarbers = barbers.filter(barber => 
    barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barber.phone.includes(searchTerm) ||
    barber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Potong array sesuai limit yang dipilih admin
  const displayedBarbers = itemsLimit === 0 ? filteredBarbers : filteredBarbers.slice(0, itemsLimit);

  return (
    <div className="space-y-6">
      
      {/* 🗺️ MASTER MAP DI ATAS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <MapPin className="mr-2 text-blue-600" size={20} />
          Peta Persebaran Kapster Aktif
        </h2>
        <div className="h-[350px] w-full rounded-xl overflow-hidden border border-gray-300 relative z-0">
          <MapContainer center={[-6.225017, 106.900447]} zoom={11} className="h-full w-full absolute inset-0">
            <TileLayer 
              attribution='© OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            />
            {!loading && barbers
              .filter((barber) => barber.status === 'Aktif')
              .map((barber) => (
                <Marker key={barber.id} position={[Number(barber.lat), Number(barber.lng)]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 text-sm mb-1">{barber.name}</p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Aktif</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* HEADER DAFTAR KAPSTER & SEARCH BAR */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Daftar Kapster</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola {filteredBarbers.length} data tukang cukur BarberOnCall.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Fitur Search */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama, email, no HP..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
            />
          </div>

          {/* Fitur Limit */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={itemsLimit} 
              onChange={(e) => setItemsLimit(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto"
            >
              <option value={10}>10 Baris</option>
              <option value={50}>50 Baris</option>
              <option value={100}>100 Baris</option>
              <option value={0}>Semua Data</option>
            </select>
          </div>

          {!isFormOpen && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm w-full sm:w-auto"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Tambah</span>
            </button>
          )}
        </div>
      </div>

      {/* FORM TAMBAH/EDIT */}
      {isFormOpen && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 max-w-5xl">
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? '📝 Edit Data Kapster' : '✨ Tambah Akun Kapster Baru'}
              </h2>
            </div>
            <button onClick={closeForm} className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSaveBarber} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Kolom Kiri */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-gray-700 border-b pb-2">Informasi Dasar</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" required maxLength={50} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" placeholder="Contoh: Budi Santoso" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Login</label>
                  <input type="email" required maxLength={50} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" placeholder="Contoh: budi@barber.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                  <input type="tel" required minLength={10} maxLength={14} value={formData.phone} onInput={(e: React.FormEvent<HTMLInputElement>) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" placeholder="081234567890" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram (@)</label>
                    <input type="text" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" placeholder="budi_cukur" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Rekening</label>
                    <input type="text" value={formData.bank_account} onChange={(e) => setFormData({...formData, bank_account: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" placeholder="BCA 12345678" />
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-gray-700 border-b pb-2">Status & Dokumen</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status Kapster</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm">
                    <option value="Aktif">🟢 Aktif (Siap)</option>
                    <option value="Nonaktif">🔴 Nonaktif (Cuti)</option>
                  </select>
                </div>

                {/* Upload KTP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Upload KTP (JPG/PNG max 5MB)</label>
                  <div className="flex items-center space-x-3">
                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e, 'ktp_image')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" />
                    {formData.ktp_image && <img src={formData.ktp_image} alt="Preview KTP" className="h-10 w-10 object-cover rounded-lg border border-gray-300 shadow-sm" />}
                  </div>
                </div>

                {/* Upload Sertifikat */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Sertifikat Cukur (Opsional)</label>
                  <div className="flex items-center space-x-3">
                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e, 'certificate_image')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors" />
                    {formData.certificate_image && <img src={formData.certificate_image} alt="Preview Sertifikat" className="h-10 w-10 object-cover rounded-lg border border-gray-300 shadow-sm" />}
                  </div>
                </div>

                {/* Input Manual Koordinat */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mt-4">
                  <p className="text-xs text-gray-500 mb-3 font-medium">Titik Lokasi Basecamp (Opsional)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Latitude</label>
                      <input type="number" step="any" value={formData.lat} onChange={(e) => setFormData({...formData, lat: e.target.value ? Number(e.target.value) : 0})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1 uppercase tracking-wider">Longitude</label>
                      <input type="number" step="any" value={formData.lng} onChange={(e) => setFormData({...formData, lng: e.target.value ? Number(e.target.value) : 0})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-4">
              <button type="button" onClick={closeForm} className="px-5 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
              <button type="submit" className="px-5 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all">
                {editingId ? 'Update Data' : 'Simpan Kapster'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 LIST DATA TUKANG CUKUR DENGAN FITUR SEARCH & LIMIT */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium w-1/3">Info Kapster</th>
              <th className="p-4 font-medium w-1/3">Kontak & Info</th>
              <th className="p-4 font-medium text-center w-1/6">Status</th>
              <th className="p-4 font-medium text-center w-1/6">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
            ) : displayedBarbers.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Kagak nemu data kapster bes.</td></tr>
            ) : (
              displayedBarbers.map((barber) => (
                <tr key={barber.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="text-gray-800 font-medium">{barber.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{barber.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-600 text-sm">{barber.phone}</p>
                    {/* NGITUNG PENGALAMAN OTOMATIS */}
                    <p className="text-gray-400 text-xs mt-1">{calculateExperience(barber.created_at)} Tahun Pengalaman</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${barber.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {barber.status === 'Aktif' ? <UserCheck size={14} /> : <UserX size={14} />}
                      <span>{barber.status}</span>
                    </span>
                  </td>
                  <td className="p-4 flex justify-center space-x-2">
                    <button onClick={() => setDetailBarber(barber)} className="text-green-600 p-1.5 hover:bg-green-50 rounded" title="Lihat Detail Data"><Eye size={18} /></button>
                    <button onClick={() => openEditForm(barber)} className="text-blue-500 p-1.5 hover:bg-blue-50 rounded" title="Edit Data"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(barber.id, barber.name)} className="text-red-500 p-1.5 hover:bg-red-50 rounded" title="Hapus"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔍 MODAL DETAIL DATA KAPSTER */}
      {detailBarber && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex justify-center items-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Detail Profil Kapster</h2>
              <button onClick={() => setDetailBarber(null)} className="text-gray-400 hover:text-red-500 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Nama Lengkap</p>
                  <p className="font-semibold text-lg text-gray-800">{detailBarber.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status Bekerja</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${detailBarber.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {detailBarber.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                  <p className="font-medium text-gray-800">{detailBarber.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">No. WhatsApp</p>
                  <p className="font-medium text-gray-800">{detailBarber.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Pengalaman</p>
                  {/* NGITUNG PENGALAMAN OTOMATIS DI MODAL */}
                  <p className="font-medium text-gray-800">{calculateExperience(detailBarber.created_at)} Tahun</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Instagram</p>
                  <p className="font-medium text-pink-600">{detailBarber.instagram ? `@${detailBarber.instagram}` : '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Nomor Rekening</p>
                  <p className="font-mono text-sm text-gray-800 bg-gray-100 p-2.5 rounded-lg inline-block border border-gray-200">
                    {detailBarber.bank_account || 'Belum diisi'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3 flex items-center"><UserCheck size={16} className="mr-2 text-blue-500"/> Foto KTP</p>
                  {detailBarber.ktp_image ? (
                    <a href={detailBarber.ktp_image} target="_blank" rel="noopener noreferrer">
                      <img src={detailBarber.ktp_image} alt="KTP" className="w-full rounded-xl border border-gray-200 object-cover hover:opacity-90 transition-opacity bg-gray-50 h-48 cursor-pointer shadow-sm" title="Klik untuk perbesar" />
                    </a>
                  ) : (
                    <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm">Belum ada foto KTP</div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3 flex items-center"><UserCheck size={16} className="mr-2 text-green-500"/> Sertifikat Cukur</p>
                  {detailBarber.certificate_image ? (
                    <a href={detailBarber.certificate_image} target="_blank" rel="noopener noreferrer">
                      <img src={detailBarber.certificate_image} alt="Sertifikat" className="w-full rounded-xl border border-gray-200 object-cover hover:opacity-90 transition-opacity bg-gray-50 h-48 cursor-pointer shadow-sm" title="Klik untuk perbesar" />
                    </a>
                  ) : (
                    <div className="h-48 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm">Belum ada Sertifikat</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setDetailBarber(null)} className="px-6 py-2.5 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors shadow-md">Tutup Detail</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}