import React from 'react';
import { User, Bell, Lock, Mail, Building } from 'lucide-react';

const Settings = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Profile Information</h2>
              <p className="text-xs text-gray-500 mt-0.5">Update your personal details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Sarah Johnson"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="bg-pink-600 text-white px-6 py-2.5 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
              Save Changes
            </button>
          </div>
        </div>

        {/* Organization Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Organization</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage your adoption center info</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Center Name</label>
              <input
                type="text"
                defaultValue="Happy Paws Adoption Center"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                defaultValue="123 Main Street, Pet City, PC 12345"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <button className="bg-pink-600 text-white px-6 py-2.5 rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium">
              Update Organization
            </button>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Email Preferences</h2>
              <p className="text-xs text-gray-500 mt-0.5">Choose what emails you receive</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
              <span className="text-sm text-gray-700">New pet enquiries</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
              <span className="text-sm text-gray-700">Adoption notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
              <span className="text-sm text-gray-700">Weekly reports</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage notification preferences</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
              <span className="text-sm text-gray-700">Push notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
              <span className="text-sm text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
              <span className="text-sm text-gray-700">SMS notifications</span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Security</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage password and security</p>
            </div>
          </div>
          <div className="space-y-4">
            <button className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Change Password
            </button>
            <div className="pt-3 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500" />
                <span className="text-sm text-gray-700">Enable two-factor authentication</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;