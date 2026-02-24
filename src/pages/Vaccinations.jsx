import React from 'react';
import { Syringe, Calendar, Check, AlertCircle } from 'lucide-react';
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
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import FilterBar from '../components/common/FilterBar';

const Vaccinations = () => {
    // Mock Data
    const vaccinations = [
        { id: 1, pet: 'Bella', type: 'Rabies', date: '2023-11-15', status: 'Upcoming', vet: 'Dr. Smith' },
        { id: 2, pet: 'Max', type: 'Distemper', date: '2023-10-20', status: 'Completed', vet: 'Dr. Doe' },
        { id: 3, pet: 'Luna', type: 'Parvovirus', date: '2023-10-25', status: 'Overdue', vet: 'Dr. Smith' },
        { id: 4, pet: 'Charlie', type: 'Rabies', date: '2023-12-01', status: 'Upcoming', vet: 'Dr. Doe' },
        { id: 5, pet: 'Daisy', type: 'Bordetella', date: '2023-10-10', status: 'Completed', vet: 'Dr. Smith' },
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Overdue': return 'destructive';
            case 'Upcoming': return 'info';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vaccinations</h1>
                    <p className="text-slate-500 mt-1">Track vaccination schedules and medical records.</p>
                </div>
                <Button className="bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-200">
                    <Syringe className="mr-2 h-4 w-4" />
                    Log Vaccination
                </Button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead>Pet Name</TableHead>
                            <TableHead>Vaccine Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Veterinarian</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vaccinations.map((vac) => (
                            <TableRow key={vac.id} className="hover:bg-slate-50">
                                <TableCell className="font-medium text-slate-900">{vac.pet}</TableCell>
                                <TableCell>{vac.type}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {vac.date}
                                    </div>
                                </TableCell>
                                <TableCell>{vac.vet}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(vac.status)}>
                                        {vac.status === 'Overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                                        {vac.status === 'Completed' && <Check className="w-3 h-3 mr-1" />}
                                        {vac.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Vaccinations;
