
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button } from '../../components/admin/AdminComponents';
import { MOCK_BUSINESSES } from '../../constants';

const AdminListings: React.FC = () => {
    const listings = MOCK_BUSINESSES.slice(0, 5);

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">Listing Management</h1>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>All Listings</CardTitle>
                    <Button size="sm">Add New</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
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
                                    <TableCell>{new Date(listing.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">Edit</Button>
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
