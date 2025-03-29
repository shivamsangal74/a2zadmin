import { useEffect, useState } from "react";
import NeedleChart from "./chartFive"
import api from "../../Services/Axios/api";
import { Box } from "@mui/material";

const UsersChart = () => {
const [chartData,setChartData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/active-data"); // Replace with actual API URL
     
        const data = response.data.chartData;
        

        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);


    return (
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12 flex flex-wrap">

       
       {chartData.map((data, index) => (
          <NeedleChart key={index} inactiveUsers={parseInt(data.inactiveUsers)} activeUsers={parseInt(data.activeUsers)}  userType={data.userType} />
        ))}
     
      </div>
    );
  };
  
  export default UsersChart;