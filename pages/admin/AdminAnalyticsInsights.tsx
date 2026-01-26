
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/AdminComponents';
import DoughnutChart from '../../components/DoughnutChart';
import { ChartData } from 'chart.js';
import { Users, Map, Smartphone } from 'lucide-react';

const AdminAnalyticsInsights: React.FC = () => {
    
    const deviceData: ChartData<'doughnut'> = {
        labels: ['Mobile', 'Desktop', 'Tablet'],
        datasets: [{
            data: [65, 30, 5],
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
            borderWidth: 0,
        }]
    };

    const genderData: ChartData<'doughnut'> = {
        labels: ['Male', 'Female', 'Unknown'],
        datasets: [{
            data: [48, 45, 7],
            backgroundColor: ['#3b82f6', '#ec4899', '#9ca3af'],
            borderWidth: 0,
        }]
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">User Insights</h1>
            <p className="text-gray-500">Deep dive into audience demographics and behavior.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Smartphone size={18}/> Device Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center">
                        <DoughnutChart data={deviceData} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users size={18}/> Gender Demographics</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center">
                        <DoughnutChart data={genderData} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Map size={18}/> Top Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { city: 'Lagos, Nigeria', percent: 65 },
                                { city: 'Abuja, Nigeria', percent: 15 },
                                { city: 'London, UK', percent: 8 },
                                { city: 'Port Harcourt', percent: 7 },
                                { city: 'Others', percent: 5 },
                            ].map((loc, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{loc.city}</span>
                                        <span className="text-gray-500">{loc.percent}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${loc.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative py-8 px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                            {[
                                { step: 'Landed', value: '100%', count: '25,000' },
                                { step: 'Viewed Listing', value: '65%', count: '16,250' },
                                { step: 'Clicked Contact', value: '15%', count: '3,750' },
                                { step: 'Purchased/Booked', value: '5%', count: '1,250' },
                            ].map((stage, i, arr) => (
                                <div key={i} className="flex flex-col items-center w-full relative">
                                    <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-800 border-4 border-indigo-100 dark:border-indigo-900 flex flex-col items-center justify-center shadow-lg z-10">
                                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stage.value}</span>
                                        <span className="text-xs text-gray-500">{stage.count} Users</span>
                                    </div>
                                    <span className="mt-4 font-bold text-slate-700 dark:text-slate-300">{stage.step}</span>
                                    {i < arr.length - 1 && (
                                        <div className="hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-0"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAnalyticsInsights;
