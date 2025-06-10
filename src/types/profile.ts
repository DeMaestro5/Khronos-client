export interface ProfileFormData {
  name: string;
  email: string;
  profilePicUrl: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormErrors {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export interface BasicInfoData {
  name: string;
  email: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface BasicInfoErrors {
  name?: string;
  email?: string;
}

export interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
