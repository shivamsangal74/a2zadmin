import api from "./Axios/api";
export async function getCircleState() {
  try {
    const response = await api.get("/circle-state", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getState() {
  try {
    const response = await api.get("/common/state", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getInstantPayBank() {
  try {
    const response = await api.get("/common/instantPayBank", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function verifyInstantPayBank(data: any) {
  try {
    const response = await api.post("/common/instantBankVerify", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function getBankList() {
  try {
    const response = await api.get("/bank/getBanks", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function editBank(data: any) {
  try {
    const response = await api.patch("/bank/editBank", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function getAdminBankList() {
  try {
    const response = await api.get("/bank/getAdminBanks", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function getModes() {
  try {
    const response = await api.get("/bank/getMode", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function saveAdminBankList(data: any) {
  try {
    const response = await api.post("/bank/saveAdminBanks", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function saveMode(data: any) {
  try {
    const response = await api.post("/bank/saveMode", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function getFundRequest() {
  try {
    const response = await api.get("/fund-request", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    throw errorMessage;
  }
}

export async function updateFundRequest(data: any) {
  try {
    const response = await api.post("/fund-request/status", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    throw errorMessage;
  }
}

export async function cancelFundRequest(data: any) {
  try {
    const response = await api.post("/fund-request/cancel", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    throw errorMessage;
  }
}

export async function getUserBankList() {
  try {
    const response = await api.get("/bank/getUserBanks", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    return { error: true, message: errorMessage };
  }
}

export async function getAllUserBankList(userId: any) {
  try {
    const response = await api.post(
      "/bank/getAllUserBanks",
      { userId },
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
}

export async function updateUserBank(
  userId: any,
  column: any,
  value: any,
  col1: any
) {
  try {
    const response = await api.post(
      "/bank/updateUserBank",
      { userId, column, value, col1 },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    throw errorMessage;
  }
}

export async function deleteUserBank(userId: any, col1: any) {
  try {
    const response = await api.delete("/bank/userBank", {
      data: { userId, col1 },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    throw errorMessage;
  }
}

export async function getOperatorsByCategoryCode(categoryCode: number) {
  try {
    const response = await api.post(
      "/operator/getopbtcategorycode",
      { categoryCode },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong!";
    throw errorMessage;
  }
}

export async function getLogslist(fromDate: any, toDate: any) {
  try {
    const response = await api.post(
      "/common/logs",
      { fromDate, toDate },
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
}

export async function getLogslistById(fromDate: any, toDate: any, id: any) {
  try {
    const response = await api.post(
      "/common/logs-id",
      { fromDate, toDate, id },
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
}

export type PendingReportItem = {
  source_table: "recharge" | "aeps" | "apes" | "settlement";
  pending_transaction_count: number;
};

export type PendingReportCounts = {
  recharge: number;
  aeps: number;
  settlement: number;
  total: number;
};

export const mapPendingCounts = (
  data: PendingReportItem[]
): PendingReportCounts => {
  const countFor = (...sources: string[]) =>
    data.find((d) => sources.includes(d.source_table))
      ?.pending_transaction_count ?? 0;

  const recharge = Number(countFor("recharge"));
  const aeps = Number(countFor("aeps", "apes"));
  const settlement = Number(countFor("settlement"));

  return {
    recharge,
    aeps,
    settlement,
    total: recharge + aeps + settlement,
  };
};

export async function getPendingReportCount(): Promise<PendingReportCounts> {
  try {
    const response = await api.get("/common/get-pending-report-count", {
      withCredentials: true,
    });
    const data = response.data;
    if (Array.isArray(data)) {
      return mapPendingCounts(data);
    }
    return { recharge: 0, aeps: 0, settlement: 0, total: 0 };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
