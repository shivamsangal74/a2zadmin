import React, { useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import api from "../../Services/Axios/api";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import MapSelector from "../../components/LocationMap";
import { Dialog } from "@mui/material";
import map from "../../images/maps.svg";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

export const ApesUsers = () => {
  const [openMapModal, setOpenMapModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [mapContext, setMapContext] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const handleMapClick = (row: any, context: string) => {
    setSelectedRow(row);
    setMapContext(context);
    setOpenMapModal(true);
  };

  const handleSelectLocation = async (location: any) => {
    try {
      await api.post("/apes/updateaepsuser", {
        mobile: selectedRow.mobile,
        ...location,
        type: mapContext,
      });
      toast.success(`Location updated successfully for ${mapContext}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setOpenMapModal(false);
  };

  const formatDateToISO = (utcDateString: string) => {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.getTime() + 330 * 60000);
    return localDate.toISOString().replace("Z", "").replace("T", " ");
  };

  const { isLoading, data } = useQuery({
    queryKey: ["allaepsusers"],
    queryFn: async () => {
      const response = await api.post("/apes/allaepsusers");
      return response.data;
    },
    refetchOnWindowFocus: true,
  });

  const groupedData = data?.reduce((acc: Record<string, any[]>, item: any) => {
    const id = item.userId;
    if (!acc[id]) acc[id] = [];
    acc[id].push(item);
    return acc;
  }, {});

  const toggleRow = (userId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <DefaultLayout isList={false}>
      <Breadcrumb pageName="Credopay Users List" />
      {isLoading && <Loader />}

      {groupedData ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Email</th>
                <th className="p-3">Expand</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedData).map(([userId, rows]: any, index) => {
                const mainRow = rows[0];
                const isExpanded = expandedRows[userId];

                return (
                  <React.Fragment key={userId}>
                    <tr className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-semibold">{userId}</td>
                      <td className="p-3">{mainRow.name}</td>
                      <td className="p-3">{mainRow.mobile}</td>
                      <td className="p-3">{mainRow.email}</td>
                      <td className="p-3">
                        <button onClick={() => toggleRow(userId)}>
                          {isExpanded ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan={6}>
                          {rows.map((row: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-4 border-t border-gray-300 grid md:grid-cols-4 gap-4">
                              <div>
                                <p>
                                  <strong>Address:</strong> {row.address}
                                </p>
                                <p>
                                  <strong>Aadhaar:</strong> {row.aadhar}
                                </p>
                                <p>
                                  <strong>PAN:</strong> {row.pan}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Latitude:</strong> {row.latitude}
                                </p>
                                <p>
                                  <strong>Longitude:</strong> {row.longitude}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Type:</strong> {row.type}
                                </p>
                                <p>
                                  <strong>Reg Date:</strong>{" "}
                                  {formatDateToISO(row.reg_date)}
                                </p>
                              </div>
                              <div className="flex gap-4 items-start flex-wrap">
                                {row.type === "instantpay" && (
                                  <div className="flex items-center gap-1">
                                    <img
                                      src={map}
                                      alt="instantPay"
                                      className="cursor-pointer"
                                      height={30}
                                      width={30}
                                      onClick={() =>
                                        handleMapClick(row, "instantPay")
                                      }
                                    />
                                    <span>InstantPay</span>
                                  </div>
                                )}

                                {row.type === "paysprint" && (
                                  <div className="flex items-center gap-1">
                                    <img
                                      src={map}
                                      alt="paySprint"
                                      className="cursor-pointer"
                                      height={30}
                                      width={30}
                                      onClick={() =>
                                        handleMapClick(row, "paySprint")
                                      }
                                    />
                                    <span>PaySprint</span>
                                  </div>
                                )}

                                {row.type === "credopay" && (
                                  <div className="flex items-center gap-1">
                                    <img
                                      src={map}
                                      alt="credoPay"
                                      className="cursor-pointer"
                                      height={30}
                                      width={30}
                                      onClick={() =>
                                        handleMapClick(row, "credoPay")
                                      }
                                    />
                                    <span>CredoPay</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Records Found</p>
      )}

      <Dialog
        open={openMapModal}
        onClose={() => setOpenMapModal(false)}
        maxWidth="md"
        fullWidth>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 capitalize">
            Select Location for {mapContext}
          </h2>
          <MapSelector onLocationSelect={handleSelectLocation} />
        </div>
      </Dialog>
    </DefaultLayout>
  );
};
