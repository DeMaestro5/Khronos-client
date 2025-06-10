# Profile Components

This directory contains reusable components for the profile edit functionality.

## Components

### ProfilePictureSection

Handles profile picture upload, preview, and validation.

**Props:**

- `previewImage: string` - Current image preview URL
- `setPreviewImage: (image: string) => void` - Function to update preview
- `onImageChange: (imageData: string) => void` - Callback when image changes
- `userName: string` - User's name for generating initials
- `errors?: string` - Error message to display

**Features:**

- Image preview with fallback to initials
- File validation (size, type)
- Drag and drop support
- Remove image functionality

### BasicInfoSection

Handles basic user information fields (name, email).

**Props:**

- `formData: BasicInfoData` - Form data object with name and email
- `errors: BasicInfoErrors` - Validation errors object
- `onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Input change handler

**Features:**

- Name validation
- Email validation (disabled for updates)
- Error display with icons

### SecuritySection

Handles password change functionality.

**Props:**

- `formData: PasswordData` - Password form data
- `errors: PasswordErrors` - Password validation errors
- `onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Input change handler
- `changePassword: boolean` - Whether password change is enabled
- `setChangePassword: (value: boolean) => void` - Toggle password change mode

**Features:**

- Toggle password change mode
- Password visibility toggles
- Current/new/confirm password validation
- Security warnings

## Types

All components use shared types from `@/src/types/profile`:

- `ProfileFormData` - Complete form data interface
- `ProfileFormErrors` - Complete form errors interface
- `BasicInfoData` - Name and email data
- `BasicInfoErrors` - Name and email errors
- `PasswordData` - Password form data
- `PasswordErrors` - Password validation errors

## Usage

```tsx
import ProfilePictureSection from '@/src/components/profile/ProfilePictureSection';
import BasicInfoSection from '@/src/components/profile/BasicInfoSection';
import SecuritySection from '@/src/components/profile/SecuritySection';

// In your component
<ProfilePictureSection
  previewImage={previewImage}
  setPreviewImage={setPreviewImage}
  onImageChange={handleImageChange}
  userName={user.name}
  errors={errors.general}
/>

<BasicInfoSection
  formData={{ name: formData.name, email: formData.email }}
  errors={{ name: errors.name, email: errors.email }}
  onInputChange={handleInputChange}
/>

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
```
