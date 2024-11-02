import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";

export const saveRisk = async (data: any) => {
  try {
    const response = await api.post(`${apiUrl}/risk`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRisk = async (userid: any) => {
  try {
    const response = await api.get(`${apiUrl}/risk/byId/${userid}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDefaultRisk = async () => {
  try {
    const response = await api.get(`${apiUrl}/risk/default`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRisk = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/risk`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
