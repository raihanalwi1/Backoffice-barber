import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Scissors, X, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const SidebarItem = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  // 🛡️ AMBIL ROLE DARI LOCALSTORAGE
  const userRole = localStorage.getItem('adminRole') || '';

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            Barber<span className="text-blue-600">Admin</span>
          </span>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Menu yang tampil untuk semua role */}
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsOpen(false)} />
          <SidebarItem to="/barbers" icon={Users} label="Data Kapster" onClick={() => setIsOpen(false)} />
          
          {/* 🛡️ MENU EKSKLUSIF: Sembunyikan dari admin cabang */}
          {userRole !== 'cabang' && (
            <SidebarItem to="/services" icon={Scissors} label="Menu Layanan" onClick={() => setIsOpen(false)} />
          )}
          {userRole === 'superadmin' && (
            <SidebarItem 
              to="/admins" 
              icon={ShieldAlert} 
              label="Manajemen Admin" 
              onClick={() => setIsOpen(false)} 
            />
          )}
          
          {userRole === 'superadmin' && (
            <SidebarItem 
              to="/costumers" 
              icon={ShieldAlert} 
              label="Data Pelanggan" 
              onClick={() => setIsOpen(false)} 
            />
          )}
        </nav>
        
      </aside>
    </>
  );
}