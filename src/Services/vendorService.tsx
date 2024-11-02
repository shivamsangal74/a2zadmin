import api from "./Axios/api";
import { apiUrl } from "../Utills/constantt";
import axios from "axios";

export const saveVendor = async (vendorData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${apiUrl}/vendor`, vendorData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveLappuNo = async (vendorData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${apiUrl}/vendor/add-lappu`,
      vendorData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addVendorBankAccount = async (vendorData: any) => {
  try {
    const response = await api.post(`${apiUrl}/vendor/add-bank`, vendorData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getVendorBanks = async (vendorId: string) => {
  try {
    const response = await api.get(`${apiUrl}/vendor/bank/${vendorId}`, {
      withCredentials: true,
    });
    return response.data.vendorBank;
  } catch (error: any) {
    console.error(
      "Error fetching vendor banks:",
      error?.response?.data || error.message
    );
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vendor banks"
    );
  }
};

export const getVendors = async () => {
  try {
    const response = await api.get(`${apiUrl}/vendor`, {
      withCredentials: true,
    });
    return response.data.vendor;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStockLedger = async () => {
  try {
    const response = await api.get(`${apiUrl}/vendor/stock-ledger`, {
      withCredentials: true,
    });
    return response.data.stockData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLappu = async () => {
  try {
    const response = await api.get(`${apiUrl}/vendor/lappu`, {
      withCredentials: true,
    });
    return response.data.lappu;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteLappuId = async (lappuId: any) => {
  try {
    const response = await api.delete(
      `${apiUrl}/vendor/lappu/${lappuId}`, // Include lappuId in the URL
      {
        withCredentials: true,
      }
    );
    return response.data; // Return the response data directly
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteVendorId = async (vendorId: any) => {
  try {
    const response = await api.delete(`${apiUrl}/vendor/${vendorId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOprators = async () => {
  try {
    const response = await api.get(`${apiUrl}/vendor/getOpratersForAddFund`, {
      withCredentials: true,
    });
    return response.data.op;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verifyGst = async (gstno: string) => {
  try {
    const response = await api.post(
      `${apiUrl}/vendor/verify-gst`,
      {
        gstIn: gstno,
      },
      {
        withCredentials: true,
      }
    );
    return response.data.gstInfo;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addStockServices = async (AddStockData: any) => {
  try {
    const response = await api.post(
      `${apiUrl}/vendor/add-stock`,
      AddStockData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const reverseStockServices = async (AddStockData: any) => {
  try {
    const response = await api.post(
      `${apiUrl}/vendor/reverse-stock`,
      AddStockData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
};

export const getVendorPayments = async () => {
  try {
    const response = await api.get(`${apiUrl}/vendorpayment/`, {
      withCredentials: true,
    });
    return response.data.payments;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const handleStocksPay = async (data: any) => {
  try {
    const response = await api.post(
      `${apiUrl}/vendorpayment/receive-payment`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
};
