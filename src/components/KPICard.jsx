import { Users, Settings, List, Info } from 'lucide-react';

const iconMap = {
  users: Users,
  settings: Settings,
  list: List,
  info: Info
};

const colorMap = {
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  purple: 'text-purple-600 bg-purple-100',
  orange: 'text-orange-600 bg-orange-100'
};

export function KPICard({ title, value, icon, color = 'blue', subtitle }) {
  const IconComponent = iconMap[icon] || Users;
  const colorClasses = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

