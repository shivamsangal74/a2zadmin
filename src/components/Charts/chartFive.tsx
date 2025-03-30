import React from "react";
import ReactApexChart from "react-apexcharts";

const SemiDonutChart = ({idx,activeUsers, inactiveUsers,userType }) => {

  let colurs = ["#2D8D9E" , "#6FAE8F" , "#E9A353" ,"#B64A5A" , "#E9A59E"  ]

  const chartOptions = {
    chart: {
      type: "donut",
      
    },
    labels: [`Active ${userType}`, `Inactive ${userType}`],
    colors: [colurs[idx], "#CECED5"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#000",
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
        colors: ["#000"], 
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