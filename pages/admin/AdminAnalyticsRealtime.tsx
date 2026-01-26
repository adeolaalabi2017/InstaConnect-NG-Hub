
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '../../components/admin/AdminComponents';
import { Activity, Globe, Monitor, MapPin } from 'lucide-react';

const AdminAnalyticsRealtime: React.FC = () => {
    const [activeUsers, setActiveUsers] = useState(142);
    const [events, setEvents] = useState([
        { id: 1, user: 'User #4829', action: 'Viewed Listing: Divine Hotels', location: 'Lagos', time: 'Just now' },
        { id: 2, user: 'User #9921', action: 'Search: "Pizza"', location: 'Abuja', time: '2s ago' },
        { id: 3, user: 'Guest', action: 'Homepage Visit', location: 'London', time: '5s ago' },
        { id: 4, user: 'User #1102', action: 'Clicked Phone Number', location: 'Port Harcourt', time: '12s ago' },
        { id: 5, user: 'Guest', action: 'Viewed Category: Tech', location: 'Lagos', time: '15s ago' },
    ]);

    // Simulate Live Updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Update counter slightly
            setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
            
            // Add new mock event
            const newEvent = {
                id: Date.now(),
                user: Math.random() > 0.5 ? `User #${Math.floor(Math.random()*9000)+1000}` : 'Guest',
                action: ['Homepage Visit', 'Viewed Listing', 'Search', 'Review Posted', 'Contact Click'][Math.floor(Math.random() * 5)],
                location: ['Lagos', 'Abuja', 'London', 'New York', 'Accra'][Math.floor(Math.random() * 5)],
                time: 'Just now'
            };
            
            setEvents(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Real-time Analytics</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-slate-900 text-white border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="text-6xl font-black mb-2 animate-pulse">{activeUsers}</div>
                        <div className="text-xl font-medium text-slate-400">Users Active Right Now</div>
                        <div className="mt-8 w-full">
                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Device Breakdown</span>
                            </div>
                            <div className="flex h-4 rounded-full overflow-hidden w-full">
                                <div className="bg-blue-500 w-[60%]" title="Mobile 60%"></div>
                                <div className="bg-green-500 w-[30%]" title="Desktop 30%"></div>
                                <div className="bg-yellow-500 w-[10%]" title="Tablet 10%"></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Mobile</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Desktop</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Tablet</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Activity Feed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {events.map((e) => (
                                        <TableRow key={e.id} className="animate-fade-in-up">
                                            <TableCell className="font-medium flex items-center gap-2">
                                                {e.user === 'Guest' ? <Globe size={14} className="text-gray-400"/> : <Monitor size={14} className="text-blue-500"/>}
                                                {e.user}
                                            </TableCell>
                                            <TableCell>{e.action}</TableCell>
                                            <TableCell className="flex items-center gap-1 text-gray-500"><MapPin size={12}/> {e.location}</TableCell>
                                            <TableCell className="text-gray-400 text-xs">{e.time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Top Active Pages</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { page: '/ (Home)', count: 45 },
                                    { page: '/listings', count: 32 },
                                    { page: '/listing/1 (Divine Hotels)', count: 18 },
                                    { page: '/login', count: 12 },
                                    { page: '/top-rated', count: 8 },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.page}</div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(p.count/50)*100}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold w-6 text-right">{p.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsRealtime;
