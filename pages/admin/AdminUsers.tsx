import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button } from '../../components/admin/AdminComponents';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2, UserPlus } from 'lucide-react';

// Mock data for users
const MOCK_USERS = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', lastLogin: '2023-11-01' },
    { id: '2', name: 'Business Owner', email: 'owner@business.com', role: 'business', status: 'active', lastLogin: '2023-10-28' },
    { id: '3', name: 'Regular User', email: 'user@example.com', role: 'user', status: 'inactive', lastLogin: '2023-09-15' },
    { id: '4', name: 'Editor Jane', email: 'jane@example.com', role: 'editor', status: 'active', lastLogin: '2023-11-02' },
];

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { checkPermission } = useAuth();

    useEffect(() => {
        const loadUsers = async () => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setUsers(MOCK_USERS);
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUsers();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">User Management</h1>
                {checkPermission('manage_users') && (
                    <Button className="flex items-center gap-2">
                        <UserPlus size={16} />
                        Add User
                    </Button>
                )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'business' ? 'success' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" disabled={!checkPermission('manage_users')}>
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" disabled={!checkPermission('manage_users')}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
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

export default AdminUsers;
