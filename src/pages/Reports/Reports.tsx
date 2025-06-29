import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import { DropSearch } from "../../components/DropDown/DropSearch";
import { ButtonLabel } from "../../components/Button/Button";
import Loader from "../../common/Loader";
import type { DatePickerProps, TimeRangePickerProps } from "antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import TextInput from "../../components/Input/TextInput";
import { apiUrl } from "../../Utills/constantt";
import DropDownCheakBox from "../../components/DropDown/DropDownCheakBox";
import {
  Close,
  CropSquareSharp,
  Loyalty,
  SendOutlined,
} from "@mui/icons-material";
import { BsGlobe } from "react-icons/bs";
import api from "../../Services/Axios/api";
import { toast } from "react-toastify";
import { Select, Option, Textarea, Spinner } from "@material-tailwind/react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  Error,
  CompareArrows,
  Refresh,
  TransferWithinAStation,
} from "@mui/icons-material"; // MUI Icons
import DropDown from "../../components/DropDown/DropDown";
import CheckBox from "@mui/icons-material/CheckBox";
import StatsDisplay from "../../components/DisplatStats";
import Popup from "../../components/Model/Model";

interface reportsProps {
  entity: string;
  report_id: string;
}

const Reports: React.FC<reportsProps> = ({ entity, report_id }) => {
  const [reportData, setReportData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [searchCondition, setSearchCondition] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isProcessing, setisProcessing] = useState(false);
  const [timeRange, setTimeange] = useState("");

  const last30Days = () => {
    let startDate = dayjs().startOf("day");
    if (report_id == "2_15") {
      startDate = dayjs().startOf("month");
    }
    const endDate = dayjs().endOf("day");
    const value = `createdDate between '${startDate.format(
      "YYYY-MM-DD HH:mm:ss"
    )}' and '${endDate.format("YYYY-MM-DD HH:mm:ss")}'`;
    return { startDate, endDate, value };
  };

  function formatDateString(dateString: any) {
    if (report_id == "1_3") {
      return dateString;
    }
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, "0");

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  }
  const { startDate, endDate, value: last30DaysDateRange } = last30Days();

  const [dateRange, setDateRange] = useState(last30DaysDateRange);
  const { RangePicker } = DatePicker;

  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  const handleLast30DaysDateRange = () => {
    // Get the start of the current day (00:00:00)
    let startDate = moment().startOf("day");
    if (report_id == "2_15") {
      startDate = moment().startOf("month");
    }

    // Get the end of the current day (23:59:59)
    const endDate = moment().endOf("day");

    // Format the value as a date range string
    const value = `createdDate between '${startDate.format(
      "YYYY-MM-DD HH:mm:ss"
    )}' and '${endDate.format("YYYY-MM-DD HH:mm:ss")}'`;

    return value;
  };

  const handleCurrentDayDateRange = () => {
    // Get the start of the current day (00:00:00)
    const startDate = moment().startOf("day");

    // Get the end of the current day (23:59:59)
    const endDate = moment().endOf("day");

    // Format the value as a date range string
    const value = `createdDate between '${startDate.format(
      "YYYY-MM-DD HH:mm:ss"
    )}' and '${endDate.format("YYYY-MM-DD HH:mm:ss")}'`;

    return value;
  };

  useEffect(() => {
    // Fetch report data from the API
    const fetchReportData = async () => {
      try {
        const response = await api.post(apiUrl + "/report/dynamicReport", {
          report_id: report_id,
          Entity: entity,
        });

        if (!response.data || Object.keys(response.data).length === 0) {
          // Delay setting data if it's empty
          setTimeout(() => {
            setReportData(response.data);
          }, 2000); // 2 seconds delay
        } else {
          setReportData(response.data);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [entity, report_id]);

  useEffect(() => {
    if (!reportData) return;
    const handleGetReportData = async () => {
      try {
        const response = await api.post(apiUrl + "/report/getReportData", {
          report_id: report_id,
          Entity: entity,
          filters: filters,
          dateRange: handleLast30DaysDateRange(),
        });
        setTableData(response.data ?? []);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    handleGetReportData();
  }, [reportData]);

  const handleFilterChange = (
    filterName: string,
    filterValue: any,
    drop: any
  ) => {
    if (filterName.includes("serachCondition")) {
      setSearchValue(filterValue);
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [`dropdown[${drop}]`]: `${filterName} = '${filterValue}'`,
    }));
  };

  const handleMultiFilterChange = (
    filterValue: any,
    filterName: string,
    drop: any
  ) => {
    const sqlInClause = `IN ('${filterValue.join("','")}')`;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [`dropdown[${drop}]`]: `${filterName} ${sqlInClause}`,
    }));
  };
  const handleDateRange = (DateModel: any, startDate: any, endDate: any) => {
    const start = moment(startDate.$d)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    const end = moment(endDate.$d).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    const value = `${DateModel} between '${start}' and '${end}'`;
    setDateRange(value);
  };

  async function settlementStatusChange(value: any, params: any, options: any) {
    try {
      setisProcessing(true);
      let tranxId = params.row.original.requestId;
      const response = await api.post(`/settelment/manual-setllement`, {
        tranxId: tranxId,
        value: value,
        otherValues: options,
      });
      toast.warn("Settlment Status Updated");
      await handleGetReportData();
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    } finally {
      setisProcessing(false);
    }
  }

  async function handleStatusChange(value: any, params: any) {
    setLoading(true);
    try {
      let tranxId = params.row.original.refid;
      const response = await api.get(`/common/manual-status`, {
        params: { tranxId, value },
        withCredentials: true,
      });
      toast.warn("Recharge Status Updated");
      await handleGetReportData();
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }
  async function handleResendRequest(params: any) {
    try {
      let tranx = params.row.original.refid;
      const response = await api.get(`/common/resend-recharge`, {
        params: { tranx },
        withCredentials: true,
      });
      toast.warn(response.data.message);
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    } finally {
    }
  }

  async function handleCheckStatus(params: any) {
    debugger;
    setisProcessing(true);
    try {
      let tranx = params.row.original.refid;
      const response = await api.get(`/common/check-status`, {
        params: { tranx },
        withCredentials: true,
      });
      toast.warn(response.data.message);
      handleGetReportData();
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error);
    } finally {
      setisProcessing(false);
    }
  }

  async function handleCheckStatusApes(params: any) {
    setLoading(true);
    debugger;
    try {
      let tranx = params.row.original.refId;
      let Date = moment(params.row.original.createdDate).format("YYYY-MM-DD");
      debugger;
      const response = await api.post(
        `/money/checkinstantpaystatus`,
        { externalRef: tranx, transactionDate: Date },
        {
          withCredentials: true,
        }
      );
      let resp = response.data;
      if (resp.status == "Success") {
        await apesStatusChange("Success", params);
        await handleGetReportData();
        toast.success(resp.response);
      } else if (resp.status == "Pending") {
        toast.warn(resp.response);
      } else if (resp.status == "Failed") {
        await apesStatusChange("Failed", params);
        await handleGetReportData();
        toast.error(resp.response);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckStatusMoney(params: any) {
    setLoading(true);
    debugger;
    try {
      let tranx = params.row.original.refId;
      let Date = moment(params.row.original.createdDate).format("YYYY-MM-DD");
      debugger;
      const response = await api.post(
        `/money/checkinstantpaystatus`,
        { externalRef: tranx, transactionDate: Date },
        {
          withCredentials: true,
        }
      );
      let resp = response.data;
      if (resp.status == "Success") {
        await moneyStatusChange("Success", params);
        await handleGetReportData();
        toast.success(resp.response);
      } else if (resp.status == "Pending") {
        toast.warn(resp.response);
      } else if (resp.status == "Failed") {
        await moneyStatusChange("Failed", params);
        await handleGetReportData();
        toast.error(resp.response);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function apesStatusChange(value: any, params: any) {
    setLoading(true);
    try {
      let tranxId = params.row.original.refId;
      const response = await api.post(`/apes/manual-apes`, {
        tranxId: tranxId,
        value: value,
      });
      toast.warn("Apes Status Updated");
      await handleGetReportData();
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function moneyStatusChange(value: any, params: any) {
    debugger;
    try {
      let tranxId = params.row.original.refId;
      const response = await api.post(`/money/manual-money`, {
        tranxId: tranxId,
        value: value,
      });
      toast.warn("Money transfer Status Updated");
      await handleGetReportData();
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    } finally {
    }
  }

  async function handleGetReportData() {
    try {
      let search;
      if (searchCondition) {
        search = `${searchValue} = '${searchCondition}'`;
      }
      const response = await api.post(apiUrl + "/report/getReportData", {
        report_id: report_id,
        Entity: entity,
        filters: filters,
        dateRange: dateRange,
        search: search,
        timeRange: timeRange,
      });

      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DefaultLayout isList>
        <Loader />
      </DefaultLayout>
    );
  }
  const renderStatus = (status: any) => {
    switch (status.toLowerCase()) {
      case "success":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle />
            <span>Success</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <HourglassEmpty />
            <span>Pending</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <Error />
            <span>Failed</span>
          </div>
        );
      case "reverse":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Refresh />
            <span>Reverse</span>
          </div>
        );
      case "transfer":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <TransferWithinAStation />
            <span>Transfer</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-pink-500">
            <Loyalty />
            <span>{status}</span>
          </div>
        );
    }
  };

  function finalValue(index: any) {
    let value = filters[`dropdown[${index}]`]
      ? filters[`dropdown[${index}]`].split("=")[1].replace(/'/g, "").trim()
      : "";

    return isNaN(value) ? value : Number(value);
  }

  function finalMultipleValue(index: any) {
    let value = filters[`dropdown[${index}]`]
      ? filters[`dropdown[${index}]`]
      : "";

    return isNaN(value) ? value : Number(value);
  }

  const maskAadhaar = async (aadhaar: string) => {
    const maskedAadhaar =
      aadhaar.slice(0, 8).replace(/\d/g, "*") + aadhaar.slice(8);

    return maskedAadhaar;
  };

  const columns =
    reportData?.Report?.DisplayColumns?.map((col) => {
      let columnConfig = {
        header: col.name,
        accessorKey: col.prop,
        size: 190,
      };
      if (col.prop == "createdDate") {
        columnConfig.size = 120;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div>{formatDateString(info.getValue())}</div>
          </div>
        );
      }
      if (col.prop == "aadhar") {
        columnConfig.size = 120;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div>
              {info.row.original.aadhar
                ? (
                    info.row.original.aadhar.slice(0, 8).replace(/\d/g, "X") +
                    info.row.original.aadhar.slice(8)
                  ).toUpperCase()
                : "N/A"}
            </div>
          </div>
        );
      }

      if (col.prop == "pltform") {
        columnConfig.size = 50;
        columnConfig.cell = (info) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {info.row.original.pltform == "Web" ? <BsGlobe /> : info.getValue()}
          </div>
        );
      }

      if (col.prop == "tranxDesc") {
        columnConfig.size = 220;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            {info.getValue()}
          </div>
        );
      }
      if (col.prop == "") {
        columnConfig.size = 150;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <CheckBox
              titleAccess="Success"
              onClick={() => {
                if (info.row.original.status !== "Success") {
                  handleStatusChange("Success", info);
                }
              }}
              style={{
                cursor:
                  info.row.original.status === "Success"
                    ? "not-allowed"
                    : "pointer",
              }}
            />
            <Close
              titleAccess="Failed"
              onClick={() => {
                if (info.row.original.status !== "Failed") {
                  handleStatusChange("Failed", info);
                }
              }}
              style={{
                marginLeft: "10px",
                cursor:
                  info.row.original.status === "Failed"
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </div>
        );
      }
      if (col.prop === "settlment_manual") {
        columnConfig.size = 150;
        columnConfig.cell = (info) => {
          const [popupOpen, setPopupOpen] = useState(false);
          const [remark, setRemark] = useState("");
          const [bankRefId, setBankRefId] = useState("");

          const handleSettlement = async (status) => {
            debugger;
            const mode = info.row.original.mode;

            if (mode === "Cash") {
              await settlementStatusChange(status, info, {});
            } else if (status == "Failed") {
              await settlementStatusChange(status, info, {});
            } else if (mode === "NEFT") {
              setPopupOpen(true);
            }
          };

          const handlePopupSubmit = async () => {
            settlementStatusChange("Success", info, {
              bankRefId,
              remark,
            }).finally(() => {
              setPopupOpen(false);
            });
          };

          return (
            <div style={{ textAlign: "center" }}>
              <CheckBox
                titleAccess="Success"
                onClick={() => {
                  if (info.row.original.status !== "Success") {
                    handleSettlement("Success");
                  }
                }}
                style={{
                  cursor:
                    info.row.original.status === "Success"
                      ? "not-allowed"
                      : "pointer",
                }}
              />
              <Close
                titleAccess="Failed"
                onClick={() => {
                  if (info.row.original.status !== "Failed") {
                    handleSettlement("Failed");
                  }
                }}
                style={{
                  marginLeft: "10px",
                  cursor:
                    info.row.original.status === "Failed"
                      ? "not-allowed"
                      : "pointer",
                }}
              />

              {popupOpen && (
                <Popup
                  title={"NEFT Settlement Details"}
                  isOpen={popupOpen}
                  onClose={() => setPopupOpen(false)}
                >
                  <div className="mt-2">
                    <TextField
                      size="small"
                      label="bankRefId"
                      placeholder="Bank Reference ID"
                      fullWidth
                      onChange={(e) => setBankRefId(e.target.value)}
                      value={bankRefId}
                    />
                  </div>

                  <div className="mt-5">
                    <Textarea
                      label="Remark"
                      placeholder="Remark"
                      value={remark || " "}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between mt-10">
                    <ButtonLabel
                      loader={isProcessing}
                      onClick={handlePopupSubmit}
                      label="Submit"
                    />

                    <ButtonLabel
                      loader={isProcessing}
                      style={{ backgroundColor: "red" }}
                      onClick={() => setPopupOpen(false)}
                      label="Cancel"
                    />
                  </div>
                </Popup>
              )}
            </div>
          );
        };
      }
      if (col.prop == "status") {
        columnConfig.size = 150;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div className="flex gap-2 items-center">
              {/* Info section */}
              {/* <div className="info text-base">{info.getValue()}</div> */}

              {/* Status section */}
              <div className="status" style={{ width: "100px" }}>
                {renderStatus(info.row.original.status)}
              </div>

              {/* Action buttons (display only if status is not "Success") */}
              {report_id === "2_4" && info.row.original.status == "Pending" && (
                <div className="action flex gap-3 items-center">
                  <button
                    onClick={() => handleResendRequest(info)}
                    className="p-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-all duration-300"
                  >
                    <Refresh titleAccess="Resend Status" /> {/* Resend Icon */}
                  </button>

                  {info.row.original.status === "Pending" && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleCheckStatus(info)}
                      className={`p-2 text-white rounded cursor-pointer transition-all duration-300 ${
                        isProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isProcessing ? (
                        <Spinner />
                      ) : (
                        <CompareArrows titleAccess="Check Status" />
                      )}
                      {/* Check Status Icon */}
                    </button>
                  )}
                </div>
              )}
            </div>

            {report_id === "2_10" && info.row.original.status == "Pending" && (
              <div className="action flex gap-3 items-center">
                {info.row.original.status === "Pending" && (
                  <button
                    onClick={() => handleCheckStatusApes(info)}
                    className="p-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-all duration-300"
                  >
                    <CompareArrows titleAccess="Check Status" />{" "}
                    {/* Check Status Icon */}
                  </button>
                )}
              </div>
            )}

            {report_id === "2_5" && info.row.original.status == "Pending" && (
              <div className="action flex gap-3 items-center">
                {info.row.original.status === "Pending" && (
                  <button
                    onClick={() => handleCheckStatusMoney(info)}
                    className="p-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-all duration-300"
                  >
                    <CompareArrows titleAccess="Check Status" />{" "}
                    {/* Check Status Icon */}
                  </button>
                )}
              </div>
            )}
            {/* <div className="flex gap-2">
            <div className="info">{info.getValue()}</div>
            {info.row.original.status !== "Success" && (
              <div className="action flex gap-3">
                <SendOutlined onClick={() => handleResendRequest(info)} />
                <Refresh onClick={() => handleCheckStatus(info)} />
              </div>
            )}
          </div> */}
          </div>
        );
      }

      if (col.prop == "message") {
        console.log(col);
        columnConfig.size = 250;
        columnConfig.cell = (row) => (
          <div style={{ textAlign: "center" }}>
            {(() => {
              const response = row.row.original.response;
              if (!response) return response;

              try {
                const parsedResponse = JSON.parse(response);

                return (
                  parsedResponse?.message ||
                  parsedResponse?.status ||
                  parsedResponse?.response_description ||
                  parsedResponse?.message ||
                  response
                );
              } catch (e) {
                return response;
              }
            })()}
          </div>
        );
      }

      if (col.prop == "money_manual") {
        columnConfig.size = 150;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <CheckBox
              titleAccess="Success"
              onClick={() => {
                if (info.row.original.status !== "Success") {
                  moneyStatusChange("Success", info);
                }
              }}
              style={{
                cursor:
                  info.row.original.status === "Success"
                    ? "not-allowed"
                    : "pointer",
              }}
            />
            <Close
              titleAccess="Failed"
              onClick={() => {
                if (info.row.original.status !== "Failed") {
                  moneyStatusChange("Failed", info);
                }
              }}
              style={{
                marginLeft: "10px",
                cursor:
                  info.row.original.status === "Failed"
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </div>
        );
      }

      if (
        col.prop == "OpName" ||
        col.prop == "amount" ||
        col.prop == "gst" ||
        col.prop == "tds" ||
        col.prop == "apiBal" ||
        col.prop == "reportType"
      ) {
        columnConfig.size = 100;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
            }}
          >
            {info.getValue()}
          </div>
        );
      }

      return columnConfig;
    }) ?? [];

  const filterableColumns = reportData?.Report?.DropDowns ?? [];
  const _search = filterableColumns.some((item: any) =>
    item.includes("serachCondition")
  );
  const filterableDisplayColumns =
    reportData?.Report?.DropDownDisplayName ?? [];
  const DateModel = reportData?.Report?.DateModel ?? "";
  const dropdownValues = reportData?.DropDowns?.[0] ?? {};

  function finalValue(index: any) {
    let value = filters[`dropdown[${index}]`]
      ? filters[`dropdown[${index}]`].split("=")[1].replace(/'/g, "").trim()
      : "";

    return isNaN(value) ? value : Number(value);
  }

  const onChangeMonth: DatePickerProps["onChange"] = (
    dateModel: any,
    selectedDate: any
  ) => {
    debugger;
    const startOfMonth = moment(selectedDate.$d)
      .startOf("month")
      .format("YYYY-MM-DD HH:mm:ss");
    const endOfMonth = moment(selectedDate.$d)
      .endOf("month")
      .format("YYYY-MM-DD HH:mm:ss");

    const value = `${dateModel} between '${startOfMonth}' and '${endOfMonth}'`;
    console.log(value);
    setDateRange(value);
  };

  function calculateStatusAndAmountTotals(dataArray: any) {
    const totals = {
      success: { count: 0, amount: 0 },
      pending: { count: 0, amount: 0 },
      fail: { count: 0, amount: 0 },
      others: { count: 0, amount: 0 }, // For unexpected statuses
    };

    dataArray.forEach((item: any) => {
      let opNames = ["AadharPay", "withdrawal"];
      if (report_id == "2_10") {
        if (opNames.includes(item?.OpName)) {
          console.log(item?.OpName);

          const status = item?.status && item?.status.trim().toLowerCase(); // Normalize case (all lowercase)
          const amount = parseFloat(item.amount) || 0; // Ensure valid numeric amount

          if (status === "success") {
            totals.success.count += 1;
            totals.success.amount += amount;
          } else if (status === "pending") {
            totals.pending.count += 1;
            totals.pending.amount += amount;
          } else if (status === "fail" || status === "failed") {
            totals.fail.count += 1;
            totals.fail.amount += amount;
          } else {
            totals.others.count += 1;
            totals.others.amount += amount;
          }
        }
      } else {
        const status = item?.status && item?.status.trim().toLowerCase();
        const amount = parseFloat(item.amount) || 0;

        if (status === "success") {
          totals.success.count += 1;
          totals.success.amount += amount;
        } else if (status === "pending") {
          totals.pending.count += 1;
          totals.pending.amount += amount;
        } else if (status === "fail" || status === "failed") {
          totals.fail.count += 1;
          totals.fail.amount += amount;
        } else {
          totals.others.count += 1;
          totals.others.amount += amount;
        }
      }
    });

    return totals;
  }

  const totalAmount =
    tableData &&
    tableData.length > 0 &&
    calculateStatusAndAmountTotals(tableData);

  const timeOptions = [
    {
      showvalue: "0AM - 12PM (BATCH 1)",
      value: { start: "00:00:00", end: "11:59:59" },
    },
    {
      showvalue: "12PM - 4PM (BATCH 2)",
      value: { start: "12:00:00", end: "15:59:59" },
    },
    {
      showvalue: "4PM - 7PM (BATCH 3)",
      value: { start: "16:00:00", end: "18:59:59" },
    },
    {
      showvalue: "7PM - 12AM (BATCH 4)",
      value: { start: "19:00:00", end: "23:59:59" },
    },
  ];

  return (
    <DefaultLayout isList>
      <div className="flex-1">
        <h1 className="text-dark-400">{reportData?.Report?.ReportName}</h1>
      </div>
      <div className="flex gap-5 w-full justify-between items-center mt-4 mb-2">
        <div className="flex gap-5 flex-wrap" style={{ flex: 2 }}>
          {report_id != "2_15" && (
            <div className="mb-2">
              <RangePicker
                style={{ height: "45px" }}
                presets={[
                  {
                    label: (
                      <span aria-label="Current Time to End of Day">Today</span>
                    ),
                    value: () => [dayjs().startOf("day"), dayjs().endOf("day")],
                  },
                  ...rangePresets,
                ]}
                onChange={(val) => {
                  if (val) {
                    const startDate = val[0];
                    const endDate = val[1];
                    handleDateRange(DateModel, startDate, endDate);
                  }
                }}
                defaultValue={[startDate, endDate]}
              />
            </div>
          )}
          {report_id == "2_15" && (
            <div>
              <DatePicker
                style={{ height: "45px" }}
                onChange={(val) => {
                  if (val) {
                    onChangeMonth(DateModel, val);
                  }
                }}
                picker="month"
                defaultValue={[startDate]}
              />
            </div>
          )}
          {filterableColumns.map((filterName, index) => (
            <div
              key={filterName}
              className="mb-2"
              style={{ width: filterName.includes("userId") ? "35%" : "18%" }}
            >
              {filterName == "tm.paymentType" || filterName == "tm.status" ? (
                <DropDownCheakBox
                  label={filterableDisplayColumns[index]}
                  place2={filterName}
                  drop={index}
                  isLoading={false}
                  isFilter={true}
                  options={[...dropdownValues[index]]}
                  value={finalMultipleValue(index)}
                  onChange={handleMultiFilterChange}
                />
              ) : (
                <DropSearch
                  value={finalValue(index) || ""}
                  place2={filterName}
                  onchange={handleFilterChange}
                  placeholder={filterableDisplayColumns[index]}
                  drop={index}
                  options={[...dropdownValues[index]]}
                  error={""}
                  isFilter={true}
                />
              )}
            </div>
          ))}

          {_search && (
            <div className="mb-2">
              <TextInput
                value={searchCondition}
                label={"Search"}
                name={"Search"}
                onChange={setSearchCondition}
                isModel={false}
              />
            </div>
          )}
          {(report_id == "2_10" || report_id == "2_17") && (
            <div style={{ width: "35%" }}>
              <DropSearch
                value={JSON.stringify(timeRange) || ""}
                place2={"timeRange"}
                onchange={(name: any, value: any) => {
                  setTimeange(JSON.parse(value));
                }}
                placeholder={"Select TimeRange"}
                options={timeOptions.map((opt) => ({
                  showvalue: opt.showvalue,
                  value: JSON.stringify(opt.value), // serialize for transport
                }))}
                error={""}
                isFilter={true}
              />
            </div>
          )}
          <ButtonLabel label="Get Data" onClick={handleGetReportData} />
        </div>
      </div>

      {report_id != "2_15" && <StatsDisplay stats={totalAmount} />}

      <BasicTable
        data={tableData}
        columns={columns}
        isFilters={true}
        filter={["status", "sponsorId"]}
        isSeachable={true}
        isReport={true}
        report_id={report_id}
        isShowSeq={report_id == "2_15" ? true : false}
      />
    </DefaultLayout>
  );
};

export default Reports;
