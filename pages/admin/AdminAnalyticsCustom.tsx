
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select } from '../../components/admin/AdminComponents';
import { Download, FileText, Calendar } from 'lucide-react';

const AdminAnalyticsCustom: React.FC = () => {
    const [reportName, setReportName] = useState('New Report');
    const [dateRange, setDateRange] = useState('30');
    const [metrics, setMetrics] = useState<string[]>([]);

    const toggleMetric = (metric: string) => {
        if (metrics.includes(metric)) {
            setMetrics(metrics.filter(m => m !== metric));
        } else {
            setMetrics([...metrics, metric]);
        }
    };

    const handleExport = () => {
        alert("Generating report... Download will start shortly.");
    };

    return (
        <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Custom Report Builder</h1>
                <p className="text-gray-500">Configure parameters to generate a specific dataset for analysis.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText size={18} /> Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Report Name</label>
                            <Input value={reportName} onChange={(e) => setReportName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Time Period</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <Select className="pl-10" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                                    <option value="7">Last 7 Days</option>
                                    <option value="30">Last 30 Days</option>
                                    <option value="90">Last Quarter</option>
                                    <option value="365">Last Year</option>
                                    <option value="custom">Custom Range</option>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Metrics to Include</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Page Views', 'Unique Visitors', 'Bounce Rate', 'Avg. Session', 'New Users', 'Returning Users', 'Conversion Rate', 'Revenue', 'Traffic Sources', 'Devices', 'Locations', 'Errors'].map(m => (
                                <div 
                                    key={m}
                                    onClick={() => toggleMetric(m)}
                                    className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition-all text-center select-none ${
                                        metrics.includes(m) 
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-400'
                                    }`}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Filters (Optional)</label>
                        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center text-sm text-gray-500">
                            + Add Filter
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <Button variant="outline">Save Template</Button>
                        <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Download size={16} className="mr-2" /> Export CSV
                        </Button>
                        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
                            <Download size={16} className="mr-2" /> Export PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAnalyticsCustom;
