import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FaUserCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
export default function DataGrid({ data, columns }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const navigate = useNavigate()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
        />
        <table className="w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-2 text-left dark:bg-meta-4">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="py-4 px-4 font-medium text-black dark:text-white"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {
                          { asc: <FaArrowUp />, desc: <FaArrowDown /> }[
                            header.column.getIsSorted() ?? null
                          ]
                        }
                      </div>
                    )}
                    
                  </th>
                  
                ))}
                 <th className="py-4 px-4 font-medium text-black dark:text-white">
                Action
              </th>
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                 <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                    <FaUserCheck onClick={() => navigate(`/users/kyc/${row.original.id}`)} />
                    </button>
                    <button className="hover:text-primary">
                      <MdDelete />
                    </button>
                    <button className="hover:text-primary">
                      <CiEdit />
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button onClick={() => table.setPageIndex(0)}>First page</button>
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous page
          </button>
          <button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next page
          </button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
            Last page
          </button>
        </div>
      </div>
    </div>
  );
}
