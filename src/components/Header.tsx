import React from 'react';
import { Menu, Bell, UserCircle, LogOut } from 'lucide-react'; // 📦 Tambahin import LogOut

interface HeaderProps {
  onMenuClick: () => void;
}
// Di dalam komponen Header.tsx
const adminName = localStorage.getItem('adminName');
const adminRole = localStorage.getItem('adminRole');
export default function Header({ onMenuClick }: HeaderProps) {
  
  // 🚪 FUNGSI LOGOUT SAKTI
  const handleLogout = () => {
    const isConfirm = window.confirm('Yakin mau keluar dari Backoffice bes?');
    if (isConfirm) {
      localStorage.removeItem('isAdminLoggedIn'); // Buang token login
      window.location.href = '/login'; // Tendang ke halaman login
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      
      {/* Kiri: Tombol Menu (Mobile) */}
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-800 focus:outline-none p-2 -ml-2"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Kanan: Notifikasi & Profil/Logout */}
      <div className="flex items-center space-x-4 md:space-x-5">
        
        {/* Tombol Lonceng */}
        <button className="text-gray-400 hover:text-gray-600 relative" title="Notifikasi">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Garis Pembatas */}
        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

        {/* Area Profil & Logout */}
        <div className="flex items-center space-x-4">
          <p className="text-sm font-bold text-gray-800">{adminName}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold">{adminRole}</p>
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer border border-gray-200">
            
            <UserCircle size={24} className="text-gray-500" />
          </div>
          
          {/* Tombol Logout Merah */}
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
            title="Keluar dari sistem"
          >
            <LogOut size={18} />
            <span className="hidden md:block text-sm font-medium">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}