export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
      <p className="text-gray-500 mt-1">Ringkasan operasional BarberOnCall hari ini.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-500">Total Pesanan</span>
          <span className="text-3xl font-bold text-gray-800 mt-2">24</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-500">Pendapatan</span>
          <span className="text-3xl font-bold text-gray-800 mt-2">Rp 1.2M</span>
        </div>
      </div>
    </div>
  );
}