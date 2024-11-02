import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import Chart from "./pages/Chart";
import FormElements from "./pages/Form/FormElements";
import FormLayout from "./pages/Form/FormLayout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Tables from "./pages/Tables";
import Alerts from "./pages/UiElements/Alerts";
import Buttons from "./pages/UiElements/Buttons";
import AddUser from "./pages/AddUser/AddUser";
import UserList from "./pages/UserList/UserList";
import KycPage from "./pages/KYC/KycPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KycList from "./pages/KYC/KycList";
import Login from "./pages/Login/Login";
import ManageCategory from "./pages/Manage/ManageCategory/ManageCategory";
import ManageOprators from "./pages/Manage/ManageOprators/ManageOprators";
import ManageFund from "./pages/Manage/ManageFund/ManageFunds";
import ManageFundTransfer from "./pages/Manage/FundTransfer/FundTransfer";
import Commission from "./pages/Manage/Commission/Commission";
import Api from "./pages/Manage/Api/Api";
import SmsTemplate from "./pages/SmsTemplate/SmsTemplate";
import Reports from "./pages/Reports/Reports";
import CreateApi from "./pages/Manage/Api/CreateApi";
import AddVendor from "./pages/Vendor/AddVendor/AddVendor";
import AmountFilter from "./pages/Filter/Amount";
import CircleFilter from "./pages/Filter/Circle";
import UserWiseFilter from "./pages/Filter/UserWise";
import Service from "./pages/Service/Service";
import DefaultRisk from "./pages/RiskManage/DefaultRisk";
import RofferFilter from "./pages/Filter/ROffer";
import ManageBank from "./pages/Manage/Bank/ManageBank";
import ManageFundRequest from "./pages/Manage/Bank/FundRequest";

import "./styles.css";

import AdminBank from "./pages/Manage/Bank/AdminBank";
import Mode from "./pages/Manage/Bank/Mode";
import UserBank from "./pages/Manage/Bank/UserBank";
import SupportTicket from "./pages/Support/SupportTickets";
import TicketInfo from "./pages/Support/TicketInfo";
import UserPermissions from "./pages/UserPermissions/UserPermissions";
import Permissions from "./pages/UserPermissions/Permissions";
import EditUserPermissions from "./pages/UserPermissions/EditRole";

const queryClient = new QueryClient();
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            index
            element={
              <>
                <PageTitle title="Dashboard | " />
                <Login />
              </>
            }
          />

          <Route
            path="/users/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<AddUser />} />
                  <Route path="/userlist" element={<UserList />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/kyc/:userid" element={<KycPage />} />
                  <Route path="/usersKyclist/:userid" element={<KycList />} />
                  <Route path="/ui/buttons" element={<Buttons />} />
                </Routes>
              </>
            }
          />

          <Route
            path="/manage/*"
            element={
              <>
                <Routes>
                  <Route path="/category" element={<ManageCategory />} />
                  <Route path="/oprators" element={<ManageOprators />} />
                  <Route path="/fund" element={<ManageFund />} />
                  <Route
                    path="/fund-transfer"
                    element={<ManageFundTransfer />}
                  />
                  <Route path="/commission" element={<Commission />} />
                  <Route path="/api" element={<Api />} />
                  <Route path="/create-api" element={<CreateApi />} />
                  <Route path="/template" element={<SmsTemplate />} />
                  <Route path="/bank" element={<ManageBank />} />
                  <Route path="/admin-bank" element={<AdminBank />} />
                  <Route path="/bank-mode" element={<Mode />} />
                  <Route path="/fund-request" element={<ManageFundRequest />} />
                  <Route path="/user-bank" element={<UserBank />} />
                  <Route path="/roles" element={<Permissions />} />
                  <Route path="/create-role" element={<UserPermissions />} />
                  <Route path="/edit-role/:id" element={<EditUserPermissions />} />



                </Routes>
              </>
            }
          />

          <Route
            path="/report/*"
            element={
              <>
                <Routes>
                  <Route
                    path="/transaction"
                    element={
                      <Reports entity={"Transaction"} report_id={"1_3"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/credit"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_1"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/virtual"
                    element={
                      <Reports entity={"Transaction"} report_id={"1_2"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/lappu-ledger"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_2"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/recharge-report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_4"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/money-report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_5"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/mab-report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_6"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/user_ractive_report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_7"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/buisness-report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_8"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/upi-report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_9"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/apes-report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_10"} />
                    }
                  />
                </Routes>
                <Routes>
                  <Route
                    path="/settlement-report"
                    element={
                      <Reports entity={"Transaction"} report_id={"2_14"} />
                    }
                  />
                </Routes>
              </>
            }
          />

          <Route
            path="/vendor/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<AddVendor />} />
                </Routes>
              </>
            }
          />
          <Route
            path="/amount-filter/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<AmountFilter />} />
                </Routes>
              </>
            }
          />
          <Route
            path="/user-filter/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<UserWiseFilter />} />
                </Routes>
              </>
            }
          />
          <Route
            path="/circle-filter/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<CircleFilter />} />
                </Routes>
              </>
            }
          />
          <Route
            path="/roffer-filter/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<RofferFilter />} />
                </Routes>
              </>
            }
          />
          <Route
            path="/service/*"
            element={
              <>
                <Routes>
                  <Route path="/" element={<Service />} />
                  <Route path="/default-risk" element={<DefaultRisk />} />
                </Routes>
              </>
            }
          />

          <Route
            path="/support-ticket"
            element={
              <>
                <PageTitle title="support-ticket" />
                <SupportTicket />
              </>
            }
          />

          <Route
            path="/ticketinfo/:id"
            element={
              <>
                <PageTitle title="ticket-info" />
                <TicketInfo />
              </>
            }
          />

          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Profile />
              </>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormElements />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Tables />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Settings />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Dashboard " />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Login " />
                <Login />
              </>
            }
          />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
