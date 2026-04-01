
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analytics';
import { Users, Store, DollarSign, Activity } from 'lucide-react';
import { fetchAdminOverview, fetchAdminTimeSeries, fetchAdminCategories } from '../services/api';
import KpiCard from '../components/KpiCard';
import LineChart from '../components/LineChart';
import DoughnutChart from '../components/DoughnutChart';
import { ChartData } from 'chart.js';

const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      if (!isLoading) {
        if (!user || user.role !== 'admin') {
          navigate('/');
          return;
        }
        
        setIsDataLoading(true);
        try {
          const [overview, ts, cats] = await Promise.all([
            fetchAdminOverview(user.role),
            fetchAdminTimeSeries(user.role),
            fetchAdminCategories(user.role)
          ]);
          setStats(overview);
          setTimeSeries(ts);
          setCategories(cats);
        } catch (err) {
          console.error(err);
        } finally {
          setIsDataLoading(false);
        }
      }
    };
    loadAdminData();
  }, [user, isLoading, navigate]);

  if (isLoading || isDataLoading || !stats) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-10"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  );

  // Prepare Chart Data
  const lineChartData: ChartData<'line'> = {
    labels: timeSeries.map(d => new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })).reverse(),
    datasets: [
      {
        label: 'New Users',
        data: timeSeries.map(d => d.count).reverse(),
        borderColor: '#ef4444', // primary color (red-500)
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const doughnutChartData: ChartData<'doughnut'> = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.count),
        backgroundColor: [
          '#ef4444', // Red
          '#f59e0b', // Amber
          '#10b981', // Emerald
          '#3b82f6', // Blue
          '#8b5cf6', // Violet
          '#ec4899', // Pink
        ],
        borderWidth: 0,
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Admin Overview</h1>
        <p className="text-gray-500">System performance and business metrics.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users}
          trend={stats.trends.users}
        />
        <KpiCard 
          title="Active Businesses" 
          value={stats.activeBusinesses.toLocaleString()} 
          icon={Store}
          trend={stats.trends.business}
          subValue={`Total: ${stats.totalBusinesses}`}
        />
        <KpiCard 
          title="Monthly Revenue" 
          value={`₦${stats.monthlyRevenue.toLocaleString()}`} 
          icon={DollarSign}
          trend={stats.trends.revenue}
          subValue={`Total: ₦${stats.totalRevenue.toLocaleString()}`}
        />
         <KpiCard 
          title="Real-time Active" 
          value={stats.activeUsersNow} 
          icon={Activity}
          subValue="Users online now"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">
           <div className="h-80">
            <LineChart data={lineChartData} title="User Growth (30 Days)" />
           </div>
        </div>
        <div className="glass-card p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">
          <div className="h-80">
            <DoughnutChart data={doughnutChartData} title="Business Categories" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
