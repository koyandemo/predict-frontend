import { AuthResponseT } from "@/types/auth.type";
import apiConfig from "./apiConfig";

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponseT> => {
  try {
    const response = await apiConfig.post(`/users/login`, { email, password });
    const result: AuthResponseT = response.data;
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password?: string;
  provider?: "email" | "google" | "facebook";
  type?: "user" | "admin" | "seed";
  avatar_url?: string;
}): Promise<AuthResponseT> => {
  try {
    const requestData: any = {
      name: userData.name,
      email: userData.email,
      provider: userData.provider || "email",
      type: userData.type || "user",
    };

    if (userData.password && userData.provider === "email") {
      requestData.password = userData.password;
    }

    if (userData.avatar_url) {
      requestData.avatar_url = userData.avatar_url;
    }

    const response = await apiConfig.post(`/users/register`, requestData);

    const result: AuthResponseT = response.data;
    return result;
  } catch (error: any) {
    throw error;
  }
};

