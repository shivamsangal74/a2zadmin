import api from "./Axios/api";

export async function getOpraters(id: string) {
  try {
    const response = await api.post(
      `/operator/getopraterbyid`,
      { id },
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

export async function addCommission(commData: any) {
  try {
    const response = await api.post(
      `/commission`,
      { commData },
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

export async function getCommissions() {
  try {
    const response = await api.get(`/commission`, {
      withCredentials: true,
    });
    return response.data.allCommissions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCommissionsData(id: any) {
  try {
    const response = await api.get(`/commission/data/${id}`, {
      withCredentials: true,
    });
    return response.data.allCommissions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCommmissionBySponsor(id: any) {
  try {
    const response = await api.get(`/commission/sponsor/${id}`, {
      withCredentials: true,
    });
    return response.data.allCommissions.length > 0
      ? response.data.allCommissions[0]
      : [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCommission(id: any) {
  try {
    const response = await api.get(`/commission/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCommissions(commId: string, updatedCommData: any) {
  try {
    const response = await api.post(
      `/commission/updatecommission`,
      { commId, updatedCommData },
      {
        withCredentials: true,
      }
    );
    return response.data.allCommissions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateBulkCommissions(
  commId: string,
  updatedCommData: any
) {
  try {
    const response = await api.post(
      `/commission/updateBulkcommission`,
      { commId, updatedCommData },
      {
        withCredentials: true,
      }
    );
    return response.data.allCommissions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCommissions(id: any) {
  try {
    const response = await api.get(`/commission/delete/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
