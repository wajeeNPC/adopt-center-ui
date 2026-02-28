import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, MoreHorizontal, FileText, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import FilterBar from '../components/common/FilterBar';
import { toast } from 'sonner';
import api from '../services/api';
import ApplicationDetailsModal from '../components/ApplicationDetailsModal';

const Applications = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [statusFilter]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const filters = {};
            if (statusFilter !== 'all') filters.status = statusFilter;

            const response = await api.applications.getCenterApplications(filters);
            if (response.success) {
                setApplications(response.data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.applications.review(id, newStatus, "Status updated via portal");
            toast.success(`Application updated to ${newStatus}`);
            fetchApplications(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update application status');
        }
    };

    const handleFinalize = async (id, petName) => {
        try {
            await toast.promise(
                api.applications.finalizeAdoption(id),
                {
                    loading: 'Finalizing adoption...',
                    success: `Adoption finalized! ${petName || 'Pet'} has been transferred to the adopter.`,
                    error: (err) => err.message || 'Failed to finalize adoption.',
                }
            );
            fetchApplications();
        } catch (error) {
            console.error('Error finalizing adoption:', error);
        }
    };

    const filteredApps = applications.filter(app => {
        const applicantName = app.applicant?.name || 'Unknown';
        const petName = app.pet?.name || 'Unknown';
        const matchesSearch = applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            petName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'destructive';
            case 'Under Review': return 'warning';
            case 'Withdrawn': return 'secondary';
            case 'Adopted': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Adoption Applications</h1>
                <p className="text-slate-500 mt-1">Review and manage incoming adoption requests.</p>
            </div>

            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                speciesFilter="all"
                onSpeciesChange={() => { }}
                onClearFilters={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                }}
            />

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead>Application ID</TableHead>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Pet</TableHead>
                            <TableHead>Date Applied</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    Loading applications...
                                </TableCell>
                            </TableRow>
                        ) : filteredApps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((app) => (
                                <TableRow key={app._id} className="hover:bg-slate-50">
                                    <TableCell className="font-medium text-xs text-slate-500">
                                        {app._id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-slate-900">{app.applicant?.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">{app.applicant?.email || 'No email'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {app.pet?.photos?.[0] && (
                                                <img
                                                    src={app.pet.photos[0]}
                                                    alt={app.pet.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                            <Badge variant="outline" className="font-normal">
                                                {app.pet?.name || 'Unknown Pet'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(app.status)}>
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => setSelectedApp(app)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {app.status === 'Pending' && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(app._id, 'Approved')}>
                                                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(app._id, 'Rejected')}>
                                                            <XCircle className="mr-2 h-4 w-4 text-rose-600" /> Reject
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(app._id, 'Under Review')}>
                                                            <FileText className="mr-2 h-4 w-4 text-amber-600" /> Mark Under Review
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {app.status === 'Approved' && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleFinalize(app._id, app.pet?.name)}
                                                        className="text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50"
                                                    >
                                                        <Award className="mr-2 h-4 w-4 text-emerald-600" /> Finalize Adoption
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ApplicationDetailsModal
                application={selectedApp}
                onClose={() => setSelectedApp(null)}
            />
        </div>
    );
};

export default Applications;
