import { useState, useMemo } from "react";
import DefaultLayout from "../../../layout/DefaultLayout";
import { apiUrl } from "../../../Utills/constantt";
import { useQuery } from "@tanstack/react-query";
import { getLappu, getVendors } from "../../../Services/vendorService";
import { getOperatorsByCategoryCode } from "../../../Services/commonService";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { DropSearch } from "../../../components/DropDown/DropSearch";
import Popup from "../../../components/Model/Model";
import TextInput from "../../../components/Input/TextInput";
import { ButtonLabel } from "../../../components/Button/Button";
import { IoAdd } from "react-icons/io5";
import Switch from "@mui/material/Switch";
import { saveLappuNo } from "../../../Services/vendorService";

// ── operator badge colours ──────────────────────────────────────────────────
const OP_COLORS: Record<string, { bg: string; text: string; short: string }> = {
  airtel:    { bg: "#ef4444", text: "#fff", short: "AI" },
  jio:       { bg: "#2563eb", text: "#fff", short: "JI" },
  vi:        { bg: "#7c3aed", text: "#fff", short: "VI" },
  vodafone:  { bg: "#7c3aed", text: "#fff", short: "VI" },
  bsnl:      { bg: "#16a34a", text: "#fff", short: "BS" },
  default:   { bg: "#6b7280", text: "#fff", short: "OP" },
};

function opBadge(name: string) {
  const key = Object.keys(OP_COLORS).find((k) =>
    name?.toLowerCase().includes(k)
  );
  return OP_COLORS[key ?? "default"];
}

// ── number formatting ────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

// ────────────────────────────────────────────────────────────────────────────

const LapuList = () => {
  const [search, setSearch] = useState("");
  const [filterOp, setFilterOp]       = useState("");
  const [filterVendor, setFilterVendor] = useState("");
  const [openAdd, setOpenAdd]   = useState(false);
  const [lapuNumber, setLapuNumber] = useState("");
  const [lapuName, setLapuName]     = useState("");
  const [selectedOp, setSelectedOp] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [lapuOps, setLapuOps] = useState<{ showvalue: string; value: string; image?: string }[]>([]);
  const [isLapuOpsLoading, setIsLapuOpsLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // ── data fetching ──────────────────────────────────────────────────────────
  const { data: lapus = [], isLoading, refetch } = useQuery({
    queryKey: ["lapuList"],
    queryFn: async () => {
      const data = await getLappu();
      return data ?? [];
    },
    refetchOnWindowFocus: false,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors-for-lapu"],
    queryFn: getVendors,
    refetchOnWindowFocus: false,
  });

  // ── derived data ───────────────────────────────────────────────────────────
  const vendorOptions = useMemo(
    () =>
      (vendors as any[]).map((v) => ({
        showvalue: `${v.fullName} – ${v.mobileno}`,
        value: v.vendorUniqueId,
      })),
    [vendors]
  );

  const uniqueOps = useMemo(() => {
    const seen = new Set<string>();
    const opts: { showvalue: string; value: string }[] = [];
    (lapus as any[]).forEach((l) => {
      if (l.operator && !seen.has(l.operator)) {
        seen.add(l.operator);
        opts.push({ showvalue: l.operator, value: l.operator });
      }
    });
    return opts;
  }, [lapus]);

  const filtered = useMemo(() => {
    return (lapus as any[]).filter((l) => {
      if (search && !`${l.lappuId} ${l.lappuName} ${l.vendor}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterOp && l.operator !== filterOp) return false;
      if (filterVendor && l.vendorId !== filterVendor) return false;
      return true;
    });
  }, [lapus, search, filterOp, filterVendor]);

  const totalOn  = (lapus as any[]).filter((l) => l.status === "ON" || l.status === true || l.active).length;
  const totalOff = (lapus as any[]).length - totalOn;
  const totalBal = (lapus as any[]).reduce((s, l) => s + (Number(l.balance) || 0), 0);

  // ── operators lazy load ────────────────────────────────────────────────────
  const fetchLapuOps = async () => {
    if (lapuOps.length > 0) return;
    setIsLapuOpsLoading(true);
    try {
      const data = await getOperatorsByCategoryCode(317);
      setLapuOps(
        data.map((op: any) => ({
          showvalue: `${op.name} (${op.id})`,
          value: String(op.id),
          image: op.operatorImage ? `${apiUrl}/uploads/operatorimages/${op.operatorImage}` : undefined,
        }))
      );
    } catch {
      toast.error("Failed to load operators.");
    } finally {
      setIsLapuOpsLoading(false);
    }
  };

  // ── actions ────────────────────────────────────────────────────────────────
  const handleAddLapu = async () => {
    if (!lapuNumber || !selectedVendor) {
      toast.error("Lapu number and vendor are required.");
      return;
    }
    setAddLoading(true);
    try {
      await saveLappuNo({
        lappuId: lapuNumber,
        lappuName: lapuName,
        lappuOperator: selectedOp,
        vendorId: selectedVendor,
      });
      toast.success("Lapu added successfully.");
      setOpenAdd(false);
      setLapuNumber(""); setLapuName(""); setSelectedOp(""); setSelectedVendor("");
      refetch();
    } catch {
      toast.error("Failed to add Lapu.");
    } finally {
      setAddLoading(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <DefaultLayout isList={true}>
      {/* ── page header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lapu List</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all your lapus</p>
        </div>
        <div className="flex gap-2">
          
          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            <IoAdd size={16} /> Add Lapu
          </button>
        </div>
      </div>

      {/* ── stats badges ── */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold">
          {(lapus as any[]).length} Lapus
        </span>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          {totalOn} On
        </span>
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          {totalOff} Off
        </span>
        {totalBal > 0 && (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            {fmt(totalBal)}
          </span>
        )}
      </div>

      {/* ── filter bar ── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search lapus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
        <div className="w-44">
          <DropSearch
            value={filterOp}
            onchange={(v) => setFilterOp(v || "")}
            placeholder="All Operators"
            options={uniqueOps}
            error=""
          />
        </div>
        <div className="w-52">
          <DropSearch
            value={filterVendor}
            onchange={(v) => setFilterVendor(v || "")}
            placeholder="All Vendors"
            options={vendorOptions}
            error=""
          />
        </div>
        {(search || filterOp || filterVendor) && (
          <button
            onClick={() => { setSearch(""); setFilterOp(""); setFilterVendor(""); }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── table ── */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {["ID", "OP", "LAPU NUMBER", "OPERATOR", "OP CODE", "PARTY", "BALANCE", "STATUS"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No lapus found.
                  </td>
                </tr>
              ) : (
                filtered.map((row: any, idx: number) => {
                  const badge = opBadge(row.operator ?? "");
                  const isOn = row.status === "ON" || row.status === true || row.active;
                  return (
                    <tr
                      key={row._id ?? idx}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {row._id?.slice(-6)?.toUpperCase() ?? `#${idx + 1}`}
                      </td>

                      {/* OP badge / image */}
                      <td className="px-4 py-3">
                        {row.image ? (
                          <img
                            src={`${apiUrl}/uploads/operatorimages/${row.image}`}
                            alt={row.operator ?? "op"}
                            className="w-9 h-9  object-contain bg-gray-100 dark:bg-gray-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).nextElementSibling?.removeAttribute("hidden");
                            }}
                          />
                        ) : <span
                        hidden={!!row.opimage}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {badge.short}
                      </span>}
                        
                      </td>

                      {/* Lapu Number */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
                          {row.lappuId}
                        </p>
                        <p className="text-xs text-gray-400">{row.lappuName}</p>
                      </td>

                      {/* Operator name */}
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                        {row.operator || "—"}
                      </td>

                      {/* Operator code */}
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-mono">
                          {row.operatorCode || "—"}
                        </span>
                      </td>

                      {/* Party */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-700 dark:text-gray-200">{row.vendor}</p>
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold">
                          {row.balance != null ? fmt(Number(row.balance)) : "—"}
                        </span>
                      </td>

                      {/* Status toggle */}
                      <td className="px-4 py-3">
                        <Switch
                          size="small"
                          checked={isOn}
                          sx={{
                            "& .MuiSwitch-thumb": { backgroundColor: isOn ? "#22c55e" : "#ef4444" },
                            "& .MuiSwitch-track": { backgroundColor: isOn ? "#86efac" : "#fca5a5" },
                          }}
                          onChange={() => {}}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add Lapu popup ── */}
      <Popup
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Add Lapu"
        width="large"
        styles={{}}
      >
        <div className="grid gap-4 p-2">
          <TextInput
            label="Lapu Number"
            value={lapuNumber}
            name="lapuNumber"
            onChange={setLapuNumber}
            type="number"
            required
          />
          <TextInput
            label="Lapu Name"
            value={lapuName}
            name="lapuName"
            onChange={setLapuName}
          />
          <DropSearch
            value={selectedVendor}
            onchange={(v) => setSelectedVendor(v || "")}
            placeholder="Select Vendor *"
            options={vendorOptions}
            error=""
          />
          <DropSearch
            value={selectedOp}
            onchange={(v) => setSelectedOp(v || "")}
            placeholder="Select Operator"
            options={lapuOps}
            error=""
            isLoading={isLapuOpsLoading}
            onOpen={fetchLapuOps}
          />
          <div className="flex justify-end">
            <ButtonLabel
              type="button"
              loader={addLoading}
              disabled={addLoading}
              onClick={handleAddLapu}
              label="Add Lapu"
            />
          </div>
        </div>
      </Popup>
    </DefaultLayout>
  );
};

export default LapuList;
