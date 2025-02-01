import DefaultLayout from "../../../layout/DefaultLayout";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import TextInput from "../../../components/Input/TextInput";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { ButtonLabel } from "../../../components/Button/Button";
import {
  addCategory,
  deleteCategory,
  getAllCategorys,
  getAllFunds,
  getCategory,
  getFundsOn,
  updateCategory,
} from "../../../Services/categoryServices";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../common/Loader";
import { Select, Option } from "@material-tailwind/react";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import Switch from "@mui/material/Switch";
import { apiUrl } from "../../../Utills/constantt";
import { BsPencil, BsTrash } from "react-icons/bs";
import { getAllService } from "../../../Services/serviceService";
const ManageCategory = () => {
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Category Image",
      accessorKey: "categoryImage",
      cell: (row: any) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="h-6 w-6 rounded-full">
            <img
              crossOrigin="anonymous"
              className="rounded-full"
              height={40}
              width={40}
              src={`${apiUrl}/uploads/categoryimages/${row.row.original.categoryImage}`}
              alt="User"
            />
          </span>
        </div>
      ),
    },
    {
      header: "Category Code",
      accessorKey: "categoryCode",
    },
    {
      header: "Fund",
      accessorKey: "fund",
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
              await updateCategory({ status: newValue }, row.row.original.id);
              toast.success("Category updated successfully.");
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
                  <b>Are you sure you want to delete this category?</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowModal(false);
                      handleDeleteCategory(deletId);
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
  const [catName, setCatName] = useState("");
  const [catId, setCatId] = useState("");
  const [fund, setFund] = useState<any[] | null>(null);
  const [selectedFund, setSelectedfund] = useState(0);
  const [selectedCategoryType, setSelectedCategoryType] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [deletId, setDeleteId] = useState("");
  const [categorys, setCategorys] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  async function handleAddCategory() {
    const emptyFields = [];
    setLoading(true);
    if (!selectedFund) emptyFields.push("Fund");
    if (!catName) emptyFields.push("Category");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", catName);
    formData.append("service", String(selectedService));
    formData.append("fund", String(selectedFund));
    formData.append("categoryType", selectedCategoryType);
    formData.append("image", imageFile);

    try {
      await addCategory(formData);
      toast.success("Category added successfully.");
      refetch();
      closePopup();
      reset();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteCategory(id: string) {
    try {
      setLoading(true);
      await deleteCategory(id);
      refetch();
      toast.success("Category Successfully deleted.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
  const handleFundChange = (event: any) => {
    setSelectedfund(event);
  };
  const handlCategoryTypeChange = (event: any) => {
    setSelectedCategoryType(event);
  };
  const handleServiceChange = (event: any) => {
    setSelectedService(event);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      setCatId(id);
      let _data = await getCategory(id);
      setIsEdit(true);
      if (_data.category.length > 0) {
        setSelectedfund(Number(_data.category[0].fund));
        setSelectedService(_data.category[0].service);
        setCatName(_data.category[0].name);
        setSelectedCategoryType(_data.category[0].categoryType);
      }
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };
  async function handleEditCategory() {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", catName);
    formData.append("fund", String(selectedFund));
    formData.append("service", String(selectedService));
    formData.append("categoryId", String(catId));
    formData.append("categoryType", selectedCategoryType);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await addCategory(formData);
      toast.success("Category updated successfully.");
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
    setCatName("");
    setSelectedfund(0);
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["categorys"],
    queryFn: async () => {
      try {
        const response = await getAllCategorys();
        const _service = await getAllService();
        const fundsdata = await getFundsOn();
        if (fundsdata.fund.length > 0) {
          setFund(fundsdata.fund);
        }
        if (_service.service.length > 0) {
          setServices(_service.service);
        }
        const categoryData = response.category;
        if (categoryData.length > 0) {
          setCategorys(categoryData); // Update state with user data
        }
        return categoryData; // Return user data from the query function
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
            label="Add Category"
            Icon={<BsPlus fontSize={18} />}
          />
        </div>
      </div>

      {categorys && (
        <BasicTable
          data={categorys}
          columns={columns}
          actions={""}
          filter={["status"]}
        />
      )}

      <Popup
        title={isEdit ? "Edit Category" : "Add Category"}
        isOpen={isOpen}
        onClose={closePopup}
      >
        <div className="">
          <div className="mb-6">
            <TextInput
              label="Category Name"
              value={catName}
              onChange={setCatName}
            />
          </div>

          <div className="mb-6">
            <Select
              label="Select Fund"
              onChange={handleFundChange}
              value={selectedFund}
            >
              {fund?.map((fund: any, index: any) => (
                <Option key={index} value={fund.fundCode}>
                  {fund.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="mb-6">
            <Select
              label="Select Category Type"
              onChange={handlCategoryTypeChange}
              value={selectedCategoryType}
            >
              <Option value="prepaid">Prepaid</Option>
              <Option value="postpaid">Postpaid</Option>
              <Option value="dth">Dth</Option>
              <Option value="money1">Money1</Option>
              <Option value="money2">Money2</Option>
              <Option value="aeps1">Aeps1</Option>
              <Option value="bank1">bank1</Option>
              <Option value="bank2">bank2</Option>
              <Option value="bank3">bank3</Option>
              <Option value="aeps3">Aeps3</Option>
              <Option value="electricity">Electricity</Option>
              <Option value="loanemi">LoanEmi</Option>
              <Option value="fastag">Fastag</Option>
              <Option value="gateway">Gateway</Option>
              <Option value="mpos">MPOS</Option>
              <Option value="matm">MATM</Option>
            </Select>
          </div>
          {services && (
            <div className="mb-6">
              <Select
                label="Select Service"
                onChange={handleServiceChange}
                value={selectedService}
              >
                {services?.map((fund: any, index: any) => (
                  <Option key={index} value={fund.id}>
                    {fund.serviceName}
                  </Option>
                ))}
              </Select>
            </div>
          )}
          <div className="mb-6">
            <FileUpload onChange={handleFileChange} />
          </div>

          <div className="flex justify-between mt-10">
            {isEdit ? (
              <ButtonLabel onClick={handleEditCategory} label="Edit Category" />
            ) : (
              <ButtonLabel onClick={handleAddCategory} label="Add Category" />
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

export default ManageCategory;
