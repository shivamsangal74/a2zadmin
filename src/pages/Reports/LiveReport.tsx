import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import Loader from "../../common/Loader";
import moment from "moment";
import { apiUrl } from "../../Utills/constantt";
import { Loyalty, CheckCircle, HourglassEmpty, Error, Refresh, TransferWithinAStation, ContentCopy } from "@mui/icons-material";
import { toast } from "react-toastify";
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
    DateModel?: string;
  };
}

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

function formatReportDateDisplay(dateString: any, report_id: string) {
  if (report_id == "1_3") {
    return dateString;
  }
  const date = new Date(dateString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(2);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, "0");
  return `${day} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
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
        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
          <CheckCircle />
          <span className="font-semibold tracking-wide">Success</span>
        </div>
      ),
      Pending: (
        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
          <HourglassEmpty />
          <span className="font-semibold tracking-wide">Pending</span>
        </div>
      ),
      Failed: (
        <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
          <Error />
          <span className="font-semibold tracking-wide">Failed</span>
        </div>
      ),
      Fail: (
        <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
          <Error />
          <span className="font-semibold tracking-wide">Failed</span>
        </div>
      ),
      FAILURE: (
        <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
          <Error />
          <span className="font-semibold tracking-wide">Failed</span>
        </div>
      ),
      Reverse: (
        <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
          <Refresh />
          <span className="font-semibold tracking-wide">Reverse</span>
        </div>
      ),
      Transfer: (
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
          <TransferWithinAStation />
          <span className="font-semibold tracking-wide">Transfer</span>
        </div>
      ),
    };

    return statusMap[status] || (
      <div className="flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-fuchsia-700 shadow-sm transition-all duration-300 hover:scale-[1.02]">
        <Loyalty />
        <span className="font-semibold tracking-wide">{status}</span>
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

      if (report_id === "2_4" && col.prop?.toLowerCase() === "operatorimage") {
        return {
          ...baseConfig,
          size: 160,
          cell: (info: any) => {
            const row = info.row.original;
            const operatorImage =
              row?.operatorImage ?? row?.OperatorImage;
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
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    —
                  </span>
                )}
              </div>
            );
          },
        };
      }

      if (isReportDateColumn(col.prop, reportData.Report.DateModel)) {
        return {
          ...baseConfig,
          size: 180,
          cell: (info: any) => (
            <div
              style={{
                textAlign: "center",
                fontSize: "0.84rem",
                fontWeight: 600,
                letterSpacing: "0.2px",
                color: "#0369a1",
              }}
            >
              {formatReportDateDisplay(info.getValue(), report_id)}
            </div>
          ),
        };
      }

      if (col.prop === "amount" || col.prop === "apiBal") {
        return {
          ...baseConfig,
          size: 120,
          cell: (info: any) => (
            <div
              style={{
                textAlign: "center",
                fontSize: "0.86rem",
                fontWeight: 700,
                color: "#0f766e",
                letterSpacing: "0.2px",
              }}
            >
              {info.getValue()}
            </div>
          ),
        };
      }

      if (col.prop === "mobile") {
        return {
          ...baseConfig,
          size: 120,
          cell: (info: any) => (
            <div
              style={{
                textAlign: "center",
                fontSize: "0.84rem",
                fontWeight: 600,
                fontFamily: "Geist Mono, Geist Mono Fallback, monospace",
                color: "#16163a",
                letterSpacing: "0.2px",
              }}
            >
              {info.getValue()}
            </div>
          ),
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

      if (
        col.prop === "refid" ||
        col.prop === "refId" ||
        col.prop === "TranxId" ||
        col.prop === "tranxId" ||
        col.prop === "TraxId" ||
        col.prop === "txnid"
      ) {
        return {
          ...baseConfig,
          size: 200,
          cell: (info: any) => {
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
                  .catch(() => {});
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
          },
        };
      }

      if (col.prop === "ReqId" || col.prop === "oprId") {
        return {
          ...baseConfig,
          size: 220,
          cell: (info: any) => {
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
                  .catch(() => {});
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
                        color: "#111827",
                        fontWeight: 500,
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
                        color: copiedPrimary ? "#2e7d32" : "#1976d2",
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
                        color: "#6b7280",
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
                        color: copiedSecondary ? "#2e7d32" : "#9ca3af",
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
          },
        };
      }

      return baseConfig;
    });
  }, [reportData, report_id]);

  
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
      {/* <div className="mb-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-white via-emerald-50 to-cyan-50 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Live {reportData?.Report.ReportName}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Real-time updates with improved readability and clarity.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 animate-pulse">
            Live
          </span>
        </div>
      </div> */}
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
