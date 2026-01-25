
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button } from '../../components/admin/AdminComponents';
import { MOCK_BUSINESSES } from '../../constants';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminListings: React.FC = () => {
    const [listings, setListings] = useState(MOCK_BUSINESSES);
    const { checkPermission } = useAuth();

    const toggleStatus = (id: string) => {
        if (!checkPermission('manage_listings')) return;
        setListings(listings.map(l => 
            l.id === id ? { ...l, status: l.status === 'active' ? 'inactive' : 'active' } : l
        ));
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Listing Management</h1>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>All Listings</CardTitle>
                    {checkPermission('manage_listings') && <Button size="sm">Add New</Button>}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Verification</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listings.map(listing => (
                                <TableRow key={listing.id}>
                                    <TableCell className="font-medium">{listing.name}</TableCell>
                                    <TableCell>{listing.category}</TableCell>
                                    <TableCell>{listing.location}</TableCell>
                                    <TableCell>
                                        <Badge variant={listing.verificationStatus === 'verified' ? 'success' : 'warning'}>{listing.verificationStatus}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <button 
                                            onClick={() => toggleStatus(listing.id)}
                                            disabled={!checkPermission('manage_listings')}
                                            className={`flex items-center gap-1 transition-colors ${listing.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'} ${!checkPermission('manage_listings') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title={`Toggle Status (Currently ${listing.status})`}
                                        >
                                            {listing.status === 'active' ? <ToggleRight size={28} className="fill-current" /> : <ToggleLeft size={28} />}
                                            <span className="text-xs font-semibold uppercase">{listing.status}</span>
                                        </button>
                                    </TableCell>
                                    <TableCell>{new Date(listing.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {checkPermission('manage_listings') && (
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        )}
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

export default AdminListings;
