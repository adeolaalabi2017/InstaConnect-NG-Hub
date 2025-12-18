
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/admin/AdminComponents';
import { Users, BarChart2, Clock, Zap, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; trend: number }> = ({ title, value, icon: Icon, trend }) => (
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
    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Analytics</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Sessions" value="245,890" icon={Users} trend={12.5} />
                <StatCard title="Bounce Rate" value="45.2%" icon={BarChart2} trend={-3.1} />
                <StatCard title="Avg. Session Duration" value="2m 45s" icon={Clock} trend={8.2} />
                <StatCard title="New Users" value="12,340" icon={Zap} trend={22.1} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Real-time Traffic</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <Line data={realTimeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Users by Device</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72 flex items-center justify-center">
                         <Doughnut data={deviceData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe size={18}/> Top Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAnalytics;
