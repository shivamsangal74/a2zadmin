import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import Loader from "../../common/Loader";
import moment from "moment";
import { apiUrl } from "../../Utills/constantt";
import { Loyalty, CheckCircle, HourglassEmpty, Error, Refresh, TransferWithinAStation } from "@mui/icons-material";
import { BsEye, BsGlobe } from "react-icons/bs";
import { IconButton, Typography } from "@mui/material";
import Popup from "../../components/Model/Model";
import api from "../../Services/Axios/api";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import StatsDisplay from "../../components/DisplatStats";

interface ReportColumn {
  name: string;
  prop: string;
}

interface ReportData {
  Report: {
    DisplayColumns: ReportColumn[];
    ReportName: string;
  };
}

interface TableData {
  [key: string]: any;
}

interface LiveReportsProps {
  entity: string;
  report_id: string;
}

/** Backend returns newest-first; a small window drops rows when traffic exceeds this per poll. */
const LIVE_REPORT_ROW_LIMIT = 500;

function rowDedupeKey(row: TableData): string {
  const id = row?.refid ?? row?.requestId;
  if (id != null && String(id).length > 0) return String(id);
  return `${row?.createdDate ?? ""}:${row?.amount ?? ""}:${row?.status ?? ""}`;
}

const LiveReports: React.FC<LiveReportsProps> = ({ entity, report_id }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const livePollInFlight = useRef(false);

  // Eye Popup State
  const [eyePopupOpen, setEyePopupOpen] = useState(false);
  const [eyePopupData, setEyePopupData] = useState("");
  const [eyePopupTitle, setEyePopupTitle] = useState("");

  const handleOpenEyePopup = (data: any, title: string) => {
    setEyePopupData(data);
    setEyePopupTitle(title);
    setEyePopupOpen(true);
  };

  const handleLast30DaysDateRange = useCallback(() => {
    const startDate = moment().startOf("day");
    const endDate = moment().endOf("day");
    return `createdDate between '${startDate.format("YYYY-MM-DD HH:mm:ss")}' and '${endDate.format("YYYY-MM-DD HH:mm:ss")}'`;
  }, []);

  const fetchReportData = useCallback(async () => {
    try {
      const response = await api.post(`${apiUrl}/report/dynamicReport`, {
        report_id,
        Entity: entity,
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report metadata:", error);
    } finally {
      setLoading(false);
    }
  }, [entity, report_id]);

  const fetchTableData = useCallback(async () => {
    try {
      const response = await api.post(`${apiUrl}/report/getReportData`, {
        report_id,
        Entity: entity,
        filters: { limits: LIVE_REPORT_ROW_LIMIT },
        dateRange: handleLast30DaysDateRange(),
        limits: LIVE_REPORT_ROW_LIMIT,
      });
      const payload = response.data;
      if (Array.isArray(payload)) {
        setTableData(payload);
      } else if (payload?.message === "No Record Found") {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  }, [entity, report_id, handleLast30DaysDateRange]);

  const fetchLiveTransactions = useCallback(async () => {
    if (livePollInFlight.current) return;
    livePollInFlight.current = true;
    try {
      const response = await api.post(`${apiUrl}/report/getReportData`, {
        report_id,
        Entity: entity,
        filters: { limits: LIVE_REPORT_ROW_LIMIT },
        dateRange: handleLast30DaysDateRange(),
        limits: LIVE_REPORT_ROW_LIMIT,
      });

      const payload = response.data;
      if (!payload || payload?.message === "No Record Found") return;

      const incoming = Array.isArray(payload) ? payload : [];
      if (incoming.length === 0) return;

      setTableData((prevData) => {
        const incomingByKey = new Map(incoming.map((tx: TableData) => [rowDedupeKey(tx), tx]));

        const refreshed = prevData.map((row) => {
          const key = rowDedupeKey(row);
          const newer = incomingByKey.get(key);
          return newer ?? row;
        });

        const prevKeys = new Set(prevData.map(rowDedupeKey));
        const brandNew = incoming.filter((tx: TableData) => !prevKeys.has(rowDedupeKey(tx)));

        return [...brandNew, ...refreshed];
      });
    } catch (error) {
      console.error("Error fetching live transactions:", error);
    } finally {
      livePollInFlight.current = false;
    }
  }, [entity, report_id, handleLast30DaysDateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  useEffect(() => {
    if (reportData) {
      fetchTableData();
    }
  }, [reportData, fetchTableData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveTransactions();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchLiveTransactions]);

  const renderStatus = (status: string) => {
    const statusMap: { [key: string]: JSX.Element } = {
      Success: (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle />
          <span>Success</span>
        </div>
      ),
      Pending: (
        <div className="flex items-center gap-2 text-yellow-500">
          <HourglassEmpty />
          <span>Pending</span>
        </div>
      ),
      Failed: (
        <div className="flex items-center gap-2 text-red-600">
          <Error />
          <span>Failed</span>
        </div>
      ),
      Reverse: (
        <div className="flex items-center gap-2 text-blue-600">
          <Refresh />
          <span>Reverse</span>
        </div>
      ),
      Transfer: (
        <div className="flex items-center gap-2 text-green-600">
          <TransferWithinAStation />
          <span>Transfer</span>
        </div>
      ),
    };

    return statusMap[status] || (
      <div className="flex items-center gap-2 text-pink-500">
        <Loyalty />
        <span>{status}</span>
      </div>
    );
  };

  const columns = useMemo(() => {
    if (!reportData) return [];
    return reportData.Report.DisplayColumns.map((col) => {
      const baseConfig = {
        header: col.name,
        accessorKey: col.prop,
      };

      if (col.prop === "createdDate") {
        return {
          ...baseConfig,
          size: 120,
          cell: (info: any) => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
        };
      }

      if (col.prop === "pltform") {
        return {
          ...baseConfig,
          size: 50,
          cell: (info: any) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              {info.row.original.pltform === "Web" ? <BsGlobe /> : info.getValue()}
            </div>
          ),
        };
      }

      if (col.prop === "status") {
        return {
          ...baseConfig,
          size: 150,
          cell: (info: any) => (
            <div style={{ textAlign: "center" }}>{renderStatus(info.row.original.status)}</div>
          ),
        };
      }

      if (col.prop === "logs") {
        return {
          ...baseConfig,
          size: 100,
          cell: (info: any) => {
            const value = info.getValue();
            return (
              <div style={{ textAlign: "center" }}>
                <IconButton onClick={() => handleOpenEyePopup(value, "logs")}>
                  <BsEye size={20} />
                </IconButton>
              </div>
            );
          },
        };
      }

      return baseConfig;
    });
  }, [reportData]);

  
  function calculateStatusAndAmountTotals(dataArray: any) {
    const totals = {
      success: { count: 0, amount: 0 },
      pending: { count: 0, amount: 0 },
      fail: { count: 0, amount: 0 },
      others: { count: 0, amount: 0 }, // For unexpected statuses
    };

    dataArray.forEach((item: any) => {
      let opNames = ["AadharPay", "withdrawal"];
      if ((report_id == "2_10")) {
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
      }else {
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
 

  
  
  
  if (loading) {
    return (
      <DefaultLayout isList>
        <Loader />
      </DefaultLayout>
    );
  }



  return (
    <DefaultLayout isList>
      <Breadcrumb pageName={`Live ${reportData?.Report.ReportName}`} />
      {report_id != "2_15" && <StatsDisplay stats={totalAmount} />}

      <BasicTable
        data={tableData}
        columns={columns}
        isFilters={true}
        filter={[]}
        isSeachable={false}
        isReport={true}
        report_id={report_id}
      />
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

export default LiveReports;
