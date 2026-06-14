import { Link } from "react-router-dom";
import DropdownUser from "./DropdownUser";
import LogoIcon from "../../images/logo/logo-icon.svg";
import DarkModeSwitcher from "./DarkModeSwitcher";
import PendingReportBadges from "./PendingReportBadges";
import HeaderPageTitle from "./HeaderPageTitle";
import GlobalSearch from "./GlobalSearch";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 w-full border-b border-stroke bg-white/95 backdrop-blur-md dark:border-strokedark dark:bg-boxdark/95">
      <div className="flex h-16 items-center gap-3 px-4 md:gap-4 md:px-6 2xl:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4 lg:max-w-[18rem] lg:flex-1">
          <button
            aria-controls="sidebar"
            aria-label="Toggle sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stroke bg-gray text-black transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-primary/40 lg:hidden"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-0 block h-0.5 w-4 rounded-sm bg-current" />
              <span className="absolute left-0 top-1.5 block h-0.5 w-4 rounded-sm bg-current" />
              <span className="absolute left-0 top-3 block h-0.5 w-4 rounded-sm bg-current" />
            </span>
          </button>

          <Link className="flex shrink-0 items-center lg:hidden" to="/chart">
            <img src={LogoIcon} alt="A2ZPay" className="h-9 w-9" />
          </Link>

          <div className="hidden h-8 w-px bg-stroke dark:bg-strokedark sm:block lg:hidden" />

          <HeaderPageTitle />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center px-1 sm:px-2">
          <GlobalSearch />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-stroke bg-whiter p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark-2 sm:gap-2 sm:p-2">
            <PendingReportBadges />

            <div className="hidden h-6 w-px bg-stroke dark:bg-strokedark sm:block" />

            <DarkModeSwitcher />
          </div>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
