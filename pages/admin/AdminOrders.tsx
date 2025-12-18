
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '../../components/admin/AdminComponents';
import { MOCK_TRANSACTIONS } from '../../constants';

const AdminOrders: React.FC = () => {
    const recentOrders = MOCK_TRANSACTIONS.slice(0, 5);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Order Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Business Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount (NGN)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell className="font-medium">{order.businessName}</TableCell>
                                    <TableCell>{order.type.replace('_', ' ')}</TableCell>
                                    <TableCell>₦{order.amountNGN?.toLocaleString() || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'success' ? 'success' : 'warning'}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOrders;
