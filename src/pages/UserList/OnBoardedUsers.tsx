import { Edit, EditOutlined } from "@mui/icons-material";
import { Tooltip } from "antd";
import React from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import api from "../../Services/Axios/api";
import { toast } from "react-toastify";
import BasicTable from "../../components/BasicTable/BasicTable";
import Loader from "../../components/Loader/Loader";
import { formatDate } from "../../Utills/Utility";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Popup from "../../components/Model/Model";
import { getUsers } from "../../Services/Axios/UserService";
import { DropSearch } from "../../components/DropDown/DropSearch";
import { ButtonLabel } from "../../components/Button/Button";
import TextInput from "../../components/Input/TextInput";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
export const OnBoardedUsers = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState({});
 
  
  const formatDateToISO = (utcDateString:string) => {
    const utcDate = new Date(utcDateString);
  const localDate = new Date(utcDate.getTime() + 330 * 60000);
  return localDate.toISOString().replace("Z", "").replace("T", " ");
  };
  
  
  const onEdit = async () => {
    try {
      const id = rowData.id; // Store the ID before modifying rowData
      const updatedData = { ...rowData }; // Create a copy of rowData
      delete updatedData.id; // Remove the ID from the copy
  
      const resp = await api.post("/mpos/update-mpos-user", {
        id: id, // Use the original ID here
        data: updatedData, // Send the updated data
      });
  
      if (resp.status === 200) {
        toast.success("User updated successfully!");
        refetch()
        setIsOpen(false)
        // Optionally refetch data or update state here
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(message);
    }
  };
  

  const onClose = () => setIsOpen(false);
  const onRowClick = (row: any) => {
    console.log(row);
    setRowData(row);
    setIsOpen(true);
  };
  const columns = [
    {
      header: "User ID",
      accessorKey: "userid",
    },
    {
      header: "TID",
      accessorKey: "tid",
    },
    {
      header: "CP ID",
      accessorKey: "cpId",
    },
    {
      header: "Login ID",
      accessorKey: "login_id",
    },
    {
      header: "password",
      accessorKey: "password",
    },
    {
      header: "Merchant Status",
      accessorKey: "merchant_status",
    },
    {
      header: "Terminal Status",
      accessorKey: "terminal_status",
    },
    {
      header: "Date",
      accessorKey: "createdDate",
      cell: (row: any) => {
        console.log(row.row);
        return formatDateToISO(row.row.original.createdDate);
      }
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-1 items-center justify-center">
          <Tooltip title="View/Edit">
            <div onClick={() => onRowClick(row.row.original)}>
              <Edit />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  const { isLoading, error, data,refetch } = useQuery({
    queryKey: ["allonboardedusers"],
    queryFn: async () => {
      try {
        const response = await api.get("/apes/allonboardedusers");
        const userData = response.data;
        return userData;
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    },
    refetchOnWindowFocus: true,
  });

  const {
    isLoading: userIsLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await getUsers();
        const userData = response.users;
        let _data: any[] = [];
        if (userData.length > 0) {
          userData.forEach((user: any) => {
            _data.push({
              showvalue:
                user?.userUniqueId +
                " " +
                user?.fullName +
                "(" +
                user.phoneNumber +
                ")",
              value: user?.userUniqueId,
            });
          });
        }
        console.log("userData", userData);
        console.log(_data);
        return _data;
      } catch (error) {
        toast.error("something went wrong!");
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleChange = (name: any, value: string | null) => {
    if (name !== null) {
      setRowData({ ...rowData, [name]: value });
    }
  };
  console.log(rowData);

  return (
    <DefaultLayout isList={false}>
      <Breadcrumb pageName="Credopay Users List" />
      {isLoading && <Loader />}
     
      {data && data.length > 0 ? (
        <BasicTable data={data} columns={columns} filter={[]} />
      ) : (
        <p>No Records Found</p>
      )}

      {
        <Popup title={"Edit Details"} isOpen={isOpen} onClose={onClose}>
          {userData && (
            <DropSearch
              placeholder="Select User"
              value={rowData.userid}
              options={[...userData]}
              required={true}
              name="userId"
              isLoading={userIsLoading}
              onchange={(value: string | null) => handleChange("userid", value)}
            />
          )}

          <TextInput
          style={{ marginTop: "10px" }}
            name={"Password"}
            placeholder="Enter user Password"
            label="Password"
            value={rowData.password}
            onChange={(e) => handleChange("password", e)}
            isModel={true}
          />
           <TextInput
          style={{ marginTop: "10px" }}
            name={"CPID"}
            placeholder="Enter CPID"
            label="CPID"
            value={rowData.cpId}
            onChange={(e) => handleChange("cpId", e)}
            isModel={true}
          />

          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center mt-3 md:space-x-3 flex-shrink-0">
            <ButtonLabel
              onClick={() => onEdit()}
              type="button"
              label="Edit Details"
              Icon={<EditOutlined />}
            />
          </div>
        </Popup>
      }
    </DefaultLayout>
  );
};
