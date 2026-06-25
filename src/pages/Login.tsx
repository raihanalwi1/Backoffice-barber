import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Nanti lu bisa ganti ini nembak ke API lu beneran
      // Contoh: const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      // ⚠️ INI DUMMY LOGIN BUAT TES SEMENTARA
      setTimeout(() => {
        if (email === 'admin@barber.com' && password === 'admin123') {
          // Simpan token/tanda kalau udah login ke LocalStorage
          localStorage.setItem('isAdminLoggedIn', 'true');
          // Lempar ke halaman utama (Barbers)
          window.location.href = '/'; 
        } else {
          setErrorMsg('Email atau password salah bes!');
          setLoading(false);
        }
      }, 1000); // delay 1 detik biar ada efek loading
      
    } catch (error) {
      setErrorMsg('Gagal koneksi ke server.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Login */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="bg-white/20 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Barber Backoffice</h2>
          <p className="text-blue-100 text-sm mt-1">Silakan login untuk kelola sistem</p>
        </div>

        {/* Form Login */}
        <div className="p-8">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Admin</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                  placeholder="admin@barber.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold flex justify-center items-center space-x-2 transition-all shadow-md ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Masuk Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>
        
      </div>
      <p className="mt-8 text-sm text-gray-400 font-medium text-center">
        &copy; {new Date().getFullYear()} BarberOnCall Admin. All rights reserved.
      </p>
    </div>
  );
}