'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiSave,
  FiX,
  FiAlertCircle,
  FiCheck,
  FiArrowLeft,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '@/src/context/AuthContext';
import { profileAPI } from '@/src/lib/api';
import { User } from '@/src/types/auth';
import { ProfileFormData, ProfileFormErrors } from '@/src/types/profile';
import ProfilePictureSection from '@/src/components/profile/ProfilePictureSection';
import BasicInfoSection from '@/src/components/profile/BasicInfoSection';
import SecuritySection from '@/src/components/profile/SecuritySection';

export default function EditProfilePage() {
  const { user: contextUser, updateUser } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState<User | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    profilePicUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [changePassword, setChangePassword] = useState(false);
  const [success, setSuccess] = useState<string>('');

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!contextUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profileResponse = await profileAPI.getProfile();
        if (profileResponse.data?.data) {
          const userData = profileResponse.data.data;
          setProfileData(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            profilePicUrl: userData.profilePicUrl || userData.avatar || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setPreviewImage(userData.profilePicUrl || userData.avatar || '');
        } else {
          // Use context user as fallback
          setProfileData(contextUser);
          setFormData({
            name: contextUser.name || '',
            email: contextUser.email || '',
            profilePicUrl:
              contextUser.profilePicUrl || contextUser.avatar || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setPreviewImage(
            contextUser.profilePicUrl || contextUser.avatar || ''
          );
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setErrors({ general: 'Failed to load profile data' });
        // Use context user as fallback
        if (contextUser) {
          setProfileData(contextUser);
          setFormData({
            name: contextUser.name || '',
            email: contextUser.email || '',
            profilePicUrl:
              contextUser.profilePicUrl || contextUser.avatar || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          setPreviewImage(
            contextUser.profilePicUrl || contextUser.avatar || ''
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [contextUser, router]);

  const user = profileData || contextUser;

  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only if changing password)
    if (changePassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name as keyof ProfileFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear success message
    if (success) setSuccess('');
  };

  const handleImageChange = (imageData: string) => {
    setFormData((prev) => ({ ...prev, profilePicUrl: imageData }));
    setPreviewImage(imageData);
    // Clear any previous errors
    setErrors((prev) => ({ ...prev, general: undefined }));
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const updateData: { name: string; profilePicUrl?: string } = {
        name: formData.name.trim(),
      };

      // Only include profilePicUrl if it's different from current
      if (
        formData.profilePicUrl !== (user?.profilePicUrl || user?.avatar || '')
      ) {
        updateData.profilePicUrl = formData.profilePicUrl;
      }

      const response = await profileAPI.updateProfile(updateData);

      if (response.data?.data) {
        // Update the user context
        updateUser(response.data.data);
        setSuccess('Profile updated successfully!');

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setErrors({ general: 'Failed to update profile. Please try again.' });
      }
    } catch (error: unknown) {
      console.error('Failed to update profile:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (apiError.response?.status === 400) {
          setErrors({
            general: apiError.response.data?.message || 'Invalid data provided',
          });
        } else if (apiError.response?.status === 401) {
          setErrors({ general: 'Authentication failed. Please log in again.' });
        } else {
          setErrors({ general: 'Failed to update profile. Please try again.' });
        }
      } else {
        setErrors({ general: 'Failed to update profile. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-gray-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-slate-400 font-medium'>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FiUser className='h-8 w-8 text-red-600 dark:text-red-400' />
          </div>
          <p className='text-red-600 dark:text-red-400 font-medium'>
            Failed to load profile
          </p>
          <Link
            href='/dashboard'
            className='text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block'
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center space-x-4 mb-4'>
            <Link
              href='/profile'
              className='p-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors duration-200'
            >
              <FiArrowLeft className='h-5 w-5' />
            </Link>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-slate-100'>
                Edit Profile
              </h1>
              <p className='text-gray-600 dark:text-slate-400 text-sm mt-1'>
                Update your personal information and settings
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className='mb-6 p-4 bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-lg flex items-start space-x-3'>
            <FiCheck className='h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' />
            <p className='text-green-800 dark:text-green-300 text-sm font-medium'>
              {success}
            </p>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-lg flex items-start space-x-3'>
            <FiAlertCircle className='h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
            <p className='text-red-800 dark:text-red-300 text-sm font-medium'>
              {errors.general}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Profile Picture Section */}
          <ProfilePictureSection
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            onImageChange={handleImageChange}
            userName={formData.name || user.name}
            errors={errors.general}
          />

          {/* Basic Information */}
          <BasicInfoSection
            formData={{ name: formData.name, email: formData.email }}
            errors={{ name: errors.name, email: errors.email }}
            onInputChange={handleInputChange}
          />

          {/* Security Section */}
          <SecuritySection
            formData={{
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword,
            }}
            errors={{
              currentPassword: errors.currentPassword,
              newPassword: errors.newPassword,
              confirmPassword: errors.confirmPassword,
            }}
            onInputChange={handleInputChange}
            changePassword={changePassword}
            setChangePassword={setChangePassword}
          />

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 bg-white dark:bg-slate-800/80 rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 p-6'>
            <div className='text-sm text-gray-500 dark:text-slate-400'>
              * Required fields
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <Link
                href='/profile'
                className='inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-300 dark:hover:border-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800'
              >
                <FiX className='h-4 w-4 mr-2' />
                Cancel
              </Link>

              <button
                type='submit'
                disabled={saving}
                className='inline-flex items-center justify-center px-8 py-3 bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 dark:disabled:hover:bg-blue-600'
              >
                {saving ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className='h-4 w-4 mr-2' />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
