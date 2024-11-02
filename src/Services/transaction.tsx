import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";

export const addTranx = async (tranxData: any) => {
  try {
    const response = await api.post(`${apiUrl}/transaction`, tranxData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLatestCashData = async () => {
  try {
    const response = await api.get(`/cash`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllTranx = async () => {
  try {
    const response = await api.get(`/transaction`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
