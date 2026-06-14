import {
  CheckCircle,
  HourglassEmpty,
  Error,
  Refresh,
  TransferWithinAStation,
  Loyalty,
} from "@mui/icons-material";

const statusStyles: Record<string, string> = {
  success:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-800/60 dark:bg-green-950/50 dark:text-green-300",
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300",
  failed:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300",
  fail: "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300",
  failure:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300",
  reverse:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/50 dark:text-blue-300",
  transfer:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
  default:
    "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800/60 dark:bg-fuchsia-950/50 dark:text-fuchsia-300",
};

const statusIcons: Record<string, JSX.Element> = {
  success: <CheckCircle />,
  pending: <HourglassEmpty />,
  failed: <Error />,
  fail: <Error />,
  failure: <Error />,
  reverse: <Refresh />,
  transfer: <TransferWithinAStation />,
  default: <Loyalty />,
};

const statusLabels: Record<string, string> = {
  success: "Success",
  pending: "Pending",
  failed: "Failed",
  fail: "Failed",
  failure: "Failed",
  reverse: "Reverse",
  transfer: "Transfer",
};

export function renderTransactionStatus(status: string) {
  const key = status?.toLowerCase?.() ?? "default";
  const styleKey = statusStyles[key] ? key : "default";
  const Icon = statusIcons[styleKey] ?? statusIcons.default;
  const label = statusLabels[styleKey] ?? status;

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 shadow-sm transition-all duration-300 hover:scale-[1.02] ${statusStyles[styleKey]}`}
    >
      {Icon}
      <span className="font-semibold tracking-wide">{label}</span>
    </div>
  );
}
