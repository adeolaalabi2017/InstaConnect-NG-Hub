import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analytics';
import { Users, Store, DollarSign, Activity, FileText, TrendingUp, Clock, Server, Globe } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import LineChart from '../components/LineChart';
import DoughnutChart from '../components/DoughnutChart';
import DataTable from '../components/DataTable';
import DateRangePicker from '../components/DateRangePicker';
import { ChartData } from 'chart.js';

const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]); // Mock list

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/');
        return;
      }

      try {
        const overview = analyticsService.getAdminOverview(user.role);
        setStats(overview);
        const ts = analyticsService.getNewUsersTimeSeries(user.role);
        setTimeSeries(ts);
        const cats = analyticsService.getBusinessCategoryDistribution(user.role);
        setCategories(cats);

        // Mock Pending List (Simulating fetch)
        setPendingSubmissions([
          { id: '1', name: 'Lgos Fashion Hub', category: 'Fashion', submitted: '2 hours ago', status: 'Pending' },
          { id: '2', name: 'Mama Put Delight', category: 'Food', submitted: '5 hours ago', status: 'Pending' },
          { id: '3', name: 'Tech Solutions Ltd', category: 'Technology', submitted: '1 day ago', status: 'Pending' },
        ]);

      } catch (err) {
        console.error(err);
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !stats) return <div className="p-10 text-center text-white">Loading Admin Panel...</div>;

  // Prepare Chart Data
  const lineChartData: ChartData<'line'> = {
    labels: timeSeries.map(d => new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })).reverse(),
    datasets: [
      {
        label: 'New Users',
        data: timeSeries.map(d => d.count).reverse(),
        borderColor: '#10b981', // Emerald 500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Active Businesses',
        data: timeSeries.map(d => d.count * 0.5 + 2).reverse(), // Mock second dataset
        borderColor: '#3b82f6', // Blue 500
        backgroundColor: 'transparent',
        borderDash: [5, 5],
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
          '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'
        ],
        borderWidth: 0,
      }
    ]
  };

  // Columns for Data Table
  const pendingColumns = [
    { key: 'name', header: 'Business Name', render: (row: any) => <div className="font-semibold">{row.name}</div> },
    { key: 'category', header: 'Category' },
    { key: 'submitted', header: 'Submitted' },
    {
      key: 'status',
      header: 'Status',
      render: () => <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">Pending Analysis</span>
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search Bar could go here */}
          <DateRangePicker startDate={new Date()} endDate={new Date()} onChange={() => console.log('Date range changed')} />
          <button className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Row 1: Key Metrics (Business & Sales) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          subValue={`+₦${stats.monthlyRevenue.toLocaleString()} this month`}
          icon={DollarSign}
          trend={stats.trends.revenue}
          className="bg-gray-900"
        />
        <KpiCard
          title="Active Users"
          value={stats.activeUsersNow}
          subValue="Online right now"
          icon={Activity}
          trend={stats.trends.users} // Using users trend as proxy
          className="bg-gray-900"
        />
        <KpiCard
          title="Total Listings"
          value={stats.totalBusinesses}
          subValue={`${stats.newBusinesses} new in 30 days`}
          icon={Store}
          trend={stats.trends.business}
          className="bg-gray-900"
        />
        <KpiCard
          title="Retention Rate"
          value={`${stats.userRetentionRate.value}%`}
          subValue="Returning users"
          icon={TrendingUp}
          trend={{ value: stats.userRetentionRate.trend, isPositive: true }}
          className="bg-gray-900"
        />
      </div>

      {/* Row 2: Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Line Chart */}
        <div className="lg:col-span-2 glass-card bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">User & Traffic Growth</h3>
            <div className="flex gap-2">
              <button className="text-xs bg-gray-800 text-white px-3 py-1 rounded-md">Weekly</button>
              <button className="text-xs text-gray-400 hover:text-white px-3 py-1">Monthly</button>
            </div>
          </div>
          <div className="h-72">
            <LineChart data={lineChartData} title="" />
          </div>
        </div>

        {/* Categories Doughnut */}
        <div className="glass-card bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Market Share</h3>
          <div className="h-64 relative">
            <DoughnutChart data={doughnutChartData} title="" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
                <div className="text-xs text-gray-500">Listings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Platform Performance & Detailed Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tech/Platform Metrics */}
        <div className="space-y-6">
          <div className="glass-card bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Clock size={16} /></div>
                  <span className="text-sm text-gray-400">Avg. Load Time</span>
                </div>
                <span className="font-semibold text-green-400">{stats.averagePageLoadTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Server size={16} /></div>
                  <span className="text-sm text-gray-400">Server Uptime</span>
                </div>
                <span className="font-semibold text-white">{stats.serverUptime}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Globe size={16} /></div>
                  <span className="text-sm text-gray-400">Top Source</span>
                </div>
                <span className="font-semibold text-white">Organic Search</span>
              </div>
            </div>
          </div>

          <div className="glass-card bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Total Reviews</span>
              <span className="font-bold">{stats.totalReviews}</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-500 h-full" style={{ width: '65%' }}></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{stats.newReviews} new reviews this month</div>
          </div>
        </div>

        {/* Pending Submissions Table */}
        <div className="lg:col-span-2 glass-card bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Pending Business Approvals</h3>
            <button className="text-sm text-primary hover:text-white transition-colors">View All</button>
          </div>
          <DataTable
            columns={pendingColumns}
            data={pendingSubmissions}
            onApprove={(row) => {
              alert(`Approved ${row.name}`);
              setPendingSubmissions(prev => prev.filter(p => p.id !== row.id));
            }}
            onReject={(row) => {
              if (confirm(`Reject ${row.name}?`)) {
                setPendingSubmissions(prev => prev.filter(p => p.id !== row.id));
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
