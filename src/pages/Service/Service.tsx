import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import Popup from "../../components/Model/Model";
import TextInput from "../../components/Input/TextInput";
import { ButtonLabel } from "../../components/Button/Button";
import { getAllCategorys } from "../../Services/categoryServices";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import { Select, Option } from "@material-tailwind/react";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import Switch from "@mui/material/Switch";
import { apiUrl } from "../../Utills/constantt";
import { BsPencil, BsTrash } from "react-icons/bs";
import { getUser } from "../../Services/Axios/UserService";
import TextField from "@mui/material/TextField";
import {
  deleteService,
  getAllService,
  getAllServiceById,
  saveService,
  updateService,
} from "../../Services/serviceService";
const Service = () => {
  const columns = [
    {
      header: "Service Name",
      accessorKey: "serviceName",
    },
    {
      header: "Charge",
      accessorKey: "charge",
    },
    {
      header: "Monthly Charge",
      accessorKey: "monthlyCharge",
    },
    {
      header: "GST",
      accessorKey: "tax",
    },
    {
      header: "Remarks",
      accessorKey: "description",
    },

    {
      header: "User Type",
      accessorKey: "userType",
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
              await updateService({ status: newValue }, row.row.original.id);
              toast.success("Service updated successfully.");
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
          <div className="cursor-pointer" title="Delete Service">
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
  const [serviceId, setServiceId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [developedBy, setDevelopedBy] = useState("");
  const [selectedWebDeveloper, setSelectedWebDeveloper] = useState("");
  const [selectedWebDeveloperComm, setSelectedWebDeveloperComm] = useState("");
  const [selectedAndroidDeveloper, setSelectedAndroidDeveloper] = useState("");
  const [selectedAndroidDeveloperComm, setSelectedAndroidDeveloperComm] =
    useState("");
  const [serviceName, setServiceName] = useState("");
  const [charge, setCharge] = useState("");
  const [montlyCharge, setMontlyCharge] = useState("");
  const [description, setDescription] = useState("");
  const [tax, setTax] = useState("");
  const [userType, setUserType] = useState("myuser");
  const [users, setUsers] = useState<any[] | null>(null);
  const [operator, setOperator] = useState<any[] | null>(null);
  const [openError, setOpenError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  async function handleAddCategory() {
    const emptyFields = [];
    setLoading(true);
    if (!serviceName) emptyFields.push("Service Name");
    if (!charge) emptyFields.push("Charge");
    if (!montlyCharge) emptyFields.push("Montly Charge");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }
    const data = {
      serviceName: serviceName,
      // parentService: selectedOperator,
      developedUser: developedBy,
      charge: charge,
      monthlyCharge: montlyCharge,
      tax: tax,
      userType: userType,
      webDeveloper: selectedWebDeveloper,
      webDeveloperComm: selectedWebDeveloperComm,
      androidDeveloper: selectedAndroidDeveloper,
      androidDeveloperComm: selectedAndroidDeveloperComm,
      description: description,
    };

    try {
      await saveService(data);
      toast.success("Service added successfully.");
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
      await deleteService(id);
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
  const handleWebDeveloper = (event: any) => {
    setSelectedWebDeveloper(event);
  };

  const handleAndroidDeveloper = (event: any) => {
    setSelectedAndroidDeveloper(event);
  };

  const handleDevelopedBy = (event: any) => {
    setDevelopedBy(event);
  };

  const handleUserType = (event: any) => {
    setUserType(event);
  };
  function handleFileChange(e: any) {
    // setImageFile(e.target.files[0]);
  }

  const handleOperator = (event: any) => {
    setSelectedOperator(event);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      setServiceId(id);
      let _data = await getAllServiceById(id);
      setIsEdit(true);
      if (_data.service.length > 0) {
        setMontlyCharge(_data.service[0].monthlyCharge);
        // setSelectedOperator(_data.service[0].parentService);
        setServiceName(_data.service[0].serviceName);
        setUserType(_data.service[0].userType);
        setDescription(_data.service[0].description);
        setTax(_data.service[0].tax);
        setSelectedAndroidDeveloper(_data.service[0].androidDeveloper);
        setSelectedAndroidDeveloperComm(_data.service[0].androidDeveloperComm);
        setCharge(_data.service[0].charge);
        setDevelopedBy(_data.service[0].developedUser);
        setSelectedWebDeveloper(_data.service[0].webDeveloper);
        setSelectedWebDeveloperComm(_data.service[0].webDeveloperComm);
      }
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };
  async function handleEditCategory() {
    setLoading(true);
    const _data = {
      serviceName: serviceName,
      // parentService: selectedOperator,
      developedUser: developedBy,
      charge: charge,
      monthlyCharge: montlyCharge,
      tax: tax,
      userType: userType,
      webDeveloper: selectedWebDeveloper,
      webDeveloperComm: selectedWebDeveloperComm,
      androidDeveloper: selectedAndroidDeveloper,
      androidDeveloperComm: selectedAndroidDeveloperComm,
      description: description,
    };

    try {
      await updateService(_data, serviceId);
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
    setServiceName("");
    setCharge("");
    setMontlyCharge("");
    setDevelopedBy("");
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      try {
        const response = await getAllService();
        const userData = await getUser();
        if (userData.users.length > 0) {
          setUsers(userData.users);
        }
        const serviceData = response.service;
        if (serviceData.length > 0) {
          setOperator(serviceData);
        }
        return serviceData;
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
            label="Add Service"
            Icon={<BsPlus fontSize={18} />}
          />
        </div>
      </div>
      <BasicTable
        data={data}
        columns={columns}
        actions={""}
        filter={["status"]}
      />

      <Popup
        title={isEdit ? "Edit Service" : "Add Service"}
        isOpen={isOpen}
        onClose={closePopup}
      >
        <div className="">
          {/* <div className="mb-3">
            <Select
              label="Select Parent Service"
              onChange={handleOperator}
              value={selectedOperator}
            >
              {operator?.map((op: any, index: any) => (
                <Option key={index} value={op.serviceName}>
                  {op.serviceName}
                </Option>
              ))}
            </Select>
          </div> */}
          <div className="mb-3">
            <TextInput
              value={serviceName}
              label={"Service Name"}
              name={"Service Name"}
              onChange={setServiceName}
              isModel={false}
            />
          </div>
          <div className="mb-3">
            <Select
              label="Developed By"
              onChange={handleDevelopedBy}
              value={developedBy}
            >
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
          <div className="mb-6 flex gap-3">
            <TextInput
              value={charge}
              label={"Charge"}
              type="number"
              name={"Charge"}
              onChange={setCharge}
              isModel={false}
            />
            <TextInput
              value={montlyCharge}
              label={"Montly Charge"}
              type="number"
              name={"Montly Charge"}
              onChange={setMontlyCharge}
              isModel={false}
            />
          </div>
          <div className="mb-6 flex gap-3">
            <Select
              label="User Type"
              onChange={handleUserType}
              value={userType}
            >
              <Option value="myuser">My User</Option>
              <Option value="apiuser">API User</Option>
            </Select>
            <TextInput
              value={tax}
              label={"GST (%)"}
              name={"GST (%)"}
              type="number"
              onChange={setTax}
              isModel={false}
            />
          </div>
          <div className="mb-6 flex gap-3">
            <Select
              label="Web Developer"
              onChange={handleWebDeveloper}
              value={selectedWebDeveloper}
            >
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
            <TextInput
              value={selectedWebDeveloperComm}
              label={"Web D. Comm"}
              name={"Web D. Comm"}
              type="number"
              onChange={setSelectedWebDeveloperComm}
              isModel={false}
            />
          </div>
          <div className="mb-3 flex gap-3">
            <Select
              label="Android Developer"
              onChange={handleAndroidDeveloper}
              value={selectedAndroidDeveloper}
            >
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
            <TextInput
              value={selectedAndroidDeveloperComm}
              label={"Android Comm"}
              name={"Android Comm"}
              type="number"
              onChange={setSelectedAndroidDeveloperComm}
              isModel={false}
            />
          </div>
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* <div className="mb-6">
            <FileUpload onChange={handleFileChange} />
          </div> */}

          <div className="flex justify-between mt-10">
            {isEdit ? (
              <ButtonLabel onClick={handleEditCategory} label="Edit Service" />
            ) : (
              <ButtonLabel onClick={handleAddCategory} label="Add Service" />
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

export default Service;
