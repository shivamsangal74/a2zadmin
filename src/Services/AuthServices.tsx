import api from "./Axios/api";
export async function generateOTP(aadharNo: string) {
  try {
    const response = await api.post(
      "/api/aadhaar-otp",
      { id_number: aadharNo, document_type: "Aadhaar OTP Validation" },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function validateUser(
  email: string,
  otp: string,
  platform: string,
  identifier: string
) {
  try {
    const response = await api.post(
      "/users/login",
      {
        email: email,
        otp: otp,
        platform: platform,
        identifier: identifier,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function validateOTP(otp: string, reqId: string) {
  try {
    const response = await api.post(
      "/api/aadhaar-submit-otp",
      {
        otp: otp,
        client_id: reqId,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw (
      error?.response?.data?.message ||
      "An error occurred while validating OTP."
    );
  }
}

export async function validatePanCard(panNumber: any) {
  try {
    const response = await api.post(
      "/users/validatePancard",
      {
        panNumber: panNumber,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error?.response.data.message;
  }
}

export async function validateVoterID(VoterIdNumber: any) {
  try {
    const response = await api.post(
      "/users/validateVoterid",
      {
        VoterIdNumber: VoterIdNumber,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error?.response.data.message;
  }
}
