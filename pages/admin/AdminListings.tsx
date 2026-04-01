
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button } from '../../components/admin/AdminComponents';
import { fetchBusinesses } from '../../services/api';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminListings: React.FC = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { checkPermission } = useAuth();

    useEffect(() => {
        const loadListings = async () => {
            setIsLoading(true);
            try {
                const data = await fetchBusinesses();
                setListings(data);
            } catch (error) {
                console.error("Failed to load listings", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadListings();
    }, []);

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
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>)}
                        </div>
                    ) : (
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminListings;
