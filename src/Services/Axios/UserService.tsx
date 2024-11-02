import axios from "axios";
import api from "./api";
import { apiUrl } from "../../Utills/constantt";

export const getUser = async (type: string) => {
  try {
    const response = await api.post(
      "/users/bytype",
      { type: type },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users/", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserWithCredits = async () => {
  try {
    const response = await api.get("/users/with-credits", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCreditsData = async () => {
  try {
    const response = await api.get("/users/credits", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserWithId = async (userid: string) => {
  try {
    const response = await api.get(`/users/getuserinfo/${userid}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const UpdateUserInfo = async (data: any, userid: any) => {
  try {
    const response = await api.patch(
      `/users/updateuser`,
      { userData: { ...data }, userId: userid },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserKyc = async (userId: any) => {
  try {
    const response = await api.get(`/users-kyc?userId=${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserKycFiles = async (userId: any) => {
  try {
    const response = await api.get(`/users-kyc/files/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addUser = async (userData: any) => {
  try {
    const response = await api.post("/users", userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const addUserKyc = async (userKycData: any) => {
  try {
    const response = await api.post("/users-kyc", userKycData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateKycStatus = async (userkycdata: any) => {
  try {
    const response = await api.post("/users-kyc/updateKycStatus", userkycdata, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserDeatils = async (userid: any) => {
  try {
    const response = await api.get(`/users/getuserinfo/${userid}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const uploadDoc = async (
  userid: string,
  doctype: string,
  formdata: any
) => {
  console.log(userid, doctype, formdata);

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${apiUrl}/users-kyc/upload/${userid}/${doctype}`,
      formdata,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
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

export const getUserInfoByNumber = async (userNumber: any) => {
  try {
    const response = await api.get(`/users/getuserinfobynumber/${userNumber}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveautoFillData = async (data: any) => {
  try {
    const response = await api.post(`/users/auto-fill`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getautoFillData = async (userId: any) => {
  try {
    const response = await api.get(`/users/auto-fill/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
