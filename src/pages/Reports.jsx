import React from 'react';
import { Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from 'sonner';

const Reports = () => {
    // Mock Data
    const adoptionData = [
        { month: 'Jan', dogs: 12, cats: 8, rabbits: 2 },
        { month: 'Feb', dogs: 15, cats: 10, rabbits: 3 },
        { month: 'Mar', dogs: 18, cats: 12, rabbits: 4 },
        { month: 'Apr', dogs: 25, cats: 15, rabbits: 5 },
        { month: 'May', dogs: 22, cats: 18, rabbits: 6 },
        { month: 'Jun', dogs: 30, cats: 22, rabbits: 8 },
    ];

    const speciesData = [
        { name: 'Dogs', value: 45, color: '#FB6F92' },
        { name: 'Cats', value: 35, color: '#3B82F6' },
        { name: 'Rabbits', value: 15, color: '#10B981' },
        { name: 'Others', value: 5, color: '#F59E0B' },
    ];

    const handleExport = (type) => {
        toast.success(`Exporting ${type} report...`);
        // Simulate download
        setTimeout(() => toast.info("Report downloaded successfully"), 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h1>
                    <p className="text-slate-500 mt-1">performance metrics and shelter statistics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 6 Months
                    </Button>
                    <Button onClick={() => handleExport('Comprehensive')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Adoption Trends */}
                <Card className="col-span-1 lg:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Adoption Trends</CardTitle>
                        <CardDescription>Monthly adoption numbers by species.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={adoptionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#64748B" tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                                    itemStyle={{ color: '#1E293B' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="dogs" name="Dogs" stroke="#FB6F92" strokeWidth={3} dot={{ r: 4, fill: '#FB6F92' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="cats" name="Cats" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="rabbits" name="Rabbits" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Species Distribution */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Current Inventory</CardTitle>
                        <CardDescription>Distribution of animals by species.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={speciesData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {speciesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Exports Table (Simulated) */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Exports</CardTitle>
                        <CardDescription>History of generated reports.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-md border border-slate-100">
                                            <FileText className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Monthly_Report_{i}.csv</p>
                                            <p className="text-xs text-slate-500">Generated 2 days ago</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8">Download</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Helper Icon (ensure it's imported or defined if missing)
const FileText = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
);

export default Reports;
