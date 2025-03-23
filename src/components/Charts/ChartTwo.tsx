import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { apiUrl } from '../../Utills/constantt';

const ChartTwo: React.FC = () => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState([]);

    useEffect(() => {
        fetch(apiUrl + "/dashboard/users-data")
            .then((response) => response.json())
            .then((data) => {
              debugger
              
                setData( data.chartData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
  useEffect(() => {
    
    const apiResponse = data

    const data1 = apiResponse;
    setSeries(data1.map((item) => item.userCount));
    setLabels(data1.map((item) => item.userType.toLocaleUpperCase()));
  }, [data]);

  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE', '#FFA500', '#FF4560', '#00E396'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'pie',
      height: 335,
    },
    labels: labels,
    legend: {
      position: 'bottom',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        return opts.w.config.series[opts.seriesIndex]; // Show actual value instead of percentage
      },
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        colors: ['#fff'],
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">Users</h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart options={options} series={series} type="pie" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
