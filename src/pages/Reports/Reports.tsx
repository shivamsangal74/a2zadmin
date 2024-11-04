import React, { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import { DropSearch } from "../../components/DropDown/DropSearch";
import { ButtonLabel } from "../../components/Button/Button";
import Loader from "../../common/Loader";
import type { TimeRangePickerProps } from "antd";
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
import { Select, Option } from "@material-tailwind/react";
import { Box, Typography, IconButton } from "@mui/material";
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
  const [isVisible, setIsVisible] = useState(false);

  const last30Days = () => {
    const startDate = dayjs().subtract(30, "day").startOf("day");
    const endDate = dayjs().endOf("day");
    const value = `createdDate between '${startDate.format(
      "YYYY-MM-DD HH:mm:ss"
    )}' and '${endDate.format("YYYY-MM-DD HH:mm:ss")}'`;
    return { startDate, endDate, value };
  };

  function formatDateString(dateString: any) {
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
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  const handleLast30DaysDateRange = () => {
    // Get the date 30 days ago from today
    const startDate = moment().subtract(30, "days").startOf("day");

    // Get the current date and time
    const endDate = moment().endOf("day");

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

        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [entity, report_id]);

  useEffect(() => {
    const handleGetReportData = async () => {
      try {
        const response = await api.post(apiUrl + "/report/getReportData", {
          report_id: report_id,
          Entity: entity,
          filters: filters,
          dateRange: handleLast30DaysDateRange(),
        });
        setTableData(response.data);
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
    endDate.$d.setHours(24);
    const value = `${DateModel} between '${moment(startDate.$d).format(
      "YYYY-MM-DD HH:mm:ss"
    )}' and '${moment(endDate.$d).format("YYYY-MM-DD HH:mm:ss")}'`;
    setDateRange(value);
  };

  async function settlementStatusChange(value: any, params: any) {
    try {
      let tranxId = params.row.original.requestId;
      const response = await api.post(`/settelment/manual-setllement`, {
        tranxId: tranxId,
        value: value,
      });
      toast.warn("Settlment Status Updated");
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    } finally {
    }
  }

  async function handleStatusChange(value: any, params: any) {
    try {
      let tranxId = params.row.original.refid;
      const response = await api.get(`/common/manual-status`, {
        params: { tranxId, value },
        withCredentials: true,
      });
      toast.warn("Recharge Status Updated");
      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
      throw error;
    } finally {
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
      toast.error(error.message);
      console.error(error);
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
    switch (status) {
      case "Success":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle />
            <span>Success</span>
          </div>
        );
      case "Pending":
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <HourglassEmpty />
            <span>Pending</span>
          </div>
        );
      case "Failed":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <Error />
            <span>Failed</span>
          </div>
        );
      case "Reverse":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Refresh />
            <span>Reverse</span>
          </div>
        );
      case "Transfer":
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

  const columns = reportData.Report.DisplayColumns.map((col) => {
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
          <div>{info.getValue()}</div>
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
    if (col.prop == "settlment_manual") {
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
                settlementStatusChange("Success", info);
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
                settlementStatusChange("Failed", info);
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
                    onClick={() => handleCheckStatus(info)}
                    className="p-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-all duration-300"
                  >
                    <CompareArrows titleAccess="Check Status" />{" "}
                    {/* Check Status Icon */}
                  </button>
                )}
              </div>
            )}
          </div>

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
      columnConfig.size = 100;
      columnConfig.cell = (info) => (
        <div
          style={{
            textAlign: "center",
          }}
        ></div>
      );
    }

    if (
      col.prop == "OpName" ||
      col.prop == "amount" ||
      col.prop == "gst" ||
      col.prop == "tds" ||
      col.prop == "aadhar" ||
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
  });

  const filterableColumns = reportData.Report.DropDowns;
  const _search = filterableColumns.some((item: any) =>
    item.includes("serachCondition")
  );
  const filterableDisplayColumns = reportData.Report.DropDownDisplayName;
  const DateModel = reportData.Report.DateModel;
  const dropdownValues = reportData.DropDowns[0];

  function finalValue(index: any) {
    let value = filters[`dropdown[${index}]`]
      ? filters[`dropdown[${index}]`].split("=")[1].replace(/'/g, "").trim()
      : "";

    return isNaN(value) ? value : Number(value);
  }
  return (
    <DefaultLayout isList>
      <div className="flex-1">
        <h1 className="text-dark-400">{reportData.Report.ReportName}</h1>
      </div>
      <div className="flex gap-5 w-full justify-between items-center mt-4">
        <div className="flex gap-5 flex-wrap" style={{ flex: 2 }}>
          <div className="mb-2">
            <RangePicker
              style={{ height: "45px" }}
              presets={[
                {
                  label: (
                    <span aria-label="Current Time to End of Day">Today</span>
                  ),
                  value: () => [dayjs(), dayjs().endOf("day")],
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
          <ButtonLabel label="Get Data" onClick={handleGetReportData} />
        </div>
      </div>

      <BasicTable
        data={tableData}
        columns={columns}
        isFilters={true}
        filter={["status"]}
        isSeachable={true}
        isReport={true}
      />
    </DefaultLayout>
  );
};

export default Reports;
