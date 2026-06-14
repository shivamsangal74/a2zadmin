import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
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
import { TextField, InputAdornment } from "@mui/material";
import SearchOutlined from "@mui/icons-material/SearchOutlined";

/** Matches report amount / OpName / apiBalance column styling in Reports.tsx */
const REPORT_TABLE_FONT_FAMILY =
  'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

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
  report_id?: string;
  isShowSeq?: boolean;
}

const BasicTable: React.FC<BasicTableProps> = ({
  data,
  columns,
  actions,
  isFilters = true,
  filter = [],
  isSeachable = true,
  isReport = false,
  report_id,
  isShowSeq = false,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilter, setColumnFilter] = useState<{ id: string; value: string }[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const hasMessageCol = Array.isArray(columns)
      ? columns.some((c: any) => c?.accessorKey === "message" || c?.id === "message")
      : false;
    const isForcedReport = report_id === "2_4" || report_id === "2_10" || report_id === "123";
    return isReport && (hasMessageCol || isForcedReport) ? { message: false } : {};
  });
  const [pageSize, setPageSize] = useState(10); // State for page size
  const handleColumnFilterChange = (accessor: string, value: string) => {
    setColumnFilter((prev: { id: string; value: string }[]) => {
      const rest = prev.filter((f) => f.id !== accessor);
      if (value === "" || value === null || value === undefined) {
        return rest;
      }
      return [...rest, { id: accessor, value }];
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

  if (isShowSeq) {
    extendedColumns.unshift({
      id: "S_No.",
      header: "S_No.",
      cell: (row: any) => (
        <div className="flex justify-center">
          {JSON.stringify(row.row.index + 1)}
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
      className="flex flex-wrap rounded border border-stroke bg-white shadow dark:border-strokedark dark:bg-boxdark dark:text-bodydark1"
      style={{ width: "700px" }}>
      <div
        style={{
          display: "grid",
          padding: "10px 15px",
          gridTemplateColumns: "auto auto auto auto",
        }}>
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
        {table.getAllLeafColumns().map((column: any, i: any) => {
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

  // Inside the BasicTable component
  const servicesTotal = useMemo(() => {
    if (report_id === "2_15" && table.getFilteredRowModel().rows.length > 0) {
      return table.getFilteredRowModel().rows.reduce(
        (acc, row) => {
          const curr = row.original;
          acc.Recharge += curr?.Recharge || 0;
          acc.Money += curr?.Money || 0;
          acc.Apes += curr?.Apes || 0;
          acc.Upi += curr?.upi || 0;
          acc.Mpos += curr?.mpos || 0;
          acc.Total += curr?.Total || 0;
          acc.Settlement += curr?.Settlement || 0;
          acc.SubTotal += curr?.SubTotal || 0;
          return acc;
        },
        {
          Recharge: 0,
          Money: 0,
          Apes: 0,
          Upi: 0,
          Mpos: 0,
          Total: 0,
          Settlement: 0,
          SubTotal: 0,
        }
      );
    }
    return null; // Or an empty object if preferred
  }, [table.getFilteredRowModel().rows, report_id]);

  const hasMessageColumn = useMemo(() => {
    if (!Array.isArray(extendedColumns)) return false;
    const hasCol = extendedColumns.some(
      (c: any) => c?.accessorKey === "message" || c?.id === "message"
    );
    return hasCol || report_id === "2_4" || report_id === "2_10" || report_id === "123";
  }, [extendedColumns]);

  const getRowMessage = (original: any) => {
    const response = original?.response ?? original?.message;
    if (!response) return "";
    if (typeof response !== "string") {
      try {
        return JSON.stringify(response);
      } catch {
        return String(response);
      }
    }

    try {
      const parsed = JSON.parse(response);
      return (
        parsed?.message ||
        parsed?.status ||
        parsed?.response_description ||
        parsed?.error ||
        response
      );
    } catch {
      return response;
    }
  };

  return (
    <>
      {report_id == "2_15" && (
        <div className="flex justify-between mt-3 mb-3">
          {servicesTotal && (
            <>
              <div className="mb-3 flex flex-wrap gap-6">
                {Object.entries(servicesTotal).map(([key, value]) => {
                  return (
                    <div className="py-2 px-3 flex gap-1 flex-col min-w-[150px] rounded-lg bg-white border border-[#7851bd33]">
                      <div className="flex gap-2.5 items-center">
                        <span className="text-sm font-medium tracking-[1.8px] text-[#637381] uppercase">
                          {key}
                        </span>
                      </div>
                      <span className="text-md font-semibold text-[#212B36] tracking-[1.8px]">
                        ₹ {value.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
      <div
        className={
          isReport
            ? "overflow-hidden rounded-xl border border-slate-200/90 bg-white pt-0 pb-2.5 shadow-md shadow-slate-200/30 ring-1 ring-slate-100/70 dark:border-slate-700 dark:bg-slate-900 dark:ring-slate-800/80 xl:pb-1"
            : "rounded-sm border border-stroke bg-white pt-3 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1"
        }
      >
        <div className="" style={{ minHeight: isReport ? "auto" : "75vh" }}>
          {isReport ? (
            <div className="border-b border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-blue-50 px-3 py-3 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                  {isSeachable && (
                    <TextField
                      size="small"
                      name="search"
                      placeholder="Search table…"
                      value={globalFilterValue}
                      onChange={(e) => setGlobalFilterValue(e.target.value)}
                      className="sm:max-w-[300px]"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchOutlined
                              sx={{ color: "action.active", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                  )}
                  {isFilters &&
                    columns
                      .filter(
                        (col) =>
                          filter.includes(col.accessorKey) &&
                          col.accessorKey !== "status"
                      )
                      .map((column) => (
                        <div
                          key={column.accessorKey}
                          className="min-w-[140px] flex-1 sm:min-w-[180px] sm:max-w-[240px]"
                        >
                          <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-bodydark">
                            {capitalizeFirstLetter(
                              column.accessorKey
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                            )}
                          </label>
                          <select
                            defaultValue=""
                            onChange={(e) =>
                              handleColumnFilterChange(
                                column.accessorKey,
                                e.target.value
                              )
                            }
                            className="form-select w-full rounded-lg border-slate-300 bg-white text-sm shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                          >
                            <option value="">
                              All{" "}
                              {capitalizeFirstLetter(
                                column.accessorKey
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
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
                        </div>
                      ))}
                  {isFilters &&
                    filter.includes("status") &&
                    columns.some((c) => c.accessorKey === "status") && (
                      <div className="min-w-0 sm:max-w-full">
                        <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-bodydark">
                          Status
                        </span>
                        <div
                          className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-800"
                          role="group"
                          aria-label="Filter by status"
                        >
                          <button
                            type="button"
                            onClick={() => handleColumnFilterChange("status", "")}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                              (columnFilter.find((f: any) => f.id === "status")
                                ?.value ?? "") === ""
                                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200 dark:bg-boxdark-2 dark:text-white dark:ring-strokedark"
                                : "text-slate-600 hover:bg-white/90 dark:text-bodydark"
                            }`}
                          >
                            All
                          </button>
                          {getUniqueValues("status").map((value, index) => {
                            const active =
                              (columnFilter.find((f: any) => f.id === "status")
                                ?.value ?? "") === value;
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() =>
                                  handleColumnFilterChange("status", value)
                                }
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                                  active
                                    ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200 dark:bg-boxdark-2 dark:text-white dark:ring-strokedark"
                                    : "text-slate-600 hover:bg-white/90 dark:text-bodydark"
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
                {data.length > 0 && isReport && (
                  <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-100/90 pt-3 dark:border-slate-700 sm:border-0 sm:pt-0">
                    <button
                      type="button"
                      title="Export Excel"
                      aria-label="Export Excel"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
                      onClick={() => exportExcel2(table, "report")}
                    >
                      <SiMicrosoftexcel fontSize={22} color="white" />
                    </button>
                    <button
                      type="button"
                      title="Export CSV"
                      aria-label="Export CSV"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-amber-600 hover:shadow-lg active:scale-95"
                      onClick={() =>
                        exportExcel(table.getFilteredRowModel().rows)
                      }
                    >
                      <GrDocumentCsv fontSize={22} color="white" />
                    </button>
                    <Popover
                      placement="leftBottom"
                      title="Choose which columns you want to display by default"
                      content={content}
                    >
                      <button
                        type="button"
                        title="Columns"
                        aria-label="Column visibility"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                      >
                        <FaFilter fontSize={22} color="white" />
                      </button>
                    </Popover>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-3 flex justify-between">
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
                  <div className="m-2 flex gap-2">
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
                                    className="w-4 h-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                                    name="statusFilter"
                                    id={`status-${"hfghgf"}`}
                                    value={""}
                                    onChange={() =>
                                      handleColumnFilterChange(
                                        column.accessorKey,
                                        ""
                                      )
                                    }
                                  />
                                  <label
                                    className="ms-2 w-full py-1.5 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    htmlFor={`status-${"fdf"}`}
                                  >
                                    All
                                  </label>
                                </div>
                                {getUniqueValues(
                                  column.accessorKey.toLowerCase()
                                ).map((value, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center"
                                  >
                                    <input
                                      type="radio"
                                      className="w-4 h-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
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
                                      className="ms-2 w-full py-1.5 text-sm font-medium text-gray-900 dark:text-gray-300"
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
                            defaultValue=""
                            onChange={(e) =>
                              handleColumnFilterChange(
                                column.accessorKey,
                                e.target.value
                              )
                            }
                            className="form-select"
                          >
                            <option value="">
                              Select{" "}
                              {capitalizeFirstLetter(
                                column.accessorKey
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
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
            </div>
          )}
          <div
            className="max-w-full overflow-x-auto"
            style={{ minHeight: "64vh" }}>
            <table
              className="mt-2 w-full table-auto"
              style={
                isReport ? { fontFamily: REPORT_TABLE_FONT_FAMILY } : undefined
              }>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className={`text-left ${
                      isReport
                        ? "bg-slate-100 shadow-sm dark:bg-slate-800"
                        : "bg-slate-50 dark:bg-slate-800"
                    }`}
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
                        className={
                          isReport
                            ? "px-4 py-4 text-center text-[0.8rem] font-semibold text-slate-800 dark:text-slate-100"
                            : "px-4 py-4 font-large text-center text-slate-900 dark:text-white"
                        }>
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
                {table.getRowModel().rows.map((row) => {
                  const rowMessage =
                    hasMessageColumn && isReport ? getRowMessage(row.original) : "";
                  const showRowMessage =
                    Boolean(rowMessage) &&
                    (row?.original?.status?.toString()?.toLowerCase() ?? "") !==
                      "success";

                  return (
                    <React.Fragment key={row.id}>
                      <tr>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              style={{
                                minWidth: cell.column.getSize(),
                                fontSize: "0.8rem",
                                textAlign: "center",
                              }}
                              className={`border-b border-slate-200/80 bg-white py-1 px-3 dark:border-slate-700 ${
                                isReport
                                  ? "dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                  : "dark:bg-slate-900 text-black dark:text-white"
                              }`}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {showRowMessage && (
                        <tr key={`${row.id}-message`}>
                          <td
                            colSpan={row.getVisibleCells().length}
                            className="border-b border-[#eee] bg-gradient-to-r from-rose-50/90 to-white py-1.5 px-3 text-rose-950 dark:border-slate-700 dark:from-rose-950/40 dark:to-slate-900 dark:text-rose-100"
                            style={{
                              textAlign: "left",
                              fontSize: "11px",
                              fontFamily:
                                'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                              paddingLeft: "14px",
                            }}
                          >
                            {rowMessage}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data.length > 10 && (
            <div className="flex items-center justify-between p-5 dark:text-bodydark1">
              <div className="flex space-x-2">
                <button
                  className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-graydark dark:disabled:bg-boxdark"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}>
                  Previous
                </button>

                {generatePagination().map((page, index, arr) => (
                  <React.Fragment key={page}>
                    {index > 0 && page !== arr[index - 1] + 1 && (
                      <span className="text-body dark:text-bodydark">...</span>
                    )}
                    <button
                      className={`rounded px-4 py-2 ${
                        table.getState().pagination.pageIndex === page - 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-boxdark dark:text-bodydark1 dark:hover:bg-meta-4"
                      }`}
                      onClick={() => table.setPageIndex(page - 1)}>
                      {page}
                    </button>
                  </React.Fragment>
                ))}

                <button
                  className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 dark:bg-meta-4 dark:text-white dark:hover:bg-graydark dark:disabled:bg-boxdark"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}>
                  Next
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <label
                  htmlFor="pageSizeSelect"
                  className="text-gray-700 dark:text-bodydark">
                  Page Size:
                </label>
                <select
                  id="pageSizeSelect"
                  value={pageSize}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "All") {
                      const allRowsCount =
                        table.getFilteredRowModel().rows.length; // Adjust based on your table library
                      setPageSize(allRowsCount); // Update state
                      table.setPageSize(allRowsCount); // Set all rows to display
                    } else {
                      const size = Number(value);
                      setPageSize(size);
                      table.setPageSize(size);
                    }
                  }}
                  className="rounded border border-gray-300 bg-white px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-strokedark dark:bg-form-input dark:text-white">
                  {["All", 5, 10, 20, 50, 100].map((size) => (
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
    </>
  );
};

export default BasicTable;
