
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/AdminComponents';
import { Users, Store, DollarSign, Activity } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; subtext?: string }> = ({ title, value, icon: Icon, subtext }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</CardTitle>
            <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</div>
            {subtext && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtext}</p>}
        </CardContent>
    </Card>
);

const AdminOverview: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Revenue" value="₦4,523,189" icon={DollarSign} subtext="+20.1% from last month" />
                <StatCard title="New Listings" value="+2,350" icon={Store} subtext="+180.1% from last month" />
                <StatCard title="Active Users" value="+573" icon={Users} subtext="+19% from last month" />
                <StatCard title="System Uptime" value="99.98%" icon={Activity} subtext="Last 24 hours" />
            </div>
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Analytics Insight</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                           <span className="font-semibold text-slate-800 dark:text-slate-200">Weekly Trend Analysis:</span> User engagement is up by 15% this week, primarily driven by new listings in the 'Food' category in Lagos. Recommend launching a targeted marketing campaign for restaurants in Abuja to replicate this success.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;
