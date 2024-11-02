import { useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useNavigate } from "react-router-dom";
import {
  getUser,
  getUsers,
  getautoFillData,
  saveautoFillData,
} from "../../Services/Axios/UserService";
import Switch from "@mui/material/Switch";
import { BsEye, BsPlusLg, BsThunderbolt } from "react-icons/bs";
import BasicTable from "../../components/BasicTable/BasicTable";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import { Alert } from "@material-tailwind/react";
import EditUser from "../EditPage/EditUser";
import { ButtonLabel } from "../../components/Button/Button";
import LockResetIcon from "@mui/icons-material/LockReset";
import Popup from "../../components/Model/Model";
import TextInput from "../../components/Input/TextInput";
import api from "../../Services/Axios/api";
import { apiUrl } from "../../Utills/constantt";
import { toast } from "react-toastify";
import { FaAccessibleIcon } from "react-icons/fa6";
import { EditCalendarOutlined, ThunderstormTwoTone } from "@mui/icons-material";
import { Tooltip } from "antd";
const UserList = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [openError, setOpenError] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userid, setUserId] = useState("");
  const [openChangePass, setOpenChangePass] = useState(false);
  const [openAutofill, setOpenAutoFill] = useState(false);
  const [miniBalance, setMiniBalance] = useState("");
  const [rifillAmount, setRifillAmount] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [status, setStatus] = useState("ON");
  const [newPassword, setNewPass] = useState("");

  const columns = [
    {
      header: "ID",
      accessorKey: "userUniqueId",
    },
    {
      header: "Name",
      accessorKey: "fullName",
    },
    {
      header: "Sponsor ID",
      accessorKey: "sponsorId",
    },
    {
      header: "Wallet Balance",
      accessorKey: "wallet",
    },
    {
      header: "Mobile No",
      accessorKey: "phoneNumber",
    },
    {
      header: "Type",
      accessorKey: "userType",
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-1 items-center justify-center">
          <Tooltip title="View/Edit">
            <div>
              <BsEye
                fontSize={18}
                onClick={() => handleUserEdit(row.row.original.userUniqueId)}
              />
            </div>
          </Tooltip>
          <Tooltip title="Change Password">
            <div>
              <LockResetIcon
                onClick={() =>
                  handleUserChangePass(row.row.original.userUniqueId)
                }
              />{" "}
            </div>
          </Tooltip>
          <Tooltip title="Autofill">
            <div>
              <EditCalendarOutlined
                onClick={() => handleAutoFill(row.row.original.userUniqueId)}
              />{" "}
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  function handleUserEdit(userid: string) {
    setOpenEdit(true);
    setUserId(userid);
  }

  async function handleAutoFill(userid: string) {
    setUserId(userid);
    setMiniBalance("");
    setCreditLimit("");
    setRifillAmount("");
    try {
      const data = await getautoFillData(userid);

      if (data?.user?.userId) {
        setMiniBalance(data.user.miniBalance);
        setCreditLimit(data.user.creditLimit);
        setStatus(data.user.status);
        setRifillAmount(data.user.rifillAmount);
        setOpenAutoFill(true);
      }
      setOpenAutoFill(true);
    } catch (e) {
      setOpenAutoFill(true);
    }
  }
  async function createAutoFill() {
    try {
      await saveautoFillData({
        userId: userid,
        miniBalance,
        status,
        creditLimit,
        rifillAmount,
      });
      toast.success("Auto Fill Save Successfully.");
      setUserId("");
      setMiniBalance("");
      setCreditLimit("");
      setRifillAmount("");
      setOpenAutoFill(false);
    } catch (error) {
      toast.error("Unable to save.");
    }
  }

  function handleUserChangePass(userid: string) {
    setOpenChangePass(true);
    setUserId(userid);
  }

  async function handlePassWordChange() {
    try {
      await api.post(`${apiUrl}/users/change-password`, {
        userid,
        newpassword: newPassword,
      });
      toast.success("Password change successfully.");
      setNewPass("");
      setOpenChangePass(false);
    } catch (error) {
      toast.error("Unable to change password successfully.");
    }
  }

  const { isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getUsers();
        const userData = response.users;
        if (userData.length > 0) {
          setUserData(userData); // Update state with user data
        }
        return userData; // Return user data from the query function
      } catch (error) {
        setOpenError(true);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });
  // useEffect(() => {
  //   async function getUsersData() {
  //     try {
  //       const data = await getUser();
  //       if (data.users.length > 0) {
  //         const newUser = data.users.map((user: any) => ({
  //           name: user.fullName,
  //           addharno: user.aadharNo,
  //           phoneNumber: user.phoneNumber,
  //           city: user.city,
  //           dob: user.dob,
  //           id: user.userUniqueId,
  //         }));
  //         setUserData(newUser);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   getUsersData();
  // }, []);
  if (isLoading) return <Loader />;
  if (error) {
    return (
      <>
        <Alert
          color="red"
          open={openError}
          onClose={() => setOpenError(false)}
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
        >
          {(error as any)?.message || (error as any)?.response?.data?.error}
        </Alert>
        <div className="mt-4 mb-8 flex flex-col gap-12"></div>
      </>
    );
  }
  return (
    <>
      <DefaultLayout isList={true}>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-2">
          <div className="w-full md:w-1/2"></div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <ButtonLabel
              onClick={() => navigate("/users")}
              label="Add New User"
              Icon={<BsPlusLg fontSize={16} />}
            />
            {/* <button
            onClick={() => navigate("/users")}
            type="button"
            className="inline-flex items-center rounded-lg justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 xl:px-3"
          >
            <svg
              className="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            
          </button> */}
          </div>
        </div>

        {userData.length > 0 ? (
          <BasicTable
            data={userData}
            columns={columns}
            filter={["sponsorId", "phoneNumber", "userType"]}
          />
        ) : (
          <p>No Records Found</p>
        )}
      </DefaultLayout>
      {openEdit && <EditUser setOpen={setOpenEdit} userid={userid} />}
      {openChangePass && (
        <Popup
          title="Change Password"
          isOpen={openChangePass}
          onClose={() => setOpenChangePass(false)}
        >
          <div className="">
            <TextInput
              name="UserId"
              label="UserId"
              disabledProp={true}
              value={userid}
            />

            <TextInput
              name="NewPassword"
              label="NewPassword"
              onChange={setNewPass}
              style={{ marginTop: 10 }}
            />
          </div>

          <div className="flex justify-between mt-10">
            <ButtonLabel
              onClick={() => handlePassWordChange()}
              label="Update"
            />
          </div>
        </Popup>
      )}

      {openAutofill && (
        <Popup
          title={"Auto fill for   -" + userid}
          isOpen={openAutofill}
          onClose={() => setOpenAutoFill(false)}
        >
          <div className="">
            <TextInput
              name="Min Balance"
              label="Min Balance"
              value={miniBalance}
              onChange={setMiniBalance}
              style={{ marginTop: 10 }}
            />
            <TextInput
              name="Credit Limit"
              label="Credit Limit"
              value={creditLimit}
              onChange={setCreditLimit}
              style={{ marginTop: 10 }}
            />
            <TextInput
              name="Refill Amount"
              label="Refill Amount"
              value={rifillAmount}
              onChange={setRifillAmount}
              style={{ marginTop: 10 }}
            />
            <Switch
              checked={status === "ON"}
              onChange={async (e) => {
                const newValue = e.target.checked ? "ON" : "OFF";
                setStatus(newValue);
              }}
              inputProps={{ "aria-label": "status switch" }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: status === "ON" ? "green" : "red",
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: status === "ON" ? "green" : "red",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: status === "ON" ? "green" : "red",
                },
              }}
            />
          </div>

          <div className="flex justify-between mt-10">
            <ButtonLabel onClick={() => createAutoFill()} label="Save" />
          </div>
        </Popup>
      )}
    </>
  );
};

export default UserList;
