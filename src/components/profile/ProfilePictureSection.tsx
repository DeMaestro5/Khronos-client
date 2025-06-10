'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FiCamera, FiUpload, FiTrash2, FiAlertCircle } from 'react-icons/fi';

interface ProfilePictureSectionProps {
  previewImage: string;
  setPreviewImage: (image: string) => void;
  onImageChange: (imageData: string) => void;
  userName: string;
  errors?: string;
}

export default function ProfilePictureSection({
  previewImage,
  setPreviewImage,
  onImageChange,
  userName,
  errors,
}: ProfilePictureSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string>('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setLocalError('Image must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setLocalError('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        onImageChange(result);
        setLocalError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    onImageChange('');
    setLocalError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const errorMessage = errors || localError;

  return (
    <div className='bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8'>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>Profile Picture</h2>

      {errorMessage && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3'>
          <FiAlertCircle className='h-5 w-5 text-red-600 flex-shrink-0' />
          <p className='text-red-800 font-medium'>{errorMessage}</p>
        </div>
      )}

      <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-8'>
        {/* Current/Preview Image */}
        <div className='relative mb-6 sm:mb-0'>
          {previewImage ? (
            <Image
              className='h-32 w-32 rounded-3xl object-cover ring-4 ring-white shadow-xl'
              src={previewImage}
              width={128}
              height={128}
              alt='Profile preview'
              onError={() => setPreviewImage('')}
            />
          ) : (
            <div className='h-32 w-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-white shadow-xl'>
              <span className='text-white font-bold text-4xl'>
                {getInitials(userName)}
              </span>
            </div>
          )}

          {/* Camera overlay */}
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='absolute inset-0 h-32 w-32 rounded-3xl bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 group'
          >
            <FiCamera className='h-8 w-8 text-white group-hover:scale-110 transition-transform duration-200' />
          </button>
        </div>

        {/* Upload Controls */}
        <div className='flex-1'>
          <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105'
            >
              <FiUpload className='h-4 w-4 mr-2' />
              Upload New Photo
            </button>

            {previewImage && (
              <button
                type='button'
                onClick={handleRemoveImage}
                className='inline-flex items-center px-6 py-3 bg-white border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200'
              >
                <FiTrash2 className='h-4 w-4 mr-2' />
                Remove Photo
              </button>
            )}
          </div>

          <p className='text-sm text-gray-500 mt-3'>
            Upload a square image (recommended: 400x400px or larger). Max file
            size: 5MB.
          </p>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />
        </div>
      </div>
    </div>
  );
}
