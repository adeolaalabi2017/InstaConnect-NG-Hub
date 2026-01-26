
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/admin/AdminComponents';
import LineChart from '../../components/LineChart';
import { ChartData } from 'chart.js';
import { TrendingUp, MousePointer, ExternalLink, Clock } from 'lucide-react';

const AdminAnalyticsTraffic: React.FC = () => {
    // Mock Data for Charts
    const visitsData: ChartData<'line'> = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Page Views',
                data: [1200, 1900, 1500, 2200, 1800, 2500, 3100],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Unique Visitors',
                data: [800, 1200, 950, 1500, 1100, 1800, 2200],
                borderColor: '#ec4899',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4
            }
        ]
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Traffic Reports</h1>
                <div className="flex gap-2">
                    <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Total Page Views</span>
                            <ExternalLink size={16} className="text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">145,203</div>
                        <div className="text-xs text-green-500 font-bold flex items-center mt-1"><TrendingUp size={12} className="mr-1"/> +12.5%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Unique Visitors</span>
                            <MousePointer size={16} className="text-purple-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">89,405</div>
                        <div className="text-xs text-green-500 font-bold flex items-center mt-1"><TrendingUp size={12} className="mr-1"/> +8.2%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Avg. Session</span>
                            <Clock size={16} className="text-orange-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">4m 32s</div>
                        <div className="text-xs text-red-500 font-bold flex items-center mt-1"><TrendingUp size={12} className="mr-1 rotate-180"/> -1.5%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm">Bounce Rate</span>
                            <Activity size={16} className="text-red-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">42.8%</div>
                        <div className="text-xs text-green-500 font-bold flex items-center mt-1"><TrendingUp size={12} className="mr-1 rotate-180"/> -2.1% (Good)</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="h-96">
                <CardHeader>
                    <CardTitle>Visitor Growth</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <LineChart data={visitsData} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Top Traffic Sources</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Source</TableHead>
                                <TableHead>Users</TableHead>
                                <TableHead>New Users</TableHead>
                                <TableHead>Sessions</TableHead>
                                <TableHead>Bounce Rate</TableHead>
                                <TableHead>Avg. Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { source: 'Google / Organic', users: '45,200', new: '38,000', sessions: '60,100', bounce: '35%', duration: '5m 12s' },
                                { source: 'Direct', users: '22,100', new: '5,000', sessions: '35,400', bounce: '28%', duration: '6m 45s' },
                                { source: 'Twitter / Social', users: '12,800', new: '11,500', sessions: '15,200', bounce: '65%', duration: '1m 20s' },
                                { source: 'Newsletter / Email', users: '8,500', new: '200', sessions: '12,000', bounce: '40%', duration: '3m 30s' },
                            ].map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium text-indigo-600">{row.source}</TableCell>
                                    <TableCell>{row.users}</TableCell>
                                    <TableCell>{row.new}</TableCell>
                                    <TableCell>{row.sessions}</TableCell>
                                    <TableCell>{row.bounce}</TableCell>
                                    <TableCell>{row.duration}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

// Simple Icon for last card
const Activity = ({ size, className }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
);

export default AdminAnalyticsTraffic;
