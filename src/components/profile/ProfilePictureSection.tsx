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
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if we should show the image or initials
  const shouldShowImage = () => {
    if (!previewImage) return false;
    if (imageLoadError) return false;
    // Don't show placeholder/example URLs
    if (
      previewImage.includes('example.org') ||
      previewImage.includes('placeholder')
    )
      return false;
    return true;
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

      // Clear any previous errors
      setLocalError('');
      setImageLoadError(false);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPreviewImage(result);
          onImageChange(result);
        }
      };

      reader.onerror = () => {
        setLocalError('Failed to read the image file');
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
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6'>
        Profile Picture
      </h2>

      {errorMessage && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3'>
          <FiAlertCircle className='h-5 w-5 text-red-600 flex-shrink-0 mt-0.5' />
          <p className='text-red-800 text-sm font-medium'>{errorMessage}</p>
        </div>
      )}

      <div className='flex flex-col items-center text-center space-y-6'>
        {/* Profile Picture Display */}
        <div className='relative'>
          <div className='relative group'>
            {shouldShowImage() ? (
              <div className='relative'>
                {previewImage.startsWith('data:') ? (
                  // Use regular img tag for base64 data to avoid Next.js optimization issues
                  <img
                    className='h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100'
                    src={previewImage}
                    alt='Profile preview'
                    onError={() => {
                      setImageLoadError(true);
                      setLocalError('Failed to load image preview');
                    }}
                    onLoad={() => {
                      setImageLoadError(false);
                      setLocalError(''); // Clear any previous errors
                    }}
                  />
                ) : (
                  // Use Next.js Image for URLs
                  <Image
                    className='h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100'
                    src={previewImage}
                    width={112}
                    height={112}
                    alt='Profile preview'
                    onError={() => {
                      setImageLoadError(true);
                      setLocalError('Failed to load image preview');
                    }}
                    onLoad={() => {
                      setImageLoadError(false);
                      setLocalError(''); // Clear any previous errors
                    }}
                  />
                )}
              </div>
            ) : (
              <div className='h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg ring-2 ring-gray-100'>
                <span className='text-white font-semibold text-2xl'>
                  {getInitials(userName)}
                </span>
              </div>
            )}

            {/* Camera button overlay */}
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute inset-0 h-28 w-28 rounded-full bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all duration-200 group-hover:bg-black/20'
              title={
                shouldShowImage()
                  ? 'Change profile picture'
                  : 'Upload profile picture'
              }
            >
              <div className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100'>
                <FiCamera className='h-4 w-4' />
              </div>
            </button>
          </div>
        </div>

        {/* Upload Instructions */}
        <div className='text-center space-y-3'>
          <div>
            <p className='text-sm font-medium text-gray-900'>
              {shouldShowImage()
                ? 'Update your profile picture'
                : 'Add a profile picture'}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Click the photo or use the buttons below
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-center gap-3'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='inline-flex items-center cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              <FiUpload className='h-3.5 w-3.5 mr-1.5' />
              {shouldShowImage() ? 'Change' : 'Upload'}
            </button>

            {shouldShowImage() && (
              <button
                type='button'
                onClick={handleRemoveImage}
                className='inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              >
                <FiTrash2 className='h-3.5 w-3.5 mr-1.5' />
                Remove
              </button>
            )}
          </div>

          {/* File Requirements */}
          <div className='text-xs text-gray-400 space-y-0.5'>
            <p>Maximum size: 5MB • JPG, PNG, GIF, WebP</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/jpeg,image/png,image/gif,image/webp'
          onChange={handleImageChange}
          className='hidden'
        />
      </div>
    </div>
  );
}
