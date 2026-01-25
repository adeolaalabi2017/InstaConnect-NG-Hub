
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analytics';
import { 
  TrendingUp, TrendingDown, CreditCard, MoreHorizontal, 
  ArrowUpRight, ArrowDownRight, Activity, DollarSign 
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend, ArcElement, BarElement, Filler 
} from 'chart.js';
import { MOCK_BUSINESSES, MOCK_REVIEWS } from '../../constants';

// Register ChartJS
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, ArcElement, BarElement, Filler
);

// --- Small Components ---

const CircularProgress = ({ value, color, icon: Icon, label }: { value: number, color: string, icon: any, label: string }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                    <circle cx="48" cy="48" r={radius} stroke={color} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <Icon size={20} />
                </div>
            </div>
            <div className="text-center">
                <div className="font-bold text-slate-900 dark:text-white">{value}%</div>
                <div className="text-xs text-gray-500">{label}</div>
            </div>
        </div>
    );
};

const MiniLineChart = ({ data, color }: { data: number[], color: string }) => {
    const chartData = {
        labels: data.map((_, i) => i),
        datasets: [{
            data,
            borderColor: color,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
            fill: true,
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 100);
                gradient.addColorStop(0, color + '40'); // 25% opacity
                gradient.addColorStop(1, color + '00'); // 0% opacity
                return gradient;
            }
        }]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
    };
    return <Line data={chartData} options={options} />;
};

const AdminOverview: React.FC = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/');
            return;
        }
        try {
            const overview = analyticsService.getAdminOverview('admin');
            setStats(overview);
            const cats = analyticsService.getBusinessCategoryDistribution('admin');
            setCategories(cats);
        } catch (err) { console.error(err); }
    }, [user, isLoading, navigate]);

    if (isLoading || !stats) return <div className="p-10">Loading...</div>;

    // --- Chart Data Configs ---
    
    // Doughnut (Categories)
    const doughnutData = {
        labels: categories.slice(0, 4).map(c => c.name),
        datasets: [{
            data: categories.slice(0, 4).map(c => c.count),
            backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    // Bar (Daily Activity - Dissection)
    const barData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Views',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: '#6366f1',
                borderRadius: 20,
                barThickness: 8,
            },
            {
                label: 'Clicks',
                data: [28, 48, 40, 19, 86, 27, 90],
                backgroundColor: '#e2e8f0', // slate-200
                borderRadius: 20,
                barThickness: 8,
            }
        ]
    };

    // Main Line Chart (Income/Expenses)
    const mainChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 19000, 3000, 5000, 2000, 3000, 15000, 25000, 20000, 35000, 28000, 45000],
                borderColor: '#6366f1', // Indigo
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, '#6366f150');
                    gradient.addColorStop(1, '#6366f100');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6
            },
            {
                label: 'Cost',
                data: [8000, 12000, 8000, 12000, 18000, 12000, 22000, 15000, 28000, 20000, 35000, 30000],
                borderColor: '#ec4899', // Pink
                borderDash: [5, 5],
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6
            }
        ]
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-10">
            
            {/* --- COLUMN 1 --- */}
            <div className="space-y-8">
                
                {/* Total Revenue Card */}
                <div className="bg-white dark:bg-[#151923] p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₦{stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                            <TrendingUp size={14} className="mr-1" /> +12%
                        </div>
                    </div>
                    <div className="h-16">
                        <MiniLineChart data={[10, 25, 15, 30, 12, 40, 20, 50]} color="#6366f1" />
                    </div>
                </div>

                {/* Total Expenses Card */}
                <div className="bg-white dark:bg-[#151923] p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Marketing Spend</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₦854,000</h3>
                        </div>
                        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                            <TrendingDown size={14} className="mr-1" /> -5%
                        </div>
                    </div>
                    <div className="h-16">
                        <MiniLineChart data={[40, 20, 35, 10, 30, 15, 25, 10]} color="#ec4899" />
                    </div>
                </div>

                {/* Translations (Reviews) List */}
                <div className="bg-white dark:bg-[#151923] p-6 rounded-3xl shadow-sm h-[320px] overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Recent Reviews</h3>
                        <button className="text-indigo-500 text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {MOCK_REVIEWS.slice(0, 4).map((review) => (
                            <div key={review.id} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                                    {review.rating >= 4 ? '😊' : '😐'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{review.userName}</p>
                                    <p className="text-xs text-gray-500 truncate">{review.text}</p>
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{review.rating}.0</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* --- COLUMN 2 --- */}
            <div className="space-y-8">
                
                {/* Active Cards (System Status) */}
                <div className="relative h-56 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-indigo-200 text-sm mb-1">Current Plan</p>
                                <h3 className="text-2xl font-bold">Enterprise Pro</h3>
                            </div>
                            <CreditCard size={28} className="text-indigo-200" />
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-indigo-200 text-xs uppercase tracking-wider mb-1">Status</p>
                                <p className="font-mono font-semibold">ACTIVE</p>
                            </div>
                            <div>
                                <p className="text-indigo-200 text-xs uppercase tracking-wider mb-1">Exp Date</p>
                                <p className="font-mono font-semibold">12/25</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Doughnut */}
                <div className="bg-white dark:bg-[#151923] p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Listing Categories</h3>
                        <MoreHorizontal size={20} className="text-gray-400" />
                    </div>
                    <div className="h-48 relative flex items-center justify-center">
                        <Doughnut 
                            data={doughnutData} 
                            options={{ cutout: '75%', plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 6, font: { size: 10 } } } } }} 
                        />
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalBusinesses}</span>
                            <span className="text-xs text-gray-500">Total</span>
                        </div>
                    </div>
                </div>

                {/* Investments (Top Businesses) */}
                <div className="bg-white dark:bg-[#151923] p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Top Listings</h3>
                        <button className="text-indigo-500 text-xs font-bold hover:underline">See All</button>
                    </div>
                    <div className="space-y-4">
                        {MOCK_BUSINESSES.slice(0, 3).map((biz) => (
                            <div key={biz.id} className="flex items-center gap-4">
                                <img src={biz.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{biz.name}</p>
                                    <p className="text-xs text-gray-500">{biz.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-green-500">+{biz.viewCount}</p>
                                    <p className="text-xs text-gray-400">views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* --- COLUMN 3 --- */}
            <div className="space-y-8">
                
                {/* Dissection (Daily Activity) */}
                <div className="bg-white dark:bg-[#151923] p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Daily Activity</h3>
                        <Activity size={20} className="text-gray-400" />
                    </div>
                    <div className="h-40">
                        <Bar 
                            data={barData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                scales: { x: { grid: { display: false } }, y: { display: false } },
                                plugins: { legend: { display: false } }
                            }} 
                        />
                    </div>
                </div>

                {/* Spending Parameters (Engagement) */}
                <div className="bg-white dark:bg-[#151923] p-6 rounded-3xl shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Engagement Stats</h3>
                    <div className="flex justify-between px-2">
                        <CircularProgress value={78} color="#6366f1" icon={ArrowUpRight} label="Views" />
                        <CircularProgress value={45} color="#ec4899" icon={ArrowDownRight} label="Clicks" />
                        <CircularProgress value={22} color="#f59e0b" icon={Activity} label="Shares" />
                    </div>
                </div>

            </div>

            {/* --- ROW 2 (Full Width) --- */}
            <div className="lg:col-span-3 bg-white dark:bg-[#151923] p-8 rounded-3xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Income & Expenses</h3>
                        <p className="text-sm text-gray-500">Financial performance over the last year</p>
                    </div>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                            <span className="text-sm text-gray-500">Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                            <span className="text-sm text-gray-500">Cost</span>
                        </div>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <Line 
                        data={mainChartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: { grid: { color: '#f1f5f9' }, ticks: { callback: (val) => '₦' + val } },
                                x: { grid: { display: false } }
                            },
                            plugins: { legend: { display: false } }
                        }} 
                    />
                </div>
            </div>

        </div>
    );
};

export default AdminOverview;
