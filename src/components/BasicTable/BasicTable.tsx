import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import DropMenu from "../DropMenu/DropMenu";
import TextInput from "../Input/TextInput";
import { SiMicrosoftexcel } from "react-icons/si";
import { GrDocumentCsv } from "react-icons/gr";
import { FaFilter } from "react-icons/fa";
import { Popover } from "antd";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { TextField } from "@mui/material";
interface TableColumn {
  header: string;
  accessorKey: string;
}

interface BasicTableProps {
  data: any[];
  columns: any;
  actions?: any;
  isFilters?: boolean;
  filter?: string[];
  isSeachable?: boolean;
  isReport?: Boolean;
  report_id?: string
}

const BasicTable: React.FC<BasicTableProps> = ({
  data,
  columns,
  actions,
  isFilters = true,
  filter = [],
  isSeachable = true,
  isReport = false,
  report_id
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilter, setColumnFilter] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pageSize, setPageSize] = useState(10); // State for page size
  const handleColumnFilterChange = (accessor: string, value: string) => {
    setColumnFilter((prev) => {
      //const accessorKey = prev.find((filter) => filter.id === accessor)?.value;

      return prev.concat({
        id: accessor,
        value: value,
      });
    });
  };

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: "Report", // export file name (without .csv)
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const exportExcel = (rows: Row<_>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const extendedColumns = [...columns];
  if (actions && actions.length > 0) {
    extendedColumns.push({
      id: "actions",
      header: "Actions",
      cell: (row: any) => (
        <div className="flex justify-center">
          <DropMenu actions={actions} dataProp={row} />
        </div>
      ),
    });
  }
  const table = useReactTable({
    data,
    columns: extendedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
      sorting: sorting,
      columnFilters: columnFilter,
      globalFilter: globalFilterValue,
    },
    onSortingChange: setSorting,
    onFilterChange: handleColumnFilterChange,
    onGlobalFilterChange: setGlobalFilterValue,
    columnResizeMode: "onChange",
  });

  // const getUniqueValues = (accessorKey) => {
  //   return [...new Set(data.map((row) => row[accessorKey]))];
  // };
  const getUniqueValues = (accessorKey: any) => {
    if (!data || data.length === 0 || data?.message === "No Record Found") {
      return [];
    }

    return [
      ...new Set(
        data
          .map((row) => row[accessorKey])
          .filter(
            (value) => value !== null && value !== undefined && value !== ""
          )
      ),
    ];
  };

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  let content = (
    <div
      className="flex border border-black shadow rounded flex-wrap"
      style={{ width: "700px" }}
    >
      <div
        style={{
          display: "grid",
          padding: "10px 15px",
          gridTemplateColumns: "auto auto auto auto",
        }}
      >
        <div className="px-5">
          <label>
            <input
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{" "}
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map((column: any) => {
          return (
            <div key={column.id} className="px-5">
              <label>
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{" "}
                {column.id}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
  const pageNumbers = Array.from(
    { length: table.getPageCount() },
    (_, index) => index + 1
  );

  const generatePagination = () => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const delta = 5; // Number of pages before/after current to show
  
    if (totalPages <= 1) return [];
  
    const pagination = new Set<number>();
  
    // Always show the first page
    pagination.add(1);
  
    // Pages before and after the current page
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        pagination.add(i);
      }
    }
  
    // Always show the last page
    pagination.add(totalPages);
  
    return Array.from(pagination).sort((a, b) => a - b);
  };
  

  async function exportExcel2(
    table: Table<any>,
    filename: string,
    applyFilters = true
  ) {
    const wb = new Workbook();
    const ws = wb.addWorksheet("Sheet 1");

    const lastHeaderGroup = table.getHeaderGroups().at(-1);
    if (!lastHeaderGroup) {
      console.error("No header groups found", table.getHeaderGroups());
      return;
    }

    ws.columns = lastHeaderGroup.headers
      .filter((h) => h.column.getIsVisible())
      .map((header) => {
        return {
          header: header.column.columnDef.header as string,
          key: header.id,
          width: 20,
        };
      });

    const exportRows = applyFilters
      ? table.getFilteredRowModel().rows
      : table.getCoreRowModel().rows;

    exportRows.forEach((row) => {
      const cells = row.getVisibleCells();
      const values = cells.map((cell) => cell.getValue() ?? "");
      console.log("values", values);
      ws.addRow(values);
    });

    ws.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    // for csv: await wb.csv.writeBuffer();
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${filename}.xlsx`);
  }

  return (
    <div className="rounded-sm border border-stroke bg-white  pt-3 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <div className="" style={{ minHeight: "75vh" }}>
        <div className="flex justify-between mt-3">
          {isSeachable && (
            <div className="">
              <div className="m-2">
                <TextField
                  size="small"
                  name="search"
                  label="Search"
                  onChange={(e) => setGlobalFilterValue(e.target.value)}
                />
              </div>
              <div className="flex gap-2 m-2">
                {isFilters &&
                  columns
                    .filter((col) => filter.includes(col.accessorKey))
                    .map((column) => (
                      <div key={column.accessorKey}>
                        {column.accessorKey === "status" ? (
                          <div className="flex items-center gap-3">
                            <div key={"fnd"} className="form-check">
                              <input
                                type="radio"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                name="statusFilter"
                                id={`status-${"hfghgf"}`}
                                value={""}
                                onChange={(e) =>
                                  handleColumnFilterChange(
                                    column.accessorKey,
                                    ""
                                  )
                                }
                              />
                              <label
                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                htmlFor={`status-${"fdf"}`}
                              >
                                All
                              </label>
                            </div>
                            {getUniqueValues(
                              column.accessorKey.toLowerCase()
                            ).map((value, index) => (
                              <div key={index} className="flex items-center">
                                <input
                                  type="radio"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                  name="statusFilter"
                                  id={`status-${index}`}
                                  value={value}
                                  onChange={(e) =>
                                    handleColumnFilterChange(
                                      column.accessorKey,
                                      e.target.value
                                    )
                                  }
                                />
                                <label
                                  className={`className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"}`}
                                  htmlFor={`status-${index}`}
                                >
                                  {value}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            {isFilters &&
              columns
                .filter((col) => filter.includes(col.accessorKey))
                .map((column) => (
                  <div key={column.accessorKey} className="mb-2">
                    {column.accessorKey === "status" ? (
                      ""
                    ) : (
                      <select
                        onChange={(e) =>
                          handleColumnFilterChange(
                            column.accessorKey,
                            e.target.value
                          )
                        }
                        className="form-select"
                      >
                        <option selected value="">
                          Select{" "}
                          {capitalizeFirstLetter(
                            column.accessorKey.replace(/([A-Z])/g, " $1").trim()
                          )}
                        </option>
                        {getUniqueValues(column.accessorKey).map(
                          (value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </div>
                ))}
          </div>
          {data.length > 0 && isReport && (
            <div className="flex justify-end gap-3 mr-3">
              <div
                className="flex items-center justify-center rounded cursor-pointer"
                style={{
                  backgroundColor: "green",
                  width: "40px",
                  height: "40px",
                }}
              >
                <SiMicrosoftexcel
                  fontSize={25}
                  color="white"
                  onClick={() => exportExcel2(table, "report")}
                />
              </div>
              <div
                className="flex items-center justify-center rounded cursor-pointer"
                style={{
                  backgroundColor: "#f77e17",
                  width: "40px",
                  height: "40px",
                }}
                onClick={() => exportExcel(table.getFilteredRowModel().rows)}
              >
                <GrDocumentCsv fontSize={25} color="white" />
              </div>
              <div
                className="flex items-center justify-center rounded cursor-pointer"
                style={{
                  backgroundColor: "#1E40AF",
                  width: "40px",
                  height: "40px",
                }}
              >
                <Popover
                  placement="leftBottom"
                  title={"Choose which columns you want to display by default"}
                  content={content}
                >
                  <FaFilter fontSize={25} color="white" />
                </Popover>
              </div>
            </div>
          )}
        </div>
        <div
          className="max-w-full overflow-x-auto"
          style={{ minHeight: "64vh" }}
        >
          <table className="w-full table-auto mt-2">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-gray-2 text-left dark:bg-meta-4"
                  style={{ backgroundColor: "#f5f5f5" }}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        minWidth: header.getSize(),
                        textAlign: "center",
                        padding: "10px 20px",
                        textWrap: "nowrap",
                      }}
                      className="py-4 px-4 font-large text-black dark:text-white"
                    >
                      <div className="flex items-center justify-center gap-2">
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
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    console.log(row.original.status)
                    

                    return (
                      <td
                        key={cell.id}
                        style={{
                          minWidth: cell.column.getSize(),
                          fontSize: "0.8rem",
                          textAlign: "center",
                          color: `${ (row?.original?.status?.toString()?.toLowerCase()  == "success" && report_id !="1_3") ? "green" : (row?.original?.status?.toString()?.toLowerCase()  == "failed" && report_id !="1_3")  ? "red" :(row?.original?.status?.toString()?.toLowerCase()  == "pending" && report_id !="1_3") ? "orange" :  ""}`
                        }}
                        className={`border-b border-[#eee] py-1 px-3 dark:border-strokedark `}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length > 10 && (
          <div className="flex justify-between items-center p-5">
            <div className="flex space-x-2">
  <button
    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </button>

  {generatePagination().map((page, index, arr) => (
    <React.Fragment key={page}>
      {index > 0 && page !== arr[index - 1] + 1 && <span>...</span>}
      <button
        className={`px-4 py-2 rounded ${
          table.getState().pagination.pageIndex === page - 1
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => table.setPageIndex(page - 1)}
      >
        {page}
      </button>
    </React.Fragment>
  ))}

  <button
    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    Next
  </button>
</div>

            <div className="flex items-center space-x-2">
              <label htmlFor="pageSizeSelect" className="text-gray-700">
                Page Size:
              </label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  setPageSize(size);
                  table.setPageSize(size);
                }}
                className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 20, 50,100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicTable;
