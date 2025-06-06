import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import ChartOne from '../components/Charts/ChartOne';
import ChartThree from '../components/Charts/ChartThree';
import ChartTwo from '../components/Charts/ChartTwo';
import DefaultLayout from '../layout/DefaultLayout';
import CustomBarChart from '../components/Charts/ChartFour';
import PieChart from '../components/Charts/ChartTwo';
import ChartFour from '../components/Charts/ChartFour';
import UsersChart from '../components/Charts/UsersChart';
import { TopUsers } from '../components/Charts/TopUsers';

const Chart: React.FC = () => {
  return (
    <DefaultLayout isList={false}>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      

        <ChartOne />
        <PieChart />

        <UsersChart />
        <ChartThree />
        <ChartFour />
        <TopUsers />
    

      </div>
    </DefaultLayout>
  );
};

export default Chart;
