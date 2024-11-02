import axios from "axios";
import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";

export const addCategory = async (formdata: any) => {
  try {
    const response = await api.post(`${apiUrl}/category`, formdata, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const addOperator = async (formdata: any) => {
  try {
    const response = await api.post(`${apiUrl}/operator`, formdata, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error?.response?.data?.message;
  }
};

export const getAllCategorys = async () => {
  try {
    const response = await api.get(`/category`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllOperators = async () => {
  try {
    const response = await api.get("/operator", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOperator = async (id: string) => {
  try {
    const response = await api.get("/operator/id?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategory = async (id: string) => {
  try {
    const response = await api.get("/category/id?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategoryByServiceId = async (id: string) => {
  try {
    const response = await api.get(
      "/category/getCategoryByServiceId/id?id=" + id,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteOperator = async (id: string) => {
  try {
    const response = await api.delete("/operator?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete("/category?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateOperators = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/operator`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/category`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOnCategory = async () => {
  try {
    const response = await api.get("/category/on", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// fund apis

export const getFund = async (id: string) => {
  try {
    const response = await api.get("/fund/id?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllFunds = async () => {
  try {
    const response = await api.get("/fund", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getFundsOn = async () => {
  try {
    const response = await api.get("/fund/on", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFundType = async () => {
  try {
    const response = await api.get("/fund-type/on", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addFund = async (formdata: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/fund`, formdata, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Add the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateFund = async (data: any, id: any) => {
  try {
    const response = await api.patch(
      `/fund`,
      { newData: { ...data }, id: id },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteFund = async (id: string) => {
  try {
    const response = await api.delete("/fund?id=" + id, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
