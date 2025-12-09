
import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subValue?: string;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, trend, subValue, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className="p-2 bg-gray-700/50 rounded-lg text-gray-400">
            <Icon size={18} />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-white mb-1">{value}</div>
          {subValue && <div className="text-xs text-gray-500">{subValue}</div>}
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
