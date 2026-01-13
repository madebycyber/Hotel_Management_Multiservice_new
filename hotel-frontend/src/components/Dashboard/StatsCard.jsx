export default function StatsCard({ title, value, change, color }) {
  const isPositive = change.startsWith('+');
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 ${color}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className={`text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change} so với tuần trước
      </p>
    </div>
  );
}