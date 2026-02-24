import React, { useState } from 'react';
import { User, Bell, Shield, Key, Mail, Smartphone, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';

const Settings = () => {
  const [loading, setLoading] = useState(false);

  // Mock State
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true
  });

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and system configurations.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details and public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 border-2 border-slate-100">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="jane@pawhome.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Administrator" disabled className="bg-slate-50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-slate-500">Receive daily summaries and critical alerts.</p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <div>
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-slate-500">Get text messages for urgent adoption requests.</p>
                </div>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, sms: c }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-500" />
                <div>
                  <Label className="text-base">Browser Push</Label>
                  <p className="text-sm text-slate-500">Show desktop notifications when active.</p>
                </div>
              </div>
              <Switch
                checked={notifications.browser}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, browser: c }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your password and security questions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="ghost">Cancel</Button>
          <Button onClick={handleSave} disabled={loading} className="bg-pink-600 hover:bg-pink-700 w-32">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;