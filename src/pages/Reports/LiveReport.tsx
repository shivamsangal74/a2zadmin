import React, { useEffect, useState, useMemo, useCallback } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import Loader from "../../common/Loader";
import moment from "moment";
import { apiUrl } from "../../Utills/constantt";
import { Loyalty, CheckCircle, HourglassEmpty, Error, Refresh, TransferWithinAStation } from "@mui/icons-material";
import { BsGlobe } from "react-icons/bs";
import api from "../../Services/Axios/api";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

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

const LiveReports: React.FC<LiveReportsProps> = ({ entity, report_id }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

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
        filters: { limits: 10 },
        dateRange: handleLast30DaysDateRange(),
        limits: 10,
      });
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  }, [entity, report_id, handleLast30DaysDateRange]);

  const fetchLiveTransactions = useCallback(async () => {
    try {
      const response = await api.post(`${apiUrl}/report/getReportData`, {
        report_id,
        Entity: entity,
        filters: { limits: 10 },
        dateRange: handleLast30DaysDateRange(),
        limits: 10,
      });

      if(response.data.message === "No Record Found") return;
      setTableData((prevData) => {
        const newTransactions = response.data.filter(
          (newTx: any) => !prevData.some((existingTx) => existingTx.txnid
          === newTx.txnid
        )
        );
        return [...newTransactions, ...prevData]; // Add new transactions to the top
      });
    } catch (error) {
      console.error("Error fetching live transactions:", error);
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
    }, 1000); // Fetch new transactions every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
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

      return baseConfig;
    });
  }, [reportData]);

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
      <BasicTable
        data={tableData}
        columns={columns}
        isFilters={true}
        filter={[]}
        isSeachable={false}
        isReport={false}
        report_id={report_id}
      />
    </DefaultLayout>
  );
};

export default LiveReports;
