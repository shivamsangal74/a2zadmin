import React, { useEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { apiUrl } from "../../Utills/constantt";

am4core.useTheme(am4themes_animated.default);

const chartFour: React.FC = () => {
  const [apiResponse,setApiResponse] = useState([])
  useEffect(() => {
    fetch(apiUrl + "/dashboard/virtual-data")
        .then((response) => response.json())
        .then((data) => {
          debugger
           
            setApiResponse(data.chartData.map((d)=>{
                return {...d , total_wallet: d.total_wallet.toFixed(2)}
            }));
        })
        .catch((error) => console.error("Error fetching data:", error));
}, []);
  
  
    useEffect(() => {
    let chart = am4core.create("chartdiv2", am4charts.PieChart);

    // Ensure the chart has enough padding to prevent clipping
    chart.padding(20, 20, 20, 20);
    chart.responsive.enabled = true;


    // Assign Data
    chart.data = apiResponse;

    // Define Colors (matching ApexCharts)
    const colors = ["#3C50E0", "#80CAEE", "#FFA500", "#FF4560", "#00E396"];
    chart.colors.list = colors.map((color) => am4core.color(color));

    // Pie Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "total_wallet";
    pieSeries.dataFields.category = "userType";

    // Labels
    pieSeries.labels.template.text = "{category}: {value}";
    pieSeries.labels.template.fontSize = 12;
    
    // Ensure slices are not cut off by adjusting the radius
    pieSeries.slices.template.radius = am4core.percent(90);

    // Cleanup on Unmount
    return () => {
      chart.dispose();
    };
  }, [apiResponse]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <h4 className="text-xl font-semibold text-black dark:text-white">Virtual Balance</h4>
      </div>

      <div
        id="chartdiv2"
        style={{
          width: "100%",
          height: "350px",
          maxHeight: "100%",
          overflow: "visible", // Prevents clipping
        }}
      ></div>
    </div>
  );
};

export default chartFour;
