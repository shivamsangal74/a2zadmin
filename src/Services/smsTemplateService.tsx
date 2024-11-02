import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";

export const addTemplate = async (data: any) => {
  try {
    const response = await api.post(`${apiUrl}/sms-template`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTemplate = async (id: string) => {
  try {
    const response = await api.get("/sms-template/id?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllTemplate = async () => {
  try {
    const response = await api.get(`/sms-template`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    const response = await api.delete("/sms-template?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTemplate = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/sms-template`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
