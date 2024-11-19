import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu } from "antd";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";
import Logo from "../../images/logo/logo.png";
import GridViewIcon from "@mui/icons-material/GridView";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SimCardOutlinedIcon from "@mui/icons-material/SimCardOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import MoveUpOutlinedIcon from "@mui/icons-material/MoveUpOutlined";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { BsBank } from "react-icons/bs";
import { SecurityOutlined } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import api from "../../Services/Axios/api";
import Loader from "../Loader/Loader";
const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

// Helper function to create menu items
function getItem(
  label: React.ReactNode,
  key: React.Key,
  path: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: (
      <Link style={{ fontSize: 16 }} to={path}>
        {label}
      </Link>
    ),
    path,
  } as MenuItem;
}

const userPermissions = {
  dashboard: true,
  users: {
    createUser: true,
    userList: true,
  },
  manage: {
    category: true,
    operators: true,
    funds: true,
    fundTransfer: true,
    commission: true,
    api: true,
    createApi: true,
    smsTemplates: true,
    bank: true,
    adminBank: true,
    bankMode: true,
    fundRequest: true,
    userSettlement: true,
    createRoles: true,
  },
  reports: {
    ledger: true,
    partyDue: true,
    virtualBalanceReport: true,
    lappuStatusReport: true,
    rechargeReport: true,
    moneyReport: true,
    mabReport: true,
    userInactiveReport: true,
    businessReport: true,
    upiHistoryReport: true,
    apesReport: true,
    settlementReport: true,
  },
  vendor: {
    addVendor: true,
  },
  filter: {
    amountFilter: true,
    circleRofferFilter: true,
    userWiseFilter: true,
  },
  service: {
    service: true,
    riskManage: true,
  },
  supportTickets: true,
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [userPermissions, setUserPermissions] = useState([]);
  const token = localStorage.getItem("token");
  debugger;
  const decoded = jwtDecode(token);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getRole() {
      setIsLoading(true);
      try {
        const role = await api.get(`/permissions/getrole/${decoded.role}`);
        setUserPermissions(JSON.parse(role.data.Role.permissions));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getRole();
  }, [decoded.role]);

  const items = [
    getItem(
      "Dashboard",
      "1",
      "/chart",
      <GridViewIcon style={{ fontSize: 18 }} />
    ),
    getItem(
      "Users",
      "sub1",
      "",
      <AccountCircleOutlinedIcon style={{ fontSize: 18 }} />,
      [
        userPermissions?.users?.createUser &&
          getItem(
            "Create User",
            "3",
            "/users/",
            <PersonAddAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.users?.userList &&
          getItem(
            "User List",
            "4",
            "/users/userlist",
            <ListAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
      ].filter(Boolean)
    ),
    getItem(
      "Manage",
      "sub2",
      "",
      <ManageHistoryOutlinedIcon style={{ fontSize: 18 }} />,
      [
        userPermissions?.manage?.category &&
          getItem(
            "Category",
            "5",
            "/manage/category",
            <CategoryOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.operators &&
          getItem(
            "Operators",
            "6",
            "/manage/oprators",
            <SimCardOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.funds &&
          getItem(
            "Funds",
            "7",
            "/manage/fund",
            <CurrencyRupeeOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.fundTransfer &&
          getItem(
            "Fund Transfer",
            "8",
            "/manage/fund-transfer",
            <MoveUpOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.commission &&
          getItem(
            "Commission",
            "9",
            "/manage/commission",
            <ConnectWithoutContactOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.api &&
          getItem(
            "API",
            "11",
            "/manage/api",
            <DisplaySettingsOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.createApi &&
          getItem(
            "Create API",
            "12",
            "/manage/create-api",
            <DisplaySettingsOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.smsTemplates &&
          getItem(
            "SMS Templates",
            "13",
            "/manage/template",
            <SmsOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.bank &&
          getItem(
            "Bank",
            "14",
            "/manage/bank",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.adminBank &&
          getItem(
            "Admin Bank",
            "27",
            "/manage/admin-bank",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.bankMode &&
          getItem(
            "Bank Mode",
            "28",
            "/manage/bank-mode",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.fundRequest &&
          getItem(
            "Fund Request",
            "34",
            "/manage/fund-request",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.userSettlement &&
          getItem(
            "User Settlement",
            "49",
            "/manage/user-bank",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.manage?.createRoles &&
          getItem(
            "Create Roles",
            "50",
            "/manage/roles",
            <SecurityOutlined style={{ fontSize: 18 }} />
          ),
      ].filter(Boolean)
    ),
    getItem(
      "Reports",
      "14",
      "",
      <AssessmentOutlinedIcon style={{ fontSize: 18 }} />,
      [
        userPermissions?.reports?.ledger &&
          getItem(
            "Ledger",
            "15",
            "/report/transaction",
            <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.partyDue &&
          getItem(
            "Party Due",
            "20",
            "/report/credit",
            <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.virtualBalanceReport &&
          getItem(
            "Virtual Balance Report",
            "21",
            "/report/virtual",
            <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.lappuStatusReport &&
          getItem(
            "Lappu Status Report",
            "22",
            "/report/lappu-ledger",
            <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.lappuStatusReport &&
          getItem(
            "Lappu History Report",
            "35",
            "/report/lappu-history",
            <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.rechargeReport &&
          getItem(
            "Recharge Report",
            "23",
            "/report/recharge-report",
            <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.moneyReport &&
          getItem(
            "Money Report",
            "26",
            "/report/money-report",
            <AccountBalanceWalletOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.mabReport &&
          getItem(
            "MAB Report",
            "29",
            "/report/mab-report",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.userInactiveReport &&
          getItem(
            "User Inactive Report",
            "30",
            "/report/user_ractive_report",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.businessReport &&
          getItem(
            "Business Report",
            "31",
            "/report/buisness-report",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.upiHistoryReport &&
          getItem(
            "UPI History Report",
            "32",
            "/report/upi-report",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.apesReport &&
          getItem(
            "APES Report",
            "33",
            "/report/apes-report",
            <BsBank style={{ fontSize: 18 }} />
          ),
        userPermissions?.reports?.settlementReport &&
          getItem(
            "Settlement Report",
            "34",
            "/report/settlement-report",
            <BsBank style={{ fontSize: 18 }} />
          ),
      ].filter(Boolean)
    ),
    getItem(
      "Vendor",
      "sub4",
      "",
      <AccountCircleOutlinedIcon style={{ fontSize: 18 }} />,
      [
        userPermissions?.vendor?.addVendor &&
          getItem(
            "Add Vendor",
            "16",
            "/vendor/",
            <PersonAddAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
      ].filter(Boolean)
    ),
    getItem(
      "Filter",
      "sub5",
      "",
      <AccountCircleOutlinedIcon style={{ fontSize: 18 }} />,
      [
        userPermissions?.filter?.amountFilter &&
          getItem(
            "Amount Filter",
            "17",
            "/amount-filter/",
            <PersonAddAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.filter?.circleRofferFilter &&
          getItem(
            "Circle Roffer Filter",
            "18",
            "/circle-filter/",
            <PersonAddAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.filter?.userWiseFilter &&
          getItem(
            "User Wise Filter",
            "19",
            "/user-filter/",
            <PersonAddAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
      ].filter(Boolean)
    ),
    getItem(
      "Service",
      "sub6",
      "",
      <AccountCircleOutlinedIcon style={{ fontSize: 18 }} />,
      [
        userPermissions?.service?.service &&
          getItem(
            "Service",
            "24",
            "/service",
            <PersonAddAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
        userPermissions?.service?.riskManage &&
          getItem(
            "Risk Manage",
            "25",
            "/service/default-risk",
            <PersonAddAltOutlinedIcon style={{ fontSize: 18 }} />
          ),
      ].filter(Boolean)
    ),
    getItem(
      "Support Tickets",
      "25",
      "/support-ticket",
      <PersonAddAltOutlinedIcon style={{ fontSize: 19 }} />
    ),
  ];

  const pathToKey: { [key: string]: string } = items.reduce(
    (acc, item) => {
      acc[item.path] = item.key;
      if (item.children) {
        item.children.forEach((child) => {
          acc[child.path] = child.key;
        });
      }
      return acc;
    },
    {} as { [key: string]: string }
  );

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#6d44e5", colorBgTextHover: "#6d44e5" },
      }}
    >
      <Layout>
        <Sider
          style={{ minHeight: "100vh" }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="flex justify-center">
            <NavLink to="/">
              <img
                src={Logo}
                alt="Logo"
                className={`${collapsed ? "h-20" : "h-30 "}w-30"`}
              />
            </NavLink>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathToKey[location.pathname]]}
            items={items}
          />
        </Sider>
      </Layout>
    </ConfigProvider>
  );
};

export default Sidebar;
