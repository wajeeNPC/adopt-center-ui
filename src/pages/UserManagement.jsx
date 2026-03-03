import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Edit,
  Trash2,
  RotateCcw,
  X,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import FilterBar from '../components/common/FilterBar';
import PageActions from '../components/common/PageActions';
import { toast } from 'sonner';

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inviteData, setInviteData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'admin',
    nic: {
      number: '',
      issuedDate: '',
    },
  });
  const [inviteError, setInviteError] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    // Get current user from localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await api.userManagement.getUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setInviteError('');

    try {
      setInviting(true);
      const result = await api.userManagement.inviteUser(inviteData);
      if (result.success) {
        toast.success(`User invited successfully! Temporary password: ${result.data.tempPassword}`);
        setShowInviteModal(false);
        setInviteData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'admin',
          nic: {
            number: '',
            issuedDate: '',
          },
        });
        fetchUsers();
      } else {
        setInviteError(result.message || 'Failed to invite user');
      }
    } catch (err) {
      setInviteError(err.message || 'Failed to invite user');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to remove ${userName}? This action cannot be undone.`)) return;

    try {
      const result = await api.userManagement.removeUser(userId);
      if (result.success) {
        toast.success('User removed successfully');
        fetchUsers();
      } else {
        toast.error(result.message || 'Failed to remove user');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove user');
    }
  };

  const handleResendInvite = async (userId) => {
    try {
      const result = await api.userManagement.resendInvite(userId);
      if (result.success) {
        toast.success(`Invite resent! New temporary password: ${result.data.tempPassword}`);
      } else {
        toast.error(result.message || 'Failed to resend invite');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to resend invite');
    }
  };

  const handleActivateUser = async (userId, userName) => {
    try {
      const result = await api.userManagement.updateUser(userId, { isActive: true });
      if (result.success) {
        toast.success(`${userName} activated successfully`);
        fetchUsers();
      } else {
        toast.error(result.message || 'Failed to activate user');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to deactivate ${userName}? They will not be able to log in.`)) return;

    try {
      const result = await api.userManagement.updateUser(userId, { isActive: false });
      if (result.success) {
        toast.success(`${userName} deactivated successfully`);
        fetchUsers();
      } else {
        toast.error(result.message || 'Failed to deactivate user');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to deactivate user');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'NIC'];
    const rows = users.map((u) => [
      `${u.firstName} ${u.lastName}`,
      u.email,
      u.phone || '',
      u.role,
      u.isActive ? 'Active' : 'Inactive',
      u.nic?.number || ''
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'users_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleIcon = (role) => {
    return role === 'owner' ? ShieldCheck : Shield;
  };

  const getRoleColor = (role) => {
    return role === 'owner'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-blue-100 text-blue-700';
  };

  const canManageUser = (user) => {
    if (!currentUser) return false;
    // Owner can manage everyone except themselves
    if (currentUser.role === 'owner') {
      return user._id !== currentUser._id;
    }
    // Admin can only manage other admins (not owners or themselves)
    return user.role !== 'owner' && user._id !== currentUser._id;
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const actionItems = [
    { label: 'Invite User', icon: UserPlus, onClick: () => setShowInviteModal(true) },
    { separator: true },
    { label: 'Export CSV', icon: Download, onClick: handleExportCSV },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">
            Manage staff members of your adoption center
          </p>
        </div>
        <PageActions items={actionItems} />
      </div>

      {/* FilterBar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {users.length === 0 ? 'No users yet' : 'No users found'}
          </h3>
          <p className="text-slate-600 mb-4">
            {users.length === 0
              ? 'Start by inviting staff members to your center'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>NIC</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const isCurrentUser = user._id === currentUser?._id;
                const canManage = canManageUser(user);
                const isInactive = !user.isActive;

                return (
                  <TableRow
                    key={user._id}
                    className={isInactive ? 'hover:bg-slate-50 opacity-60' : 'hover:bg-slate-50'}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className={isInactive ? 'text-slate-500' : 'text-slate-900'}>
                          {user.firstName} {user.lastName}
                        </span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="w-fit mt-1 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-900">
                        {user.nic?.number || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1 ${
                          user.role === 'owner'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isInactive ? (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                          Inactive
                        </Badge>
                      ) : (
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {canManage ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/edit-user/${user._id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isInactive ? (
                              <DropdownMenuItem
                                onClick={() => handleActivateUser(user._id, `${user.firstName} ${user.lastName}`)}
                              >
                                <UserCheck className="mr-2 h-4 w-4 text-emerald-600" /> Activate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleDeactivateUser(user._id, `${user.firstName} ${user.lastName}`)}
                              >
                                <UserX className="mr-2 h-4 w-4 text-amber-600" /> Deactivate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleResendInvite(user._id)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" /> Resend Invite
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleRemoveUser(user._id, `${user.firstName} ${user.lastName}`)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-sm text-slate-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">Invite User</h2>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteError('');
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="p-6">
              {inviteError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
                  {inviteError}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={inviteData.firstName}
                      onChange={(e) =>
                        setInviteData({ ...inviteData, firstName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={inviteData.lastName}
                      onChange={(e) =>
                        setInviteData({ ...inviteData, lastName: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={inviteData.phone}
                    onChange={(e) => setInviteData({ ...inviteData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      NIC Number *
                    </label>
                    <input
                      type="text"
                      value={inviteData.nic.number}
                      onChange={(e) =>
                        setInviteData({
                          ...inviteData,
                          nic: { ...inviteData.nic, number: e.target.value },
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      NIC Issued Date *
                    </label>
                    <input
                      type="date"
                      value={inviteData.nic.issuedDate}
                      onChange={(e) =>
                        setInviteData({
                          ...inviteData,
                          nic: { ...inviteData.nic, issuedDate: e.target.value },
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    required
                    disabled={currentUser?.role !== 'owner'}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-slate-100"
                  >
                    <option value="admin">Admin</option>
                    {currentUser?.role === 'owner' && <option value="owner">Owner</option>}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    {currentUser?.role === 'owner'
                      ? 'Owners have full control. Admins can manage day-to-day operations.'
                      : 'Only owners can invite other owners.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteError('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {inviting ? 'Inviting...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
