
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/admin/AdminComponents';
import { Users, BarChart2, Clock, Zap, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { fetchAdminOverview } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; trend: number }> = ({ title, value, icon: Icon, trend }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
            <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</div>
            <div className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(trend)}% vs last period
            </div>
        </CardContent>
    </Card>
);

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </CardContent>
    </Card>
);

const realTimeData = {
    labels: Array.from({ length: 10 }, (_, i) => `${i * 10}s ago`),
    datasets: [{
        label: 'Active Users',
        data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 120),
        borderColor: '#EE1C47',
        backgroundColor: 'rgba(238, 28, 71, 0.1)',
        fill: true,
        tension: 0.4,
    }],
};

const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
        data: [65, 25, 10],
        backgroundColor: ['#09153D', '#EE1C47', '#FF823A'],
        borderWidth: 0,
    }],
};

const topSources = [
    { source: 'Google', visitors: '12,450', change: 15.2 },
    { source: 'Instagram', visitors: '8,750', change: 8.5 },
    { source: 'Direct', visitors: '5,120', change: -2.1 },
    { source: 'BellaNaija', visitors: '2,300', change: 25.8 },
];

const AdminAnalytics: React.FC = () => {
    const { user } = useAuth();
    const [overviewData, setOverviewData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const overview = await fetchAdminOverview(user.role);
                setOverviewData(overview);
            } catch (error) {
                console.error("Failed to fetch analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Analytics</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard title="Total Sessions" value={overviewData?.totalViews?.toLocaleString() || "245,890"} icon={Users} trend={12.5} />
                        <StatCard title="Bounce Rate" value="45.2%" icon={BarChart2} trend={-3.1} />
                        <StatCard title="Avg. Session Duration" value="2m 45s" icon={Clock} trend={8.2} />
                        <StatCard title="New Users" value={overviewData?.totalUsers?.toLocaleString() || "12,340"} icon={Zap} trend={22.1} />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Real-time Traffic</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        {isLoading ? (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                        ) : (
                            <Line data={realTimeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }} />
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Users by Device</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72 flex items-center justify-center">
                        {isLoading ? (
                            <div className="w-48 h-48 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                        ) : (
                            <Doughnut data={deviceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe size={18}/> Top Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 mt-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Visitors</TableHead>
                                    <TableHead>% Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topSources.map(source => (
                                    <TableRow key={source.source}>
                                        <TableCell className="font-medium">{source.source}</TableCell>
                                        <TableCell>{source.visitors}</TableCell>
                                        <TableCell className={source.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                            {source.change > 0 ? '+' : ''}{source.change}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAnalytics;
