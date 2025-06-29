import { AxiosResponse } from 'axios';
import { UserSettings } from './settings';

export interface ApiResponse<T> {
  statusCode: string;
  data: T;
}

export type SettingsApiResponse<T = { settings: UserSettings }> = AxiosResponse<
  ApiResponse<T>
>;

export type SectionUpdateResponse<T> = AxiosResponse<ApiResponse<T>>;

export type ErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};
