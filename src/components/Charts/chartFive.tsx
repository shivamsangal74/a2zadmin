import React from "react";
import ReactApexChart from "react-apexcharts";

const SemiDonutChart = ({ activeUsers, inactiveUsers,userType }) => {
  const chartOptions = {
    chart: {
      type: "donut",
      
    },
    labels: [`Active ${userType}`, `Inactive ${userType}`],
    colors: ["#28a745", "#dc3545"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#fff",
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        expandOnClick: false,
        donut: {
          size: "50%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"], 
      },
    },
  };

  return (
    <div>
      <ReactApexChart options={chartOptions} series={[activeUsers, inactiveUsers]} type="donut" height={300} width={220} />
    </div>
  );
};

export default SemiDonutChart;