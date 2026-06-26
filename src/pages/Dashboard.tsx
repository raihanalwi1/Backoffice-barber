import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, Shield, MapPin, TrendingUp, Scissors, ShoppingBag, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBarbers: 0,
    activeBarbers: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🛡️ AMBIL DATA LOGIN
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const userRole = localStorage.getItem('adminRole') || '';
  const adminRegion = localStorage.getItem('adminRegion') || '';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Tarik Data Kapster Sesuai Hak Akses
        const barberRes = await axios.get(`http://localhost:3000/api/barbers?role=${userRole}&region=${adminRegion}`);
        const barbers = barberRes.data.data || [];
        
        const activeCount = barbers.filter((b: any) => b.status === 'Aktif').length;

        let adminCount = 0;
        // 2. Tarik Data Admin (Hanya untuk Superadmin)
        if (userRole === 'superadmin') {
          const adminRes = await axios.get(`http://localhost:3000/api/admins?role=${userRole}`);
          adminCount = adminRes.data.data ? adminRes.data.data.length : 0;
        }

        setStats({
          totalBarbers: barbers.length,
          activeBarbers: activeCount,
          totalAdmins: adminCount
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userRole, adminRegion]);

  return (
    <div className="space-y-8">
      
      {/* 🚀 BANNER SELAMAT DATANG */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20">
          <Scissors size={200} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Halo, {adminName}! 👋</h1>
          <p className="text-blue-100 mb-6 max-w-xl text-sm md:text-base">
            Ringkasan operasional BarberOnCall hari ini. Pantau performa bisnis dan tim tukang cukur terbaikmu dari sini.
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center shadow-sm">
              <Shield size={16} className="mr-2" />
              Role: <span className="uppercase ml-1 text-yellow-300">{userRole}</span>
            </span>
            {userRole === 'cabang' && (
              <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center shadow-sm">
                <MapPin size={16} className="mr-2" />
                Wilayah: <span className="uppercase ml-1 text-green-300">{adminRegion}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 💰 BAGIAN 1: RINGKASAN BISNIS (DARI KODINGAN ASLI LU) */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-blue-600" size={20} />
          Ringkasan Bisnis Hari Ini
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-500">Total Pesanan</span>
              <div className="text-3xl font-bold text-gray-800 mt-2">24 <span className="text-sm font-medium text-green-500">+3 Hari ini</span></div>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={24} className="text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-500">Pendapatan</span>
              <div className="text-3xl font-bold text-gray-800 mt-2">Rp 1.2M</div>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 👥 BAGIAN 2: RINGKASAN TIM KAPSTER (DINAMIS DARI DATABASE) */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Users className="mr-2 text-blue-600" size={20} />
          Ringkasan Tim {userRole === 'cabang' && `Wilayah ${adminRegion}`}
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse h-28"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-gray-500">Total Kapster Terdaftar</span>
              <span className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBarbers} <span className="text-sm font-normal text-gray-400">Orang</span></span>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-gray-500 flex items-center"><UserCheck size={16} className="mr-1 text-green-500" /> Kapster Aktif / Siap</span>
              <span className="text-3xl font-bold text-gray-800 mt-2">{stats.activeBarbers} <span className="text-sm font-normal text-gray-400">Orang</span></span>
            </div>

            {/* Total Admin (Hanya Superadmin yang bisa lihat ini) */}
            {userRole === 'superadmin' && (
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col border-l-4 border-l-purple-500">
                <span className="text-sm font-medium text-gray-500 flex items-center"><Shield size={16} className="mr-1 text-purple-500" /> Total Akun Pengelola</span>
                <span className="text-3xl font-bold text-gray-800 mt-2">{stats.totalAdmins} <span className="text-sm font-normal text-gray-400">Akun</span></span>
              </div>
            )}
            
          </div>
        )}
      </div>

    </div>
  );
}