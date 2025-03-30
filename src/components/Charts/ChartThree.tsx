import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../../Services/Axios/api";

const ChartThree: React.FC = () => {
  const [chartData, setChartData] = useState<{ series: any[]; categories: string[] }>({
    series: [],
    categories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/fund-data"); // Replace with actual API URL
        const data = response.data.chartData;

        // Sort data by absolute value
        data.sort((a: any, b: any) => Math.abs(b.currentMonthTotalAmount) - Math.abs(a.currentMonthTotalAmount));

        const categories = data.map((item: any) => item.name);
        const positiveData = data.map((item: any) => (item.currentMonthTotalAmount > 0 ? item.currentMonthTotalAmount : 0));
        const negativeData = data.map((item: any) => (item.currentMonthTotalAmount < 0 ? item.currentMonthTotalAmount : 0));

        setChartData({
          series: [
            { name: "Positive Amount", data: positiveData },
            { name: "Negative Amount", data: negativeData },
          ],
          categories,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 600,
      stacked: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        horizontal: true,
        barHeight: "100%",
      },
    },
    colors: ["#008FFB", "#FF4560"], // Blue for positive, Red for negative
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Transaction Amount",
      },
      labels: {
        formatter: (val) => `${Math.abs(Number(val))}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${Math.abs(val)}`,
      },
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">Funds</h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree">
          <ReactApexChart options={chartOptions} series={chartData.series} type="bar" height={600} />
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
