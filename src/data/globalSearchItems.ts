export type GlobalSearchItem = {
  title: string;
  path: string;
  section: string;
  keywords: string[];
};

export const globalSearchItems: GlobalSearchItem[] = [
  { title: "Dashboard", path: "/chart", section: "Main", keywords: ["home", "chart", "analytics"] },
  { title: "Create User", path: "/users/", section: "Users", keywords: ["add user", "new user"] },
  { title: "User List", path: "/users/userlist", section: "Users", keywords: ["users", "retailers"] },
  { title: "Credopay Users", path: "/users/onboardeduserlist", section: "Users", keywords: ["onboarded", "credopay"] },
  { title: "AEPS Users", path: "/users/aepsuserslist", section: "Users", keywords: ["aeps", "apes"] },
  { title: "Category", path: "/manage/category", section: "Manage", keywords: ["category"] },
  { title: "Operators", path: "/manage/oprators", section: "Manage", keywords: ["operator", "mobile"] },
  { title: "Funds", path: "/manage/fund", section: "Manage", keywords: ["fund", "wallet"] },
  { title: "Fund Transfer", path: "/manage/fund-transfer", section: "Manage", keywords: ["transfer"] },
  { title: "Commission", path: "/manage/commission", section: "Manage", keywords: ["commission"] },
  { title: "API", path: "/manage/api", section: "Manage", keywords: ["api"] },
  { title: "Create API", path: "/manage/create-api", section: "Manage", keywords: ["new api"] },
  { title: "SMS Templates", path: "/manage/template", section: "Manage", keywords: ["sms", "template"] },
  { title: "Bank", path: "/manage/bank", section: "Manage", keywords: ["bank"] },
  { title: "Admin Bank", path: "/manage/admin-bank", section: "Manage", keywords: ["admin bank"] },
  { title: "Bank Mode", path: "/manage/bank-mode", section: "Manage", keywords: ["mode"] },
  { title: "Fund Request", path: "/manage/fund-request", section: "Manage", keywords: ["fund request"] },
  { title: "User Settlement", path: "/manage/user-bank", section: "Manage", keywords: ["settlement", "user bank"] },
  { title: "Create Roles", path: "/manage/roles", section: "Manage", keywords: ["roles", "permissions"] },
  { title: "Ledger", path: "/report/transaction", section: "Reports", keywords: ["ledger", "transaction"] },
  { title: "Party Due", path: "/report/credit", section: "Reports", keywords: ["party due", "credit"] },
  { title: "Virtual Balance Report", path: "/report/virtual", section: "Reports", keywords: ["virtual", "balance"] },
  { title: "Lappu Status Report", path: "/report/lappu-ledger", section: "Reports", keywords: ["lappu", "status"] },
  { title: "Lappu History Report", path: "/report/lappu-history", section: "Reports", keywords: ["lappu", "history"] },
  { title: "Recharge Report", path: "/report/recharge-report", section: "Reports", keywords: ["recharge", "pending", "mobile"] },
  { title: "Live Recharge Report", path: "/report/live-recharge-report", section: "Reports", keywords: ["live", "recharge"] },
  { title: "Money Report", path: "/report/money-report", section: "Reports", keywords: ["money", "dmt"] },
  { title: "MAB Report", path: "/report/mab-report", section: "Reports", keywords: ["mab"] },
  { title: "User Inactive Report", path: "/report/user_ractive_report", section: "Reports", keywords: ["inactive", "user"] },
  { title: "Business Report", path: "/report/buisness-report", section: "Reports", keywords: ["business"] },
  { title: "UPI History Report", path: "/report/upi-report", section: "Reports", keywords: ["upi", "history"] },
  { title: "AEPS Report", path: "/report/apes-report", section: "Reports", keywords: ["aeps", "apes", "pending"] },
  { title: "Settlement Report", path: "/report/settlement-report", section: "Reports", keywords: ["settlement"] },
  { title: "Mpos/Micro Atm Report", path: "/report/mos-matm-report", section: "Reports", keywords: ["mpos", "micro atm", "matm"] },
  { title: "Add Vendor", path: "/vendor/", section: "Vendor", keywords: ["vendor"] },
  { title: "Amount Filter", path: "/amount-filter/", section: "Filter", keywords: ["amount", "filter"] },
  { title: "Circle Roffer Filter", path: "/circle-filter/", section: "Filter", keywords: ["circle", "roffer", "filter"] },
  { title: "User Wise Filter", path: "/user-filter/", section: "Filter", keywords: ["user", "filter"] },
  { title: "ROffer Filter", path: "/roffer-filter/", section: "Filter", keywords: ["roffer", "filter"] },
  { title: "Service", path: "/service", section: "Service", keywords: ["service", "toggle"] },
  { title: "Risk Manage", path: "/service/default-risk", section: "Service", keywords: ["risk"] },
  { title: "Support Tickets", path: "/support-ticket", section: "Support", keywords: ["support", "ticket", "help"] },
  { title: "Server Logs", path: "/logs/", section: "System", keywords: ["logs", "server"] },
  { title: "My Profile", path: "/profile", section: "Account", keywords: ["profile", "account"] },
  { title: "Settings", path: "/settings", section: "Account", keywords: ["settings"] },
];

const normalize = (value: string) => value.toLowerCase().trim();

export const searchGlobalItems = (query: string, limit = 8): GlobalSearchItem[] => {
  const term = normalize(query);
  if (!term) return [];

  return globalSearchItems
    .map((item) => {
      const haystack = normalize(
        [item.title, item.section, item.path, ...item.keywords].join(" ")
      );
      const titleMatch = normalize(item.title).includes(term);
      const sectionMatch = normalize(item.section).includes(term);
      const keywordMatch = item.keywords.some((keyword) =>
        normalize(keyword).includes(term)
      );
      const pathMatch = normalize(item.path).includes(term);
      const fullMatch = haystack.includes(term);

      let score = 0;
      if (normalize(item.title) === term) score += 100;
      if (normalize(item.title).startsWith(term)) score += 50;
      if (titleMatch) score += 30;
      if (keywordMatch) score += 20;
      if (sectionMatch) score += 10;
      if (pathMatch) score += 8;
      if (fullMatch) score += 5;

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
};
