import DefaultLayout from "../../../layout/DefaultLayout";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import TextInput from "../../../components/Input/TextInput";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { ButtonLabel } from "../../../components/Button/Button";
import { Select, Option } from "@material-tailwind/react";
import {
  addFund,
  deleteFund,
  getAllFunds,
  getFund,
  updateFund,
} from "../../../Services/categoryServices";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../common/Loader";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import Switch from "@mui/material/Switch";
import { apiUrl } from "../../../Utills/constantt";
import { BsPencil, BsTrash } from "react-icons/bs";
import DropDownCheakBox from "../../../components/DropDown/DropDownCheakBox";
const ManageFund = () => {
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Fund Image",
      accessorKey: "fundImage",
      cell: (row: any) => (
        <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center" , justifyContent: "center"}}>
          <span className="h-6 w-6 rounded-full">
          <img
            crossOrigin="anonymous"
            className="rounded-full"
            height={40}
            width={40}
            src={`${apiUrl}/uploads/fundimages/${row.row.original.fundImage}`}
            alt="User"
          />
        </span>
        </div>
      ),
    },
    {
      header: "Fund Code",
      accessorKey: "fundCode",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <Switch
          checked={row.row.original.status === "ON"}
          onChange={async (e) => {
            const newValue = e.target.checked ? "ON" : "OFF";
            try {
              await updateFund({ status: newValue }, row.row.original.id);
              toast.success("Fund updated successfully.");
              refetch();
            } catch (error) {
              toast.error("Something went wrong.");
            }
          }}
          inputProps={{ "aria-label": "status switch" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: row.row.original.status === "ON" ? "green" : "red",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor:
                row.row.original.status === "ON" ? "green" : "red",
            },
            "& .MuiSwitch-track": {
              backgroundColor:
                row.row.original.status === "ON" ? "green" : "red",
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
          <div className="cursor-pointer" title="Delete Operator">
            <BsTrash
              fontSize={18}
              color="red"
              onClick={() => openDeleteModal(row.row.original.id)}
            />
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p>
                  <b>Are you sure you want to delete this fund?</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowModal(false);
                      handleDeleteFund(deletId);
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
  const [fundName, setFundName] = useState("");
  const [fundType, setFundType] = useState("");
  const [fundId, setFundId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deletId, setDeleteId] = useState("");

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  async function handleAddFund() {
    const emptyFields = [];
    setLoading(true);
    if (!fundName) emptyFields.push("Fund Name");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", fundName);
    formData.append("image", imageFile);

    try {
      await addFund(formData);
      refetch();
      closePopup();
      reset();
      toast.success("Fund added successfully.");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteFund(id: string) {
    try {
      await deleteFund(id);
      refetch();
      toast.success("Fund Successfully deleted.");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }
  async function openDeleteModal(id: string) {
    setDeleteId(id);
    setShowModal(true);
  }

  const handleClose = () => {
    closePopup();
    reset();
  };
  function handleFileChange(e: any) {
    setImageFile(e.target.files[0]);
  }

  const handlFundTypeChange = (event: any) => {
    debugger
    setFundType(event);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      debugger
      setFundId(id);
      let _data = await getFund(id);
      setIsEdit(true);
      if (_data.fund.length > 0) {
        setFundName(_data.fund[0].name);
        setFundType(_data.fund[0].fundType?.split(',') || [])
      }
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };
  async function handleEditFund() {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", fundName);
    formData.append("fundId", String(fundId));
    formData.append("fundType", String(fundType));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await addFund(formData);
      toast.success("Fund updated successfully.");
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
    setFundName("");
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      try {
        const response = await getAllFunds();
        const fundsData = response.funds;
        return fundsData;
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
            label="Add Fund"
            loader={Loading}
            disabled={Loading}
            Icon={<BsPlus fontSize={18} />}
          />
        </div>
      </div>

      {data && (
        <BasicTable
          data={data}
          columns={columns}
          actions={""}
          filter={["status"]}
        />
      )}

      <Popup
        title={isEdit ? "Edit Fund" : "Add Fund"}
        isOpen={isOpen}
        onClose={closePopup}
      >
        <div className="">
          <div className="mb-6">
            <TextInput
              label="Fund Name"
              value={fundName}
              onChange={setFundName}
            />
          </div>
          <div className="mb-6">
            <DropDownCheakBox
            isLoading={false}
              label={"Select Fund Type"}
              options={[
                { showvalue: "Select All", value: "All" },
                { showvalue: "BANK", value: "BANK" },
                { showvalue: "API", value: "API" },
                { showvalue: "CREDIT", value: "CREDIT" },
                { showvalue: "WALLET", value: "WALLET" },
                { showvalue: "CASH", value: "CASH" },
                { showvalue: "PAYOUT", value: "PAYOUT" },
              ]}
              value={fundType}
              onChange={handlFundTypeChange}
            />
          </div>

          <div className="mb-6">
            <FileUpload onChange={handleFileChange} />
          </div>

          <div className="flex justify-between mt-10">
            {isEdit ? (
              <ButtonLabel onClick={handleEditFund} label="Edit Fund" />
            ) : (
              <ButtonLabel onClick={handleAddFund} label="Add Fund" />
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

export default ManageFund;
