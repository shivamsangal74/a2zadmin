import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";

export const saveFilter = async (data: any) => {
  try {
    const response = await api.post(`${apiUrl}/filter`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllFilter = async () => {
  try {
    const response = await api.get(`${apiUrl}/filter`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllFilterByType = async (type: any) => {
  try {
    const response = await api.get(`${apiUrl}/filter/${type}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllFilterById = async (id: any) => {
  try {
    const response = await api.get(`${apiUrl}/filter/byId/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletefilter = async (id: string) => {
  try {
    const response = await api.delete("/filter?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatefilter = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/filter`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
