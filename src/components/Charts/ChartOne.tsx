import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { apiUrl } from "../../Utills/constantt";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Loader from "../../common/Loader";
const TransactionsBarChart = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("today");
  const [isLoading,setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true)
    fetch(apiUrl + `/dashboard/service-data?filter=${filter}`)
      .then((response) => response.json())
      .then((data) => {
        debugger;
        const formattedData = data.chartData.map((item: any) => ({
          name: item.service,
          currentMonthTotalAmount: parseFloat(item.today).toFixed(2),
          prevMonthTotalAmount: parseFloat(item.last_month).toFixed(2),
        }));
        setData(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(()=> setIsLoading(false))
  }, [filter]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 450,
      stacked: true,
    },
    colors: ["#3C50E0", "#80CAEE"],
    xaxis: {
      categories: data.map((item: any) => item.name),
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },

    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    tooltip: {
      enabled: false,
    },
  };

  useEffect(() => {
    let chart = am4core.create("chartdiv", am4charts.XYChart3D);
    chart.paddingBottom = 30;
    chart.angle = 35;

    // Color Array (Dark & Light shades)
    const colors = [
      ["#FEBC27", "#FCE1A4"], // Money Transfer
      ["#F28860", "#F6B49E"], // Recharge
      ["#EF5D6E", "#F29CA8"], // Apes
      ["#F491A4", "#F9C5D3"], // MPOS
      ["#DF8AB9", "#F1B5D4"], // Settlement
      ["#AB8ABF", "#D1C4DE"], // Add Money
      ["#6B86C1", "#A3B5E0"],
      ["#66CFF9", "#A8E6FF"],
      ["#65C9CB", "#A6E4E5"],
    ];

    // Raw Data (before sorting)
    let rawData = data;

    // Convert amounts to numbers, then sort in descending order
    rawData = rawData
      .map((item, index) => ({
        ...item,
        currentMonthTotalAmount: parseFloat(item.currentMonthTotalAmount),
        prevMonthTotalAmount: parseFloat(item.prevMonthTotalAmount),
        total:
          parseFloat(item.currentMonthTotalAmount) +
          parseFloat(item.prevMonthTotalAmount),
        color1: colors[index % colors.length][0], // Assigning colors index-wise
        color2: colors[index % colors.length][1],
      }))
      .sort((a, b) => a.total - b.total); // Sort in descending order

    chart.data = rawData;

    // X Axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "top";
    categoryAxis.renderer.labels.template.dy = 10;
    categoryAxis.renderer.labels.template.wrap = true;

    // ✅ **Force all labels to be visible**
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.labels.template.disabled = false;

    // Y Axis
    // Y Axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.strictMinMax = false; // Disable strict min-max for auto-scaling
    valueAxis.extraMax = 0.2; // Adds 20% extra space on top
    valueAxis.maxPrecision = 0; // Avoids decimal precision issues
    valueAxis.renderer.labels.template.paddingBottom = 10;

    // First Stacked Layer (Previous Month)
    let series1 = chart.series.push(new am4charts.ConeSeries());
    series1.columns.template.width = am4core.percent(40);
    series1.dataFields.valueY = "prevMonthTotalAmount";
    series1.dataFields.categoryX = "name";
    series1.name = "Previous Month";
    series1.stacked = true;
    series1.columns.template.tooltipText =
      "{categoryX} Previous: [bold]{valueY}[/]";
    series1.columns.template.adapter.add(
      "fill",
      (fill, target) => target.dataItem.dataContext.color1
    );
    series1.columns.template.adapter.add(
      "stroke",
      (stroke, target) => target.dataItem.dataContext.color1
    );

    // Second Stacked Layer (Current Month)
    let series2 = chart.series.push(new am4charts.ConeSeries());
    series2.columns.template.width = am4core.percent(40);

    series2.dataFields.valueY = "currentMonthTotalAmount";
    series2.dataFields.categoryX = "name";
    series2.name = "Current Month";
    series2.stacked = true;
    series2.columns.template.tooltipText =
      "{categoryX} Current: [bold]{valueY}[/]";
    series2.columns.template.adapter.add(
      "fill",
      (fill, target) => target.dataItem.dataContext.color2
    );
    series2.columns.template.adapter.add(
      "stroke",
      (stroke, target) => target.dataItem.dataContext.color2
    );

    // Cleanup on Unmount
    return () => {
      chart.dispose();
    };
  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div>
        {/* <ReactApexChart
                        options={options}
                        series={[
                            { name: "Today", data: data.map(item => item.currentMonthTotalAmount) },
                            { name: "Previous Month Day", data: data.map(item => item.prevMonthTotalAmount) },
                        ]}
                        type="bar"
                        height={350}
                    /> */}
          <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Sales Chart</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="today">Today</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
        {isLoading ? <Loader /> :<div id="chartdiv" style={{ width: "100%", height: "400px" }}> </div>}
      </div>
    </div>
  );
};

export default TransactionsBarChart;
