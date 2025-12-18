
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/AdminComponents';

const AdminCMS: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Content Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>CMS Pages</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage CMS pages, blog posts, newsletters, FAQs, and testimonials here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminCMS;
