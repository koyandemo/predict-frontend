import { AuthResponseT } from "@/types/auth.type";
import apiConfig from "./apiConfig";
import { UserT } from "@/types/user.type";

export const registerWithProvider = async (data: {}):Promise<UserT> => {
  try {
    const res = await apiConfig.post(`/users/register-provider`, data);
    return res.data;
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message);
  }
}

export const updateUserProfile = async (data: any): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.put(`/users/profile/key`, data);
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to update profile',
      error: e.response?.data?.message || e.message,
    };
  }
};

// Get user stats
export const getUserStats = async (userId: number): Promise<AuthResponseT> => {
  try {
    const response = await apiConfig.get(`/users/${userId}/stats`);
    const result: AuthResponseT = response.data;
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch user stats',
      error: error.response?.data?.message || error.message
    };
  }
};