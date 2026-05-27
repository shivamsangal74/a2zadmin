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
import { BsEye, BsGlobe } from "react-icons/bs";
import DropDownCheakBox from "../../components/DropDown/DropDownCheakBox";
import {
  Close,
  CropSquareSharp,
  Loyalty,
  SendOutlined,
  ContentCopy,
} from "@mui/icons-material";
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

/** Matches backend date fields: createdDate, transactionDate, DateModel filter column, created_at, etc. */
function isReportDateColumn(
  prop: string | undefined,
  dateModel: string | undefined
): boolean {
  if (!prop) return false;
  if (dateModel && prop === dateModel) return true;
  const lower = prop.toLowerCase();
  if (lower.includes("date")) return true;
  if (/_at$/.test(lower)) return true;
  return false;
}

const Reports: React.FC<reportsProps> = ({ entity, report_id }) => {
  const [reportData, setReportData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [searchCondition, setSearchCondition] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isProcessing, setisProcessing] = useState(false);

  // UPI Popup State
  const [upiPopupOpen, setUpiPopupOpen] = useState(false);
  const [upiPopupData, setUpiPopupData] = useState<any>(null);
  const [upiPopupParams, setUpiPopupParams] = useState<any>(null);
  const [upiUtr, setUpiUtr] = useState("");
  const [upiRemark, setUpiRemark] = useState("");
  const [timeRange, setTimeange] = useState("");

  // Eye Popup State
  const [eyePopupOpen, setEyePopupOpen] = useState(false);
  const [eyePopupData, setEyePopupData] = useState("");
  const [eyePopupTitle, setEyePopupTitle] = useState("");

  const handleOpenEyePopup = (data: any, title: string) => {
    setEyePopupData(data);
    setEyePopupTitle(title);
    setEyePopupOpen(true);
  };


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

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(2); // last 2 digits

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, "0");

    // Format: 28 Apr 26 12:00:00 AM
    return `${day} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
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

  async function handleCheckUPIStatus(params: any) {
    debugger;
    setisProcessing(true);
    try {
      let tranx = params.row.original.tranxId;
      let date = params.row.original.createdDate;
      let report_type = params.row.original.report_type;
      const response = await api.get(`/payment/checkStatus`, {
        params: { tranx, date, report_type },
        withCredentials: true,
      });
      // if (response.data.status == 'Success') {
      //   toast.success(response.data.message);
      //   handleGetReportData();
      // } else {
      setUpiPopupData(response.data);
      setUpiPopupParams(params);
      setUpiPopupOpen(true);
      // }
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

  async function handlecheckStatusSettlement(params: any) {
    setLoading(true);
    debugger;
    try {
      let tranx = params.row.original.requestId;
      let Date = moment(params.row.original.createdDate).format("YYYY-MM-DD");
      debugger;
      const response = await api.post(
        `/settelment/check-status`,
        { externalRef: tranx, transactionDate: Date },
        {
          withCredentials: true,
        }
      );
      let resp = response.data;
      if (resp.status == "Success") {
        toast.success(resp.message);
        await handleGetReportData();
      } else if (resp.status == "Pending") {
        toast.warn(resp.message);
      } else if (resp.status == "Failed") {
        toast.error(resp.message);
        await handleGetReportData();
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

  async function deleteFirstRow(value: any) {
    try {
      await api.post(`/report/first-row`, {
        tranxId: value,
      });
      toast.warn("Data Updated Successfully");
      await handleGetReportData();
    }
    catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    }
  }

  if (loading) {
    return (
      <DefaultLayout isList>
        <div className="mx-auto mt-6 w-full max-w-6xl animate-fadeIn">
          <div className="mb-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-56 animate-pulse rounded-md bg-blue-200/70" />
                <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-slate-200/80" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-blue-500" />
                <span className="text-xs font-semibold tracking-wide text-blue-700">
                  Loading report data...
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-8 w-36 animate-pulse rounded bg-slate-300/80" />
                <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-center py-6">
              <Loader />
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }
  const renderStatus = (status: any) => {
    switch (status.toLowerCase()) {
      case "success":
        return (
          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
            <CheckCircle />
            <span className="font-semibold tracking-wide">Success</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
            <HourglassEmpty />
            <span className="font-semibold tracking-wide">Pending</span>
          </div>
        );
      case "failed":
      case "fail":
      case "failure":
        return (
          <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
            <Error />
            <span className="font-semibold tracking-wide">Failed</span>
          </div>
        );
      case "reverse":
        return (
          <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
            <Refresh />
            <span className="font-semibold tracking-wide">Reverse</span>
          </div>
        );
      case "transfer":
        return (
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
            <TransferWithinAStation />
            <span className="font-semibold tracking-wide">Transfer</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-fuchsia-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
            <Loyalty />
            <span className="font-semibold tracking-wide">{status}</span>
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
      if (report_id === "2_4"  && col.prop === "logs") {
        columnConfig.size = 100;
        columnConfig.cell = (info) => {
          const value = info.getValue();
          return (
            <div style={{ textAlign: "center" }}>
              <IconButton onClick={() => handleOpenEyePopup(value, "logs")}>
                <BsEye size={20} />
              </IconButton>
            </div>
          );
        };
      }
      if (report_id === "2_14"  && col.prop === "logs") {
        columnConfig.size = 100;
        columnConfig.cell = (info) => {
          const value = info.getValue();
          return (
            <div style={{ textAlign: "center" }}>
              <IconButton onClick={() => handleOpenEyePopup(value, "logs")}>
                <BsEye size={20} />
              </IconButton>
            </div>
          );
        };
      }
      if (report_id === "2_4" && col.prop?.toLowerCase() === "operatorimage") {
        columnConfig.size = 160;
        columnConfig.cell = (info) => {
          const row = info.row.original;
          const operatorImage =
            row?.operatorImage ?? row?.OperatorImage;
          const label = info.getValue();
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {operatorImage ? (
                <img
                  crossOrigin="anonymous"
                  height={36}
                  width={36}
                  src={`${operatorImage}`}
                  alt=""
                />
              ) : (
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>—</span>
              )}      
            </div>
          );
        };
      }
      if (
        isReportDateColumn(col.prop, reportData?.Report?.DateModel)
      ) {
        columnConfig.size = 180;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
              fontSize: "0.84rem",
              fontWeight: 600,
              letterSpacing: "0.2px",
              color: "#0369a1",
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
              fontSize: "0.84rem",
              fontWeight: 500,
              color: "#334155",
            }}
          >
            {info.getValue()}
          </div>
        );
      }
      if (
        col.prop === "refid" ||
        col.prop === "refId" ||
        col.prop === "TranxId" ||
        col.prop === "tranxId" ||
        col.prop === "TraxId" ||
        col.prop === "txnid"
      ) {
        columnConfig.size = 200;
        columnConfig.cell = (info) => {
          const [copied, setCopied] = useState(false);
          const value = info.getValue();

          const handleCopy = () => {
            if (value === undefined || value === null) return;
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard
                .writeText(String(value))
                .then(() => {
                  setCopied(true);
                  toast.success("Copied to clipboard");
                  setTimeout(() => setCopied(false), 1500);
                })
                .catch(() => { });
            }
          };

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  letterSpacing: "0.3px",
                  color: "#0f172a",
                  fontWeight: 600,
                }}
              >
                {value}
              </span>
              <span
                onClick={handleCopy}
                title={copied ? "Copied" : "Copy"}
                style={{
                  cursor: value ? "pointer" : "default",
                  display: "inline-flex",
                  alignItems: "center",
                  color: copied ? "#2e7d32" : "#1976d2",
                }}
              >
                {copied ? (
                  <CheckCircle sx={{ fontSize: 14 }} />
                ) : (
                  <ContentCopy sx={{ fontSize: 14 }} />
                )}
              </span>
            </div>
          );
        };
      }
      if (col.prop === "ReqId" || col.prop === "oprId") {
        columnConfig.size = 220;
        columnConfig.cell = (info) => {
          const [copiedPrimary, setCopiedPrimary] = useState(false);
          const [copiedSecondary, setCopiedSecondary] = useState(false);
          const raw = info.getValue();

          let primary = "";
          let secondary = "";

          if (Array.isArray(raw)) {
            primary = raw[0] ?? "";
            secondary = raw[1] ?? "";
          } else if (typeof raw === "string") {
            const parts = raw
              .split(/[\s,/]+/)
              .map((p) => p.trim())
              .filter(Boolean);
            primary = parts[0] ?? "";
            secondary = parts[1] ?? "";
          } else if (raw && typeof raw === "object") {
            primary = raw.primary ?? raw.main ?? "";
            secondary = raw.secondary ?? raw.alt ?? "";
          }

          const copyValue = (value: string, setCopied: (v: boolean) => void) => {
            if (!value) return;
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard
                .writeText(String(value))
                .then(() => {
                  setCopied(true);
                  toast.success("Copied to clipboard");
                  setTimeout(() => setCopied(false), 1500);
                })
                .catch(() => { });
            }
          };

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "3px",
              }}
            >
              {primary && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#334155",
                      fontWeight: 600,
                    }}
                  >
                    {primary}
                  </span>
                  <span
                    onClick={() => copyValue(primary, setCopiedPrimary)}
                    title={copiedPrimary ? "Copied" : "Copy"}
                    style={{
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      color: copiedPrimary ? "#d1d5db" : "#d1d5db",
                    }}
                  >
                    {copiedPrimary ? (
                      <CheckCircle sx={{ fontSize: 13 }} />
                    ) : (
                      <ContentCopy sx={{ fontSize: 13 }} />
                    )}
                  </span>
                </div>
              )}

              {secondary && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#aaafb5", // lighter gray (Tailwind gray-300)
                    }}
                  >
                    {secondary}
                  </span>
                  <span
                    onClick={() => copyValue(secondary, setCopiedSecondary)}
                    title={copiedSecondary ? "Copied" : "Copy"}
                    style={{
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      color: copiedSecondary ? "#d1d5db" : "#d1d5db",
                    }}
                  >
                    {copiedSecondary ? (
                      <CheckCircle sx={{ fontSize: 12 }} />
                    ) : (
                      <ContentCopy sx={{ fontSize: 12 }} />
                    )}
                  </span>
                </div>
              )}
            </div>
          );
        };
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
          const [selectedStatus, setSelectedStatus] = useState("");
          const [popupMode, setPopupMode] = useState(""); // "UPI" or "NEFT"

          const handleSettlement = async (status) => {
            debugger;
            const mode = info.row.original.mode;

            if (mode === "Cash") {
              setSelectedStatus(status);
              setPopupMode("Cash");
              setPopupOpen(true);
            } else if (mode == "UPI") {
              setSelectedStatus(status);
              setPopupMode("UPI");
              setPopupOpen(true);
            } else if (status == "Failed") {
              await settlementStatusChange(status, info, {});
            } else if (mode === "NEFT") {
              setSelectedStatus("Success");
              setPopupMode("NEFT");
              setPopupOpen(true);
            }
          };

          const handlePopupSubmit = async () => {
            const options = { bankRefId, remark }

            await settlementStatusChange(selectedStatus, info, options);
            setPopupOpen(false);
            setRemark("");
            setBankRefId("");
            setSelectedStatus("");
            setPopupMode("");
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
                  title={popupMode === "UPI" ? "UPI Settlement Details" : "Settlement Details"}
                  isOpen={popupOpen}
                  onClose={() => {
                    setPopupOpen(false);
                    setRemark("");
                    setBankRefId("");
                    setSelectedStatus("");
                    setPopupMode("");
                  }}
                  width=""
                  styles={{}}
                >
                  {popupMode === "UPI" && (
                    <div className="mt-2 mb-4">
                      <Typography variant="body1" className="mb-2">
                        Status: <span className={`font-semibold ${selectedStatus === "Success" ? "" : ""}`}>{selectedStatus}</span>
                      </Typography>
                    </div>
                  )}
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
                      placeholder="Enter remarks"
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
                      onClick={() => {
                        setPopupOpen(false);
                        setRemark("");
                        setBankRefId("");
                        setSelectedStatus("");
                        setPopupMode("");
                      }}
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
        columnConfig.size = 100;
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
                      className={`p-2 text-white rounded cursor-pointer transition-all duration-300 ${isProcessing
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
              {report_id === "2_9" && ["Pending", "Failed", "FAILURE"].includes(info.row.original.status) && (
                <div className="action flex gap-3 items-center">


                  {["Pending", "Failed", "FAILURE"].includes(info.row.original.status) && (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleCheckUPIStatus(info)}
                      className={`p-2 text-white rounded cursor-pointer transition-all duration-300 ${isProcessing
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
            {report_id === "2_14" && info.row.original.status == "Pending" && (
              <div className="action flex gap-3 items-center">
                {info.row.original.status === "Pending" && (
                  <button
                    onClick={() => handlecheckStatusSettlement(info)}
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

      if (col.prop == "mobile") {
        columnConfig.size = 120;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
              fontSize: "0.84rem",
              fontWeight: 600,
              fontFamily:
              'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
              color: "#16163a",
              letterSpacing: "0.2px",
            }}
          >
            {info.getValue()}
          </div>
        );
      }

      if (
        col.prop == "OpName" ||
        col.prop == "amount" ||
        col.prop == "apiBalance" 
      ) {
        columnConfig.size = 100;
        columnConfig.cell = (info) => (
          <div
            style={{
              textAlign: "center",
              fontSize:
                col.prop === "amount"  ? "0.86rem" : "0.84rem",
              fontWeight:
                col.prop === "amount"  ? 700 : 600,
              fontFamily:
                'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
              color:
                col.prop === "amount"
                  ? "#0369a1"
                  : "#009966",
              letterSpacing: "0.2px",
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

  const renderEyePopupContent = (data: string) => {
    if (!data) return null;

    if (!data.includes("<b>") && !data.includes("<br/>")) {
      try {
        return (
          <pre className="whitespace-pre-wrap break-all text-sm font-mono text-gray-800">
            {JSON.stringify(JSON.parse(data), null, 2)}
          </pre>
        );
      } catch (e) {
        return (
          <pre className="whitespace-pre-wrap break-all text-sm font-mono text-gray-800">
            {data}
          </pre>
        );
      }
    }

    const parts = data.split(/<br\s*\/?>/i);
    return (
      <div className="flex flex-col gap-4">
        {parts.map((part, index) => {
          const match = part.match(/<b>(.*?)<\/b>(.*)/i);
          if (match) {
            const tag = match[1];
            let content = match[2].trim();
            try {
              content = JSON.stringify(JSON.parse(content), null, 2);
            } catch (e) {}

            return (
              <div key={index} className="flex flex-col gap-1">
                <Typography
                  variant="subtitle2"
                  className="font-bold text-blue-600"
                >
                  {tag}
                </Typography>
                <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
                  <pre className="whitespace-pre-wrap break-all text-xs font-mono text-gray-700 m-0">
                    {content}
                  </pre>
                </div>
              </div>
            );
          }
          return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        })}
      </div>
    );
  };

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
      <div className="mb-2 rounded-xl border border-slate-200/90 bg-gradient-to-r from-white via-slate-50 to-blue-50 px-3 py-2 shadow-sm ring-1 ring-slate-100/70 transition-shadow duration-300 hover:shadow-md dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:ring-slate-800/80">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h1 className="max-w-full basis-full text-sm font-semibold leading-tight tracking-tight text-slate-900 sm:basis-auto sm:max-w-[11rem] md:max-w-[14rem] sm:truncate sm:shrink-0 dark:text-slate-100">
            {reportData?.Report?.ReportName}
          </h1>
          <ButtonLabel
            style={{
              height: "32px",
              minHeight: "32px",
              minWidth: "4.5rem",
              padding: "0 10px",
              fontSize: "12px",
            }}
            label="Row"
            onClick={async () => {
              if (!tableData || tableData.length === 0) {
                toast.warn("No row found");
                return;
              }
              const tranxId = tableData[0];

              if (
                window.confirm(
                  "Are you sure you want to perform this action for the first row?"
                )
              ) {
                await deleteFirstRow(tranxId.TraxId);
              }
            }}
          />
          {report_id != "2_15" && (
            <div className="min-w-[min(100%,200px)] flex-1 sm:max-w-sm sm:flex-initial">
              <RangePicker
                size="small"
                style={{ width: "100%" }}
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
            <div className="min-w-[140px] max-w-[200px]">
              <DatePicker
                size="small"
                style={{ width: "100%" }}
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
          <div className="ml-auto shrink-0">
            <ButtonLabel
              style={{
                height: "32px",
                minHeight: "32px",
                minWidth: "5.5rem",
                padding: "0 12px",
                fontSize: "12px",
              }}
              label="Get Data"
              onClick={handleGetReportData}
            />
          </div>
        </div>

        {(filterableColumns.length > 0 ||
          _search ||
          report_id == "2_10" ||
          report_id == "2_17") && (
          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 rounded-lg border border-slate-200/80 bg-white/85 p-2 md:grid-cols-4 xl:grid-cols-6 dark:border-slate-700 dark:bg-slate-900/60">
            {filterableColumns.map((filterName, index) => (
              <div
                key={filterName}
                className={`min-w-0 ${
                  filterName.includes("userId")
                    ? "col-span-2 md:col-span-2"
                    : ""
                }`}
              >
                {filterName == "tm.paymentType" ||
                filterName == "tm.status" ? (
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
              <div className="col-span-2 min-w-0 md:col-span-2 xl:col-span-2">
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
              <div className="col-span-2 min-w-0 md:col-span-4 xl:col-span-3">
                <DropSearch
                  value={JSON.stringify(timeRange) || ""}
                  place2={"timeRange"}
                  onchange={(name: any, value: any) => {
                    setTimeange(JSON.parse(value));
                  }}
                  placeholder={"Select TimeRange"}
                  options={timeOptions.map((opt) => ({
                    showvalue: opt.showvalue,
                    value: JSON.stringify(opt.value),
                  }))}
                  error={""}
                  isFilter={true}
                />
              </div>
            )}
          </div>
        )}
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

      {upiPopupOpen && (
        <Popup
          title=""
          isOpen={upiPopupOpen}
          onClose={() => {
            setUpiPopupOpen(false);
            setUpiUtr("");
            setUpiRemark("");
            setUpiPopupData(null);
            setUpiPopupParams(null);
          }}
          width="md"
          styles={{}}
        >
          <div className="flex flex-col items-center justify-center p-2">

            <div className="text-blue-600 font-medium mb-4">
              Transaction status is "{upiPopupParams?.row?.original?.status?.toUpperCase() || 'UNKNOWN'}".
            </div>
            <div className="font-bold mb-2">Response :</div>
            <div className="text-sm text-left w-full max-w-sm mb-4">
              <div><strong>Status:</strong> {upiPopupData?.status || upiPopupData?.status || 'N/A'}</div>
              <div><strong>Message:</strong> {upiPopupData?.message || upiPopupData?.message || 'N/A'}</div>
              {upiPopupData?.orderId && <div><strong>Order ID:</strong> {upiPopupData.orderId}</div>}
              {upiPopupData?.utr && <div><strong>Utr:</strong> {upiPopupData.utr}</div>}
            </div>

            <div className="mt-2 border border-yellow-400 bg-yellow-50 p-4 rounded text-center mb-6">
              <Error className="text-yellow-600 mb-2" sx={{ fontSize: 40 }} />
              <div className="font-bold text-yellow-700 text-lg">Warning!</div>
              <p className="text-xs text-gray-700 mt-2">
                You can manually mark this transaction as SUCCESS or FAILED. Please be aware that this action will not be cross-checked by us.
                A callback will be sent to the user's website immediately.
              </p>
            </div>

            <div className="w-full max-w-sm text-left mb-4">
              <label className="block text-sm font-semibold mb-1">Enter UTR</label>
              <input
                type="text"
                placeholder="e.g., 1234567890"
                className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                value={upiUtr}
                onChange={(e) => setUpiUtr(e.target.value)}
              />
            </div>

            <div className="w-full max-w-sm text-left mb-6">
              <label className="block text-sm font-semibold mb-1">Remark</label>
              <input
                type="text"
                placeholder="e.g., Manual update"
                className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                value={upiRemark}
                onChange={(e) => setUpiRemark(e.target.value)}
              />
            </div>

            <div className="w-full max-w-sm flex justify-between gap-3">
              <button
                className="flex-1 bg-gray-200 text-gray-800 rounded py-2 text-sm font-semibold hover:bg-gray-300"
                onClick={() => {
                  setUpiPopupOpen(false);
                  setUpiUtr("");
                  setUpiRemark("");
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-500 text-white rounded py-2 text-sm font-semibold hover:bg-red-600"
                onClick={async () => {
                  try {
                    const rowData = upiPopupParams?.row?.original;
                    const payload = {
                      id: rowData?._id || rowData?.id,
                      utr: upiUtr,
                      remark: upiRemark,
                      status: "Failed",
                      tranxId: rowData?.tranxId,
                      orderId: rowData?.orderId
                    };
                    const response = await api.post('/payment/manual-upi-failed', payload, { withCredentials: true });
                    toast.success(response.data.message || 'Status updated to Failed');
                    setUpiPopupOpen(false);
                    setUpiUtr("");
                    setUpiRemark("");
                    handleGetReportData();
                  } catch (error: any) {
                    toast.error(error?.response?.data?.message || error.message);
                  }
                }}
              >
                Make Failed
              </button>
              <button
                className="flex-1 bg-green-500 text-white rounded py-2 text-sm font-semibold hover:bg-green-600"
                onClick={async () => {
                  if (!upiUtr) {
                    toast.error("UTR is required for Success");
                    return;
                  }
                  try {
                    const rowData = upiPopupParams?.row?.original;
                    const payload = {
                      id: rowData?._id || rowData?.id,
                      status: "SUCCESS",
                      userId: rowData?.userId,
                      amount: rowData?.amount,
                      utr: upiUtr,
                      remark1: 19,
                      remark2: 771,
                      remark: upiRemark,
                      order_id: rowData?.tranxId
                    };
                    const response = await api.post('/payment/updateUserWalletBalance', payload, { withCredentials: true });
                    toast.success(response.data.message || 'Status updated to Success');
                    setUpiPopupOpen(false);
                    setUpiUtr("");
                    setUpiRemark("");
                    handleGetReportData();
                  } catch (error: any) {
                    toast.error(error?.response?.data?.message || error.message);
                  }
                }}
              >
                Make Success
              </button>
            </div>
          </div>
        </Popup>
      )}
      {eyePopupOpen && (
        <Popup
          title={eyePopupTitle.toUpperCase()}
          isOpen={eyePopupOpen}
          onClose={() => {
            setEyePopupOpen(false);
            setEyePopupData("");
            setEyePopupTitle("");
          }}
        >
          <div className="p-4 bg-gray-50 rounded-lg max-h-[60vh] overflow-auto">
            {renderEyePopupContent(eyePopupData)}
          </div>
        </Popup>
      )}

    </DefaultLayout>
  );
};

export default Reports;
