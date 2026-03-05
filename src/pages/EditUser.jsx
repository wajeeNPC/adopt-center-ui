import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Shield, Save } from 'lucide-react';
import { Spinner, PageSpinner } from '../components/ui/Spinner';
import { toast } from 'sonner';
import api from '../services/api';
import { cn } from '../lib/utils';

// Form Input Component
const UserInput = ({ error, className, ...props }) => (
  <input
    {...props}
    className={cn(
      'w-full px-3 py-2 bg-white border rounded-md text-sm text-slate-800 placeholder-slate-300',
      'focus:outline-none focus:ring-1 transition-colors',
      error
        ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
        : 'border-slate-200 focus:ring-pink-400 focus:border-pink-400',
      className
    )}
  />
);

const UserSelect = ({ error, children, className, ...props }) => (
  <select
    {...props}
    className={cn(
      'w-full px-3 py-2 bg-white border rounded-md text-sm text-slate-800',
      'focus:outline-none focus:ring-1 transition-colors appearance-none',
      "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center]",
      error
        ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
        : 'border-slate-200 focus:ring-pink-400 focus:border-pink-400',
      className
    )}
  >
    {children}
  </select>
);

const SectionCard = ({ title, hint, children, className }) => (
  <div className={cn('bg-white rounded-xl border border-slate-200 overflow-hidden', className)}>
    <div className="px-6 py-5 border-b border-slate-100">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'admin',
    isActive: true,
    nic: {
      number: '',
      issuedDate: '',
    },
  });

  useEffect(() => {
    fetchUserData();
    fetchCurrentUser();
  }, [userId]);

  const fetchCurrentUser = () => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const result = await api.userManagement.getUser(userId);
      if (result.success) {
        const user = result.data;
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'admin',
          isActive: user.isActive !== undefined ? user.isActive : true,
          nic: {
            number: user.nic?.number || '',
            issuedDate: user.nic?.issuedDate ? user.nic.issuedDate.split('T')[0] : '',
          },
        });
      } else {
        toast.error(result.message || 'Failed to load user');
        navigate('/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('nic.')) {
      const nicField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        nic: {
          ...prev.nic,
          [nicField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        isActive: formData.isActive,
      };

      // Only allow role change if current user is owner
      if (currentUser?.role === 'owner') {
        updateData.role = formData.role;
      }

      const result = await api.userManagement.updateUser(userId, updateData);

      if (result.success) {
        toast.success('User updated successfully');
        navigate('/users');
      } else {
        toast.error(result.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <PageSpinner label="Loading user data..." />
      </div>
    );
  }

  const canChangeRole = currentUser?.role === 'owner';

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/users')}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to User Management
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit User</h1>
          <p className="text-slate-500 mt-1">Update user information and permissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <SectionCard title="Basic Information" hint="User's personal details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <UserInput
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <UserInput
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <UserInput
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="user@example.com"
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <UserInput
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* NIC Information */}
          <SectionCard title="NIC Information" hint="National Identity Card details (read-only)">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    NIC Number
                  </label>
                  <UserInput
                    name="nic.number"
                    value={formData.nic.number}
                    onChange={handleChange}
                    disabled
                    className="bg-slate-50 cursor-not-allowed"
                    placeholder="Not provided"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Issued Date
                  </label>
                  <UserInput
                    name="nic.issuedDate"
                    type="date"
                    value={formData.nic.issuedDate}
                    onChange={handleChange}
                    disabled
                    className="bg-slate-50 cursor-not-allowed"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">NIC information cannot be modified after creation</p>
            </div>
          </SectionCard>

          {/* Role & Status */}
          <SectionCard title="Role & Status" hint="User permissions and account status">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <UserSelect
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!canChangeRole}
                  className={!canChangeRole ? 'bg-slate-50 cursor-not-allowed' : ''}
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </UserSelect>
                {!canChangeRole && (
                  <p className="text-xs text-slate-500 mt-1">
                    Only owners can change user roles
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Active Account
                </label>
              </div>
              <p className="text-xs text-slate-500">
                Inactive users cannot log in to the system
              </p>
            </div>
          </SectionCard>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'px-6 py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer inline-flex items-center gap-2',
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white shadow-sm'
              )}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
