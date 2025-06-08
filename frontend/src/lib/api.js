import axios from "axios";
import { axiosInstance } from "./axios";

export const signup = async (signUpData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", signUpData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async (loginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in GetAuthUser: ", error);
    return null;
  }
};

export const completeOnBoarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

export const getOutgoingFriendRequests = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};

export const getFriendRequests = async () => {
  const endpoint = "/users/friend-requests";
  console.log("Endpoint URL:", JSON.stringify(endpoint));
  const response = await axiosInstance.get(endpoint);
  return response.data;
};

export const acceptFriendRequest = async (requestId) => {
  console.log("Calling acceptFriendRequest with ID:", requestId);
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data;
};

export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token", {
    withCredentials: true
  })
  return response.data
}
