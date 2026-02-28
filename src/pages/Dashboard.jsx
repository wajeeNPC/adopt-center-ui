import React, { useState, useEffect } from 'react';
import { PawPrint, FileText, Syringe, Activity, Plus, Search, Filter, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import KPIStatCard from '../components/dashboard/KPIStatCard';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageActions from '../components/common/PageActions';

const Dashboard = () => {
  const { pets, navigate } = useAppContext(); // pets from context might be stale or limited? 
  // Context usually loads pets on mount. 
  // We also need applications for stats.

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    adopted: 0
  });
  const [applications, setApplications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We can use pets from context, but let's ensure we have fresh stats.
        // Actually, context 'pets' is already loaded. 
        // Let's fetch applications.
        const appsResponse = await api.applications.getCenterApplications();
        if (appsResponse.success) {
          setApplications(appsResponse.data);
        }

        // Mock recent activity from combined data if backend doesn't support activity log yet
        // In a real app, GET /activity-log
        // Here we simulate it by mixing latest pets and applications
        const latestPets = [...pets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
        const latestApps = appsResponse.success ? [...appsResponse.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3) : [];

        const combined = [
          ...latestPets.map(p => ({
            id: p._id,
            action: 'Pet Added',
            subject: `${p.name} (${p.breed})`,
            time: new Date(p.createdAt).toLocaleDateString(),
            type: 'pet',
            timestamp: new Date(p.createdAt)
          })),
          ...latestApps.map(a => ({
            id: a._id,
            action: 'New Application',
            subject: `${a.applicantName} for ${a.petId?.name || 'Pet'}`,
            time: new Date(a.createdAt).toLocaleDateString(),
            type: 'application',
            timestamp: new Date(a.createdAt)
          }))
        ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

        setRecentActivity(combined);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pets]);

  // Update stats based on pets and apps
  useEffect(() => {
    setStats({
      total: pets.length,
      available: pets.filter(p => p.adoptionStatus === 'Available').length,
      pending: pets.filter(p => p.adoptionStatus === 'Pending').length,
      adopted: pets.filter(p => p.adoptionStatus === 'Adopted').length
    });
  }, [pets, applications]);

  const handleExport = () => {
    // Simple CSV export of Pet Inventory
    const headers = ['Name', 'Species', 'Breed', 'Status', 'Gender', 'Age', 'Adoption Fee'];
    const rows = pets.map(p => [
      p.name,
      p.species,
      p.breed,
      p.adoptionStatus,
      p.gender,
      p.age,
      p.adoptionFee
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pet_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kpiData = [
    {
      label: 'Total Pets',
      value: stats.total,
      icon: PawPrint,
      trend: 0,
      color: 'bg-blue-500',
    },
    {
      label: 'Pending Applications',
      value: applications.filter(a => a.status === 'Pending').length,
      icon: FileText,
      trend: 0,
      color: 'bg-amber-500',
    },
    {
      label: 'Adoptions',
      value: stats.adopted,
      icon: Activity,
      trend: 0,
      color: 'bg-emerald-500',
    },
    {
      label: 'Avg. Adoption Fee',
      value: `$${pets.length ? Math.round(pets.reduce((acc, p) => acc + (p.adoptionFee || 0), 0) / pets.length) : 0}`,
      icon: Syringe, // Icon placeholder
      trend: 0,
      trendLabel: 'vs last month',
      color: 'bg-rose-500',
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'application': return <FileText className="w-4 h-4 text-amber-500" />;
      case 'pet': return <Plus className="w-4 h-4 text-blue-500" />;
      case 'medical': return <Syringe className="w-4 h-4 text-rose-500" />;
      case 'adoption': return <PawPrint className="w-4 h-4 text-emerald-500" />;
      default: return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  // Charts Data
  const breedData = pets.reduce((acc, pet) => {
    const breed = pet.breed || 'Unknown';
    acc[breed] = (acc[breed] || 0) + 1;
    return acc;
  }, {});
  const pieChartData = Object.keys(breedData).map(key => ({ name: key, value: breedData[key] })).slice(0, 5);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time overview of your shelter.</p>
        </div>
        <PageActions
          items={[
            { label: 'Add New Pet', icon: Plus, onClick: () => navigate('add-pet') },
            { separator: true },
            { label: 'Export Inventory', icon: Download, onClick: handleExport },
            { label: 'View Applications', icon: FileText, onClick: () => navigate('applications') },
          ]}
        />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((stat, idx) => (
          <KPIStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity & Charts */}
        <div className="lg:col-span-2 space-y-6">

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Breed Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Applications Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-slate-700">{applications.length}</p>
                  <p className="text-sm text-slate-500">Total Applications</p>
                  <div className="mt-4 flex gap-4 text-xs">
                    <span className="text-amber-600">{applications.filter(a => a.status === 'Pending').length} Pending</span>
                    <span className="text-green-600">{applications.filter(a => a.status === 'Approved').length} Approved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Latest updates from the shelter system.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-pink-600">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-slate-100")}>
                        {getActivityIcon(item.type)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.action}</p>
                        <p className="text-sm text-slate-500">{item.subject}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                  </div>
                )) : (
                  <p className="text-center text-slate-500 py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Metrics & Status */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-200">
            <CardContent className="p-6 flex flex-col justify-between h-full min-h-[160px]">
              <div>
                <p className="text-pink-100 font-medium mb-1">Total Adoptions</p>
                <h3 className="text-3xl font-bold">{stats.adopted}</h3>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[70%]"></div>
              </div>
              <p className="text-sm text-pink-100 mt-2">Lifetime adoptions</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-pink-600 hover:border-pink-200" onClick={() => navigate('applications')}>
                <FileText className="w-4 h-4 mr-3" />
                Review Applications
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 text-slate-600 hover:text-pink-600 hover:border-pink-200" onClick={() => navigate('inventory')}>
                <Filter className="w-4 h-4 mr-3" />
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;