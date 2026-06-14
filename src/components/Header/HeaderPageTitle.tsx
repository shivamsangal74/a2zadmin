import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  chart: "Dashboard",
  users: "Users",
  userlist: "User List",
  onboardeduserlist: "Credopay Users",
  aepsuserslist: "AEPS Users",
  manage: "Manage",
  category: "Category",
  oprators: "Operators",
  fund: "Funds",
  "fund-transfer": "Fund Transfer",
  commission: "Commission",
  api: "API",
  "create-api": "Create API",
  template: "SMS Templates",
  bank: "Bank",
  "admin-bank": "Admin Bank",
  "bank-mode": "Bank Mode",
  "fund-request": "Fund Request",
  "user-settlement": "User Settlement",
  report: "Reports",
  "recharge-report": "Recharge Report",
  "apes-report": "AEPS Report",
  "settlement-report": "Settlement Report",
  "money-report": "Money Report",
  ledger: "Ledger",
  vendor: "Vendor",
  filter: "Filter",
  service: "Service",
  risk: "Risk Manage",
  profile: "My Profile",
  settings: "Settings",
};

const formatSegment = (segment: string) =>
  segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const HeaderPageTitle = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const current = segments[segments.length - 1] ?? "chart";
  const parent = segments.length > 1 ? segments[segments.length - 2] : null;

  const title = routeTitles[current] ?? formatSegment(current);
  const section =
    parent && routeTitles[parent] ? routeTitles[parent] : null;

  return (
    <div className="min-w-0 flex-1">
      {section && (
        <p className="truncate text-[10px] font-medium uppercase tracking-wider text-body dark:text-bodydark sm:text-[11px]">
          {section}
        </p>
      )}
      <h1 className="truncate text-sm font-semibold text-black dark:text-white sm:text-base">
        {title}
      </h1>
    </div>
  );
};

export default HeaderPageTitle;
