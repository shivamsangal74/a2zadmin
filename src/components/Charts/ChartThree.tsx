import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
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
        data.sort((a: any, b: any) => parseFloat(b.currentMonthTotalAmount) - parseFloat(a.currentMonthTotalAmount));

        const categories = data.map((item: any) => item.name);
        const seriesData = data.map((item: any) => parseFloat(item.currentMonthTotalAmount));

        setChartData({
          series: [
            {
              name: "Total Amount",
              data: seriesData,
            },
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
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        distributed: true,
      },
    },
    colors: chartData.series.length
      ? chartData.series[0].data.map((value) => `rgba(30, 144, 255, ${0.3 + (value / Math.max(...chartData.series[0].data)) * 0.7})`)
      : [],
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: chartData.categories,
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
