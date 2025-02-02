import React from 'react';
import { FaRupeeSign } from 'react-icons/fa6';

const StatsDisplay = ({ stats }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-lg mb-4">
      {stats && <>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Transaction Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-2 rounded-lg shadow-md text-center">
          <h4 className="text-sm font-medium text-green-700">Success</h4>
          <p className="text-lg font-semibold text-green-900">₹{stats.success.amount.toLocaleString()}</p>
          <p className="text-sm text-green-600">{stats.success.count} transactions</p>
        </div>

        <div className="bg-yellow-50 p-2 rounded-lg shadow-md text-center">
          <h4 className="text-sm font-medium text-yellow-700">Pending</h4>
          <p className="text-lg font-semibold text-yellow-900">₹{stats.pending.amount.toLocaleString()}</p>
          <p className="text-sm text-yellow-600">{stats.pending.count} transactions</p>
        </div>

        <div className="bg-red-50 p-2 rounded-lg shadow-md text-center">
          <h4 className="text-sm font-medium text-red-700">Fail</h4>
         <p className="text-lg font-semibold text-red-900"> ₹{stats.fail.amount.toLocaleString()}</p>
          <p className="text-sm text-red-600">{stats.fail.count} transactions</p>
        </div>

        {/* <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
          <h4 className="text-sm font-medium text-gray-700">Others</h4>
          <p className="text-lg font-semibold text-gray-900">{stats.others.amount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">{stats.others.count} transactions</p>
        </div> */}
      </div>
      </>}
    </div>
  );
};

export default StatsDisplay;
