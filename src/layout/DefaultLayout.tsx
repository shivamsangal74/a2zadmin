import React, { useState, ReactNode, useRef } from "react";
import Header from "../components/Header/index";
import Sidebar from "../components/Sidebar/index";
import { IdleTimerProvider } from "react-idle-timer";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DefaultLayout: React.FC<{ children: ReactNode; isList: Boolean }> = ({
  children,
  isList = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const idleTimer = useRef(null);
  const navigate = useNavigate();
  const handleOnIdle = () => {
    setIsSessionExpired(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsSessionExpired(false);
  };

  return (
    <IdleTimerProvider
      ref={idleTimer}
      timeout={55 * 60 * 1000}
      onIdle={handleOnIdle}
      debounce={500}
    >
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main>
              <div
                className={`mx-auto max-w-screen-2xl p-4 ${
                  isList ? "md:p-6 2xl:px-5 2xl:py-2" : "md:p-6 2xl:p-5"
                }`}
              >
                {children}
              </div>
            </main>
            {
              <Dialog open={isSessionExpired} handler={handleLogout} size="xs">
                <div className="p-4 sm:p-10 bg-gray-50 rounded-md  text-center overflow-y-auto">
                  <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                    </svg>
                  </span>

                  <h3 className="mb-2 text-2xl font-bold text-gray-800">
                    Signing out
                  </h3>
                  <p className="text-gray-500">
                    Your session has expired . Please login again.
                  </p>

                  <div className="mt-6 flex justify-center gap-x-4">
                    <button
                      className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </Dialog>
            }
          </div>
        </div>
      </div>
    </IdleTimerProvider>
  );
};

export default DefaultLayout;
