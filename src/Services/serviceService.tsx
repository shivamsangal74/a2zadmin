import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";

export const saveService = async (data: any) => {
  try {
    const response = await api.post(`${apiUrl}/service`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllService = async () => {
  try {
    const response = await api.get(`${apiUrl}/service`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllServiceById = async (id: any) => {
  try {
    const response = await api.get(`${apiUrl}/service/byId/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteService = async (id: string) => {
  try {
    const response = await api.delete("/service?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateService = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/service`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
