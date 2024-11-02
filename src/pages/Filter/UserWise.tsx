import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import Popup from "../../components/Model/Model";
import TextInput from "../../components/Input/TextInput";
import { ButtonLabel } from "../../components/Button/Button";
import { getAllOperators } from "../../Services/categoryServices";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import { Select, Option } from "@material-tailwind/react";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import Switch from "@mui/material/Switch";
import { apiUrl } from "../../Utills/constantt";
import { BsPencil, BsTrash } from "react-icons/bs";
import { getUser, getUsers } from "../../Services/Axios/UserService";
import { getAllApi } from "../../Services/ApiService";
import {
  deletefilter,
  getAllFilterById,
  getAllFilterByType,
  saveFilter,
  updatefilter,
} from "../../Services/filterService";
const UserWiseFilter = () => {
  const columns = [
    {
      header: "Filter Type",
      accessorKey: "filterType",
    },
    {
      header: "Operator",
      accessorKey: "operator",
      cell: (row: any) => (
        <span className="h-6 w-6 rounded-full">
          <img
            crossOrigin="anonymous"
            className="rounded-full"
            height={40}
            width={40}
            src={`${apiUrl}/uploads/operatorimages/${row.row.original.operatorImage}`}
            alt="User"
          />
        </span>
      ),
    },
    {
      header: "user",
      accessorKey: "fullName",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <Switch
          checked={row.row.original.status == "1"}
          onChange={async (e) => {
            const newValue = e.target.checked ? "1" : "0";
            try {
              await updatefilter({ status: newValue }, row.row.original.id);
              toast.success("Filter updated successfully.");
              refetch();
            } catch (error) {
              toast.error("Something went wrong.");
            }
          }}
          inputProps={{ "aria-label": "status switch" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: row.row.original.status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor: row.row.original.status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-track": {
              backgroundColor: row.row.original.status == "1" ? "green" : "red",
            },
          }}
        />
      ),
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-2">
          <div className="cursor-pointer">
            <BsPencil
              fontSize={18}
              color="blue"
              onClick={() => handleOpenEdit(row.row.original.id)}
            />
          </div>
          <div className="cursor-pointer" title="Delete Filter">
            <BsTrash
              fontSize={18}
              color="red"
              onClick={() => {
                setShowModal(true);
                setDeleteId(row.row.original.id);
              }}
            />
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p>
                  <b>Are you sure you want to delete this filter?</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowModal(false);
                      handleDeleteFilter(deleteId);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [userId, setUserId] = useState("");
  const [filterId, setFilterId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [status, setStatus] = useState("1");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [filter, setFilter] = useState<any[] | null>(null);
  const [filterType, setFilterType] = useState("commontype");
  const [users, setUsers] = useState<any[] | null>(null);
  const [operator, setOperator] = useState<any[] | null>(null);
  const [openError, setOpenError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  const [checktype, setCheckType] = useState("normal");

  async function handleAddCategory() {
    const emptyFields = [];
    setLoading(true);
    if (!userId) emptyFields.push("user");
    if (!selectedOperator) emptyFields.push("operator");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }
    const data = {
      status: status == "true" ? 1 : 0,
      operator: selectedOperator,
      userId: userId,
      filterType: filterType,
      checktype: checktype,
      type: "userwise",
    };

    try {
      await saveFilter(data);
      toast.success("Filter added successfully.");
      refetch();
      closePopup();
      reset();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteFilter(id: string) {
    try {
      setLoading(true);
      await deletefilter(id);
      refetch();
      toast.success("Filter Successfully deleted.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  }

  const handleClose = () => {
    closePopup();
    reset();
  };

  const handleUser = (event: any) => {
    setUserId(event);
  };

  const handleStatus = (event: any) => {
    setStatus(event);
  };

  const handleOperator = (event: any) => {
    setSelectedOperator(event);
  };

  const handleCheckType = (event: any) => {
    setCheckType(event);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      setFilterId(id);
      let _data = await getAllFilterById(id);
      setIsEdit(true);
      if (_data.filterData.length > 0) {
        setStatus(_data.filterData[0].status.toString());
        setSelectedOperator(_data.filterData[0].operator);
        setUserId(_data.filterData[0].userId);
        setCheckType(_data.filterData[0].checktype);
        setFilterType(_data.filterData[0].filterType);
      }
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };
  async function handleEditCategory() {
    setLoading(true);
    const data = {
      status: status == "true" ? 1 : 0,
      operator: selectedOperator,
      userId: userId,
      filterType: filterType,
      checktype: checktype,
      id: filterId,
    };

    try {
      await saveFilter(data);
      toast.success("filter updated successfully.");
      refetch();
      closePopup();
      reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
  }
  async function reset() {
    setIsEdit(false);
    setStatus("1");
    setSelectedOperator("");
    setUserId("");
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      try {
        const response = await getAllOperators();
        const _filter = await getAllFilterByType("userwise");
        if (_filter.filterData) {
          setFilter(_filter.filterData);
        }
        const userData = await getUsers();

        if (userData.users.length > 0) {
          setUsers(userData.users);
        }
        const operatorData = response.operators;
        if (operatorData.length > 0) {
          const uniqueOperatorCodes = new Set();
          operatorData.forEach((operator: any) => {
            if (operator.status === "ON") {
              uniqueOperatorCodes.add(operator.operatorCode);
            }
          });
          const uniqueOperators = Array.from(uniqueOperatorCodes).map(
            (operatorCode) => {
              return operatorData.find(
                (operator: any) => operator.operatorCode === operatorCode
              );
            }
          );
          setOperator(uniqueOperators);
        }
        return operatorData;
      } catch (error) {
        setOpenError(true);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });
  if (isLoading)
    return (
      <DefaultLayout isList>
        <Loader />
      </DefaultLayout>
    );
  if (error) {
    return toast.error("Something went wrong!");
  }

  return (
    <DefaultLayout isList={true}>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-2">
        <div className="w-full md:w-1/2"></div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <ButtonLabel
            onClick={openPopup}
            type="button"
            label="Add UserWise Filter"
            Icon={<BsPlus fontSize={18} />}
          />
        </div>
      </div>

      {filter && (
        <BasicTable
          data={filter}
          columns={columns}
          actions={""}
          filter={["status"]}
        />
      )}

      <Popup
        title={isEdit ? "Edit UserWise Filter" : "Add UserWise Filter"}
        isOpen={isOpen}
        onClose={closePopup}
      >
        <div className="">
          <div className="mb-6">
            <Select label="Select User" onChange={handleUser} value={userId}>
              {users?.map((user: any, index: any) => (
                <Option key={index} value={user.userUniqueId}>
                  {user?.userUniqueId +
                    " " +
                    user?.fullName +
                    "(" +
                    user.phoneNumber +
                    ")"}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <Select
              label="Select Condition"
              onChange={handleCheckType}
              value={checktype}
            >
              <Option value="condition">Condition</Option>
              <Option value="normal">Normal</Option>
            </Select>
          </div>
          <div className="mb-6">
            <Select
              label="Select Operator"
              onChange={handleOperator}
              value={selectedOperator}
            >
              {operator?.map((op: any, index: any) => (
                <Option key={index} value={op.id}>
                  {op.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <Select
              label="Select Status"
              onChange={handleStatus}
              value={status}
            >
              <Option value="true">ON</Option>
              <Option value="false">OFF</Option>
            </Select>
          </div>
          <div className="flex justify-between mt-10">
            {isEdit ? (
              <ButtonLabel
                onClick={handleEditCategory}
                label="Edit UserWise Filter"
              />
            ) : (
              <ButtonLabel
                onClick={handleAddCategory}
                label="Add Userwise Filter"
              />
            )}
            <ButtonLabel
              style={{ backgroundColor: "red" }}
              onClick={handleClose}
              label="Close"
            />
          </div>
        </div>
      </Popup>
    </DefaultLayout>
  );
};

export default UserWiseFilter;
