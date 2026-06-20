import { Menu, Bell, UserCircle } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-800 focus:outline-none p-2 -ml-2"
        >
          <Menu size={24} />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer border border-gray-200">
          <UserCircle size={24} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}