import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { BsBank } from "react-icons/bs";
import {
  getPendingReportCount,
  type PendingReportCounts,
} from "../../Services/commonService";

const POLL_INTERVAL_MS = 5 * 60 * 1000;

const defaultCounts: PendingReportCounts = {
  recharge: 0,
  apes: 0,
  total: 0,
};

type PendingBadgeLinkProps = {
  to: string;
  title: string;
  label: string;
  count: number;
  icon: ReactNode;
  accentClass: string;
  loading?: boolean;
};

const PendingBadgeLink = ({
  to,
  title,
  label,
  count,
  icon,
  accentClass,
  loading = false,
}: PendingBadgeLinkProps) => {
  if (loading) {
    return (
      <span className="inline-flex h-8 min-w-[5.5rem] animate-pulse items-center rounded-lg border border-stroke bg-gray px-2.5 dark:border-strokedark dark:bg-meta-4" />
    );
  }

  const hasPending = count > 0;

  return (
    <Link
      to={to}
      title={title}
      className={`group inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors dark:text-white ${accentClass} ${
        hasPending ? "shadow-sm" : "opacity-80 hover:opacity-100"
      }`}
    >
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      <span className="hidden whitespace-nowrap sm:inline">{label}</span>
      <span
        className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
          hasPending
            ? "bg-meta-1 text-white"
            : "bg-stroke text-body dark:bg-strokedark dark:text-bodydark"
        }`}
      >
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
};

const PendingReportBadges = () => {
  const [counts, setCounts] = useState<PendingReportCounts>(defaultCounts);
  const [loading, setLoading] = useState(true);

  const fetchPendingCounts = useCallback(async () => {
    try {
      const data = await getPendingReportCount();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching pending report counts:", error);
      setCounts(defaultCounts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingCounts();
    const interval = setInterval(fetchPendingCounts, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchPendingCounts]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="hidden px-1 text-[10px] font-semibold uppercase tracking-wide text-body dark:text-bodydark md:inline">
        Pending
      </span>
      <PendingBadgeLink
        to="/report/recharge-report?status=Pending&period=month"
        title="Pending recharge requests (current month)"
        label="Recharge"
        count={counts.recharge}
        loading={loading}
        accentClass="border-primary/20 bg-primary/5 text-primary hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10"
        icon={<AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16 }} />}
      />
      <PendingBadgeLink
        to="/report/apes-report?status=Pending&period=month"
        title="Pending AEPS requests (current month)"
        label="AEPS"
        count={counts.apes}
        loading={loading}
        accentClass="border-meta-3/30 bg-meta-3/5 text-[#0d9668] hover:border-meta-3/50 hover:bg-meta-3/10 dark:border-meta-3/30 dark:bg-meta-3/10 dark:text-meta-3"
        icon={<BsBank size={15} />}
      />
    </div>
  );
};

export default PendingReportBadges;
