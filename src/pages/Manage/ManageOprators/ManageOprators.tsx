import React, { useEffect, useState } from "react";
import DefaultLayout from "../../../layout/DefaultLayout";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import TextInput from "../../../components/Input/TextInput";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { ButtonLabel } from "../../../components/Button/Button";
import { Select, Option } from "@material-tailwind/react";
import Switch from "@mui/material/Switch";
import {
  addCategory,
  addOperator,
  deleteOperator,
  getAllFunds,
  getAllOperators,
  getOnCategory,
  getOperator,
  updateOperators,
} from "../../../Services/categoryServices";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../common/Loader";
import { BsPencil, BsPlusLg, BsPlusSquareFill, BsTrash } from "react-icons/bs";
import { getCircleState } from "../../../Services/commonService";
import { apiUrl } from "../../../Utills/constantt";
import { DropSearch } from "../../../components/DropDown/DropSearch";
import { getAllApi } from "../../../Services/ApiService";

const ManageOperators = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showOperatorName, setShowOperatorName] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [catName, setCatName] = useState<string>("");
  const [operatorName, setOperatorName] = useState<string>("");
  const [purchaseCharge, setPurchaseCharge] = useState<string>("");
  const [fund, setFund] = useState<any[] | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [operator, setOperator] = useState<any[] | []>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [states, setSates] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(200000);
  const [selectedState, setSelectedState] = useState(0);
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [selectedFund, setSelectedfund] = useState("");
  const [operatorRefrence, setOperatorRefrence] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [apis, setApis] = useState<any[] | []>([]);
  const [deletId, setDeleteId] = useState("");
  const handleStateChange = (event: any) => {
    setSelectedState(event);
  };
  const handleClose = () => {
    closePopup();
    reset();
  };
  async function openDeleteModal(id: string) {
    setDeleteId(id);
    setShowModal(true);
  }
  const handleOperatorChange = (event: any) => {
    setOperatorRefrence(event);
  };
  const handleFundChange = (event: any) => {
    setSelectedfund(event);
  };
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value <= maxValue) {
      setMinValue(value);
    }
  };
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= minValue) {
      setMaxValue(value);
    }
  };

  async function handleApiPriorityChange(data: any, id: any) {
    try {
      await updateOperators(data, id);
      toast.success("Operator updated successfully.");
      refetch();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  }

  const { isLoading: apiIsloading, refetch: apiRefetch } = useQuery({
    queryKey: ["Apis"],
    queryFn: async () => {
      try {
        const response = await getAllApi();
        const apiData = response.apiData;
        if (apiData.length > 0) {
          let _data: any = [];
          apiData.forEach((api: any) => {
            _data.push({
              showvalue: `${api.apiName}`,
              value: api?.apiId,
            });
          });
          setApis(_data);
        }
        return apiData;
      } catch (error: any) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    },
    refetchOnWindowFocus: true,
  });

  const columns = [
    {
      header: "Operator",
      accessorKey: "operatorImage",
      cell: (row: any) => (
        <div className="flex items-center gap-2 justify-center">
          <img
            crossOrigin="anonymous"
            className="rounded-full"
            height={40}
            width={40}
            src={`${apiUrl}/uploads/operatorimages/${row.row.original.operatorImage}`}
            alt="User"
          />
          <span>{row.row.original.name}</span>
        </div>
      ),
    },
    {
      header: "Operator Code",
      accessorKey: "operatorCode",
      size: 20,
    },
    {
      header: "Amount Range",
      accessorKey: "amountMinRange",
      size: 40,
      cell: (row: any) => (
        <span>
          {row.row.original.amountMinRange}-{row.row.original.amountMaxRange}
        </span>
      ),
    },
    {
      header: "Circular State",
      accessorKey: "state",
      size: 40,
    },
    {
      header: "Category",
      accessorKey: "category",
      size: 40,
    },
    {
      header: "Purchase",
      accessorKey: "purchaseCharge",
      size: 20,
    },
    {
      header: "Priority 1",
      accessorKey: "priority1",
      size: 160,
      cell: (row: any) => (
        <DropSearch
          value={row.row.original.priority1}
          onchange={(val: any) =>
            handleApiPriorityChange({ priority1: val }, row.row.original.id)
          }
          placeholder="Select P1"
          options={apis}
          error={""}
        />
      ),
    },
    {
      header: "Priority 2",
      accessorKey: "priority2",
      size: 160,
      cell: (row: any) => (
        <DropSearch
          value={row.row.original.priority2}
          onchange={(val: any) =>
            handleApiPriorityChange({ priority2: val }, row.row.original.id)
          }
          placeholder="Select P2"
          options={apis}
          error={""}
        />
      ),
    },
    {
      header: "Priority 3",
      accessorKey: "priority3",
      size: 160,
      cell: (row: any) => (
        <DropSearch
          value={row.row.original.priority3}
          onchange={(val: any) =>
            handleApiPriorityChange({ priority3: val }, row.row.original.id)
          }
          placeholder="Select P3"
          options={apis}
          error={""}
        />
      ),
    },
    {
      header: "Roffer Api",
      accessorKey: "planapi",
      size: 160,
      cell: (row: any) => (
        <DropSearch
          value={row.row.original.planapi}
          onchange={(val: any) =>
            handleApiPriorityChange({ planapi: val }, row.row.original.id)
          }
          placeholder="Select Roffer"
          options={apis}
          error={""}
        />
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 20,
      cell: (row: any) => (
        <Switch
          checked={row.row.original.status === "ON"}
          onChange={async (e) => {
            const newValue = e.target.checked ? "ON" : "OFF";
            try {
              await updateOperators({ status: newValue }, row.row.original.id);
              toast.success("Operator updated successfully.");
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
      size: 20,
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
                  <b>Are you sure you want to delete this operator?</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowModal(false);
                      handleDeleteOperator(deletId);
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

  async function handleAddCategory() {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", catName);
    formData.append("fund", String(selectedFund));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await addCategory(formData);
      refetch();
      closePopup();
      toast.success("Category added successfully.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong.");
    }
  }

  async function handleAddOperator() {
    const emptyFields = [];
    setLoading(true);
    if (!selectedCategory) emptyFields.push("Category");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", operatorName);
    formData.append("state", String(selectedState));
    formData.append("category", String(selectedCategory));
    formData.append("amountMinRange", String(minValue));
    formData.append("amountMaxRange", String(maxValue));
    formData.append("operatorRefrence", String(operatorRefrence));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await addOperator(formData);
      refetch();
      closePopup();
      setLoading(false);
      toast.success("Operator added successfully.");
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
  }
  async function handleDeleteOperator(id: string) {
    try {
      setLoading(true);
      await deleteOperator(id);
      refetch();
      toast.success("Operator Successfully deleted.");
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  }

  const handleOpenEdit = async (id: string) => {
    try {
      setSelectedOperatorId(id);
      let _data = await getOperator(id);
      setIsEdit(true);
      if (_data.operators.length > 0) {
        setSelectedCategory(Number(_data.operators[0].category));
        setOperatorRefrence(Number(_data.operators[0].operatorCode));
        setMinValue(_data.operators[0].amountMinRange);
        setMaxValue(_data.operators[0].amountMaxRange);
        setOperatorName(_data.operators[0].name);
        setPurchaseCharge(_data.operators[0].purchaseCharge);
        setSelectedState(Number(_data.operators[0].state));
      }
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };
  async function handleEditOperator() {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", operatorName);
    formData.append("state", String(selectedState));
    formData.append("category", String(selectedCategory));
    formData.append("amountMinRange", String(minValue));
    formData.append("amountMaxRange", String(maxValue));
    formData.append("operatorRefrence", String(operatorRefrence));
    formData.append("purchaseCharge", String(purchaseCharge));
    formData.append("operatorId", String(selectedOperatorId));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await addOperator(formData);
      refetch();
      closePopup();
      setLoading(false);
      toast.success("Operator updated successfully.");
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
  }
  async function reset() {
    setIsEdit(false);
    setSelectedCategory(0);
    setPurchaseCharge("");
    setSelectedState(0);
    setOperatorRefrence(0);
    setMinValue(0);
    setMaxValue(200000);
  }

  const handleResetOperator = () => {
    setOperator([]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOnCategory();
        const fundsdata = await getAllFunds();
        const categoryData = response.category;
        let states = await getCircleState();
        setSates(states.circleStateData);
        if (fundsdata.funds.length > 0) {
          setFund(fundsdata.funds);
        }
        if (categoryData.length > 0) {
          setCategoryData(categoryData);
        }
        console.log("ss");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const { isLoading, error, data, refetch } = useQuery<any>({
    queryKey: ["categorys"],
    queryFn: async () => {
      try {
        const operatorsData = await getAllOperators();
        setShowOperatorName(false);
        const uniqueOperatorCodes = new Set();
        operatorsData.operators.forEach((operator: any) => {
          if (operator.status === "ON") {
            uniqueOperatorCodes.add(operator.operatorCode);
          }
        });
        const uniqueOperators = Array.from(uniqueOperatorCodes).map(
          (operatorCode) => {
            return operatorsData.operators.find(
              (operator: any) => operator.operatorCode === operatorCode
            );
          }
        );
        setOperator(uniqueOperators);
        return operatorsData.operators;
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />;
  if (error) {
    toast.error("Something went wrong.");
  }

  return (
    <DefaultLayout isList={true}>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-2">
        <div className="w-full md:w-1/2"></div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <ButtonLabel
            loader={Loading}
            disabled={Loading}
            onClick={openPopup}
            type="button"
            label="Add Operator"
            Icon={<BsPlusLg fontSize={18} />}
          />
        </div>
      </div>

      {data && (
        <BasicTable
          data={data}
          columns={columns}
          actions={""}
          filter={["status", "category"]}
        />
      )}

      <Popup
        title={isEdit ? "Edit Operator" : "Add Operator"}
        isOpen={isOpen}
        onClose={closePopup}
      >
        <Popup title={"Add Category"} isOpen={showPopup} onClose={closePopup}>
          <div className="p-6">
            <div className="mb-6">
              <TextInput
                label="Category Name"
                onChange={setCatName}
                name={""}
                isModel={true}
              />
            </div>

            <div className="mb-6">
              <Select label="Select Fund" onChange={handleFundChange}>
                {fund?.map((fund: any, index: any) => (
                  <Option key={index} value={fund.fundCode}>
                    {fund.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="mb-6">
              <FileUpload
                onChange={handleFileChange}
                label={""}
                error={undefined}
                name={""}
              />
            </div>

            <div className="flex justify-end gap-2">
              <ButtonLabel
                loader={Loading}
                disabled={Loading}
                onClick={handleAddCategory}
                label="Add Category"
              />
              <ButtonLabel
                style={{ backgroundColor: "red" }}
                onClick={() => setShowPopup(!showPopup)}
                label="Close"
              />
            </div>
          </div>
        </Popup>

        <div>
          {operator.length !== 0 && (
            <div className="mb-6 flex gap-2 items-center">
              <Select
                label="Select Operator"
                onChange={handleOperatorChange}
                value={operatorRefrence}
              >
                {operator?.map((option, index) => (
                  <Option key={index} value={option.operatorCode}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        crossOrigin="anonymous"
                        src={`${apiUrl}/uploads/operatorimages/${option.operatorImage}`}
                        alt={option.name}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "10px",
                        }}
                      />
                      {option.name}
                    </div>
                  </Option>
                ))}
              </Select>

              <div>
                <BsPlusSquareFill
                  fontSize={28}
                  onClick={() => {
                    setShowOperatorName(!showPopup);
                    handleResetOperator(); // Reset operator value
                  }}
                />
              </div>
            </div>
          )}
          {(showOperatorName || operator?.length == 0) && (
            <div className="mb-6">
              <TextInput
                label="Operator Name"
                onChange={setOperatorName}
                name={""}
                isModel={true}
              />
            </div>
          )}
          <div className="mb-6 flex gap-2 items-center">
            <Select
              label="Select Category"
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              {categoryData.map((option, index) => (
                <Option key={index} value={option.categoryCode}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      crossOrigin="anonymous"
                      src={`${apiUrl}/uploads/categoryimages/${option.categoryImage}`}
                      alt={option.name}
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                    />
                    {option.name}
                  </div>
                </Option>
              ))}
            </Select>

            <div>
              <BsPlusSquareFill
                fontSize={28}
                onClick={() => setShowPopup(!showPopup)}
              />
            </div>
          </div>
          <div className="mb-6">
            <Select
              label="Select State"
              onChange={handleStateChange}
              value={selectedState}
            >
              {states.map((state: any, index: any) => (
                <Option key={index} value={state.code}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </div>
          {isEdit && (
            <div className="mb-6">
              <TextInput
                label="Purchase Charge"
                value={purchaseCharge}
                onChange={setPurchaseCharge}
                name={""}
                isModel={true}
              />
            </div>
          )}
          <div className="mb-6">
            <FileUpload
              onChange={handleFileChange}
              label={""}
              error={undefined}
              name={""}
            />
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <label
                htmlFor="minAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Min Amount
              </label>
              <input
                id="minAmount"
                type="text"
                value={minValue}
                className="mt-1 block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="amountRange"
                className="block text-sm font-medium text-gray-700"
              >
                Amount Range
              </label>
              <input
                id="amountRange"
                type="range"
                min="100"
                max="300000"
                value={minValue}
                onChange={handleChange}
                className="w-full h-5 bg-gray-300 rounded-md overflow-hidden appearance-none"
                style={{
                  background: `linear-gradient(to right, #2563EB 0%, #2563EB ${
                    ((minValue - 100) / (1000 - 100)) * 100
                  }%, #E5E7EB ${
                    ((minValue - 100) / (1000 - 100)) * 100
                  }%, #E5E7EB 100%)`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="mr-4">
              <label
                htmlFor="maxAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Max Amount
              </label>
              <input
                id="maxAmount"
                type="text"
                value={maxValue}
                className="mt-1 block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={handleMaxChange}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="maxAmountRange"
                className="block text-sm font-medium text-gray-700"
              >
                Max Amount Range
              </label>
              <input
                id="maxAmountRange"
                type="range"
                min="100"
                max="300000"
                value={maxValue}
                onChange={handleMaxChange}
                className="w-full h-5 bg-gray-300 rounded-md overflow-hidden appearance-none"
                style={{
                  background: `linear-gradient(to right, #2563EB 0%, #2563EB ${
                    ((maxValue - 100) / (1000 - 100)) * 100
                  }%, #E5E7EB ${
                    ((maxValue - 100) / (1000 - 100)) * 100
                  }%, #E5E7EB 100%)`,
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-10">
            {isEdit ? (
              <ButtonLabel
                loader={Loading}
                disabled={Loading}
                onClick={handleEditOperator}
                label="Edit Operator"
              />
            ) : (
              <ButtonLabel
                loader={Loading}
                disabled={Loading}
                onClick={handleAddOperator}
                label="Add Operator"
              />
            )}
            <ButtonLabel
              loader={Loading}
              disabled={Loading}
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

export default ManageOperators;
