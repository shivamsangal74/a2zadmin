import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";

export const addApi = async (tranxData: any) => {
  try {
    const response = await api.post(`${apiUrl}/api`, tranxData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getApi = async (id: string) => {
  try {
    const response = await api.get("/api/id?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllApi = async () => {
  try {
    const response = await api.get(`/api`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOperatorApi = async (apiId: any) => {
  try {
    const response = await api.get(`/api/api-operator/${apiId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCircleApi = async (apiId: any) => {
  try {
    const response = await api.get(`/api/api-circle/${apiId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveOperatorApi = async (data: any) => {
  try {
    const response = await api.post(`/api/api-operator`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveCircleApi = async (data: any) => {
  try {
    const response = await api.post(`/api/api-circle`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteApi = async (id: string) => {
  try {
    const response = await api.delete("/api?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateApi = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/api`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
