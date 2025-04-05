import { useEffect, useState } from "react";
import api from "../../Services/Axios/api";
import { apiUrl } from "../../Utills/constantt";
import Chart from "react-apexcharts";
import moment from "moment";

export const TopUsers = () => {
  const [labels, setLabelsData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLast30DaysDateRange = () => {
    // Get the start of the current day (00:00:00)
    let startDate = moment().startOf("month");
    

    // Get the end of the current day (23:59:59)
    const endDate = moment().endOf("day");

    // Format the value as a date range string
    const value = `createdDate between '${startDate.format(
      "YYYY-MM-DD HH:mm:ss"
    )}' and '${endDate.format("YYYY-MM-DD HH:mm:ss")}'`;

    return value;
  };


  useEffect(() => {
    const handleGetReportData = async () => {
      try {
        const response = await api.post(apiUrl + "/report/getReportData", {
          report_id: "2_15",
          Entity: "Transaction",
          filters: [],
          dateRange: handleLast30DaysDateRange(),
        });

        // Sort users based on total and take top 100
        const sortedData = response.data.filter(item => item.Total > 10).sort((a, b) => b.Total - a.Total).slice(0, 100);

        setLabelsData(sortedData.map((item) => item.fullName));
        setData(sortedData.map((item) => item.Total > 0 ? item.Total.toFixed(2) : ""));
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    handleGetReportData();
  }, []);

  const chartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: labels,
    },
    colors: ["#FF4560", "#008FFB", "#00E396", "#FEB019", "#775DD0"],
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
      <h2>Top 100 Users by Transactions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Chart
          options={chartOptions}
          series={[{ name: "Total", data }]}
          type="bar"
          height={500}
        />
      )}
    </div>
  );
};
