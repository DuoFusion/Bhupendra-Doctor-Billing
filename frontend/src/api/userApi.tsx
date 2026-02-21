import axios from "axios";
import { URL_KEYS } from "../constants/Url";

const API = axios.create({
  baseURL: "http://localhost:7000",
  withCredentials: true,
});

export const getAllUsers = async () => {
  const response = await API.get(URL_KEYS.USER.GET_USERS);
  return response.data;
};

export const getAllUsersByQuery = async (params: {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  const response = await API.get(URL_KEYS.USER.GET_USERS, { params });
  return response.data;
};

export const getUserById = async (id : any) => {
  const response = await API.get(
    URL_KEYS.USER.GET_USER_BY_ID.replace(":id", id)
  );
  return response.data;
};

export const updateUser = async (
  id: string,
  data: {
    name: string;
    email: string;
    role: string;
  }
) => {
  const response = await API.put(
    URL_KEYS.USER.UPDATE_USER.replace(":id", id),
    data
  );
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await API.delete(
    URL_KEYS.USER.DELETE_USER.replace(":id", id)
  );
  return response.data;
};
