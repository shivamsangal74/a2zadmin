import DefaultLayout from "../../../layout/DefaultLayout";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import TextInput from "../../../components/Input/TextInput";
import { ButtonLabel } from "../../../components/Button/Button";
import { getAllCategorys } from "../../../Services/categoryServices";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../common/Loader";

import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { BsPencil, BsTrash } from "react-icons/bs";
import { DropSearch } from "../../../components/DropDown/DropSearch";
import DropDownCheakBox from "../../../components/DropDown/DropDownCheakBox";
import {
  addCommission,
  deleteCommissions,
  getCommission,
  getCommissions,
  getCommissionsData,
  getOpraters,
  updateBulkCommissions,
  updateCommissions,
} from "../../../Services/CommissionServices";
import { Switch } from "@mui/material";

const Commission = () => {
  const columns = [
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-2">
          <div className="cursor-pointer">
            <BsPencil
              fontSize={18}
              color="blue"
              onClick={() => {
                handleOpenEdit(row.row.original.commId);
              }}
            />
          </div>
          <div className="cursor-pointer" title="Delete Operator">
            <BsTrash
              fontSize={18}
              color="red"
              onClick={() => openDeleteModal(row.row.original.commId)}
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
                      handleDeleteCommission(deletId);
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
    {
      header: "Comm Name",
      accessorKey: "commName",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Operator",
      accessorKey: "oprater",
    },

    {
      header: "Comm Type",
      accessorKey: "commType",
    },
    {
      header: "Pay Type",
      accessorKey: "paymentType",
    },
    {
      header: "Range",
      accessorKey: "ran",
    },
    {
      header: "Ref Value",
      accessorKey: "refValue",
    },
    {
      header: "MD Comm",
      accessorKey: "mdistributorValue",
    },
    {
      header: "Ds Comm",
      accessorKey: "distributorValue",
    },
    {
      header: "Rt Comm",
      accessorKey: "retailerValue",
    },
    {
      header: "Api Comm",
      accessorKey: "apiValue",
    },
    {
      header: "GST",
      accessorKey: "gst",
      size: 30,
      cell: (row: any) => {
        return (
          <div>
            <Switch
              checked={row.row.original.gst}
              onChange={() =>
                handleSwitchChange(
                  row.row.original.commId,
                  "gst",
                  !row.row.original.gst
                )
              }
              inputProps={{ "aria-label": "status switch" }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: row.row.original.gst ? "green" : "red",
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: row.row.original.gst ? "green" : "red",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: row.row.original.gst ? "green" : "red",
                },
              }}
            />
          </div>
        );
      },
    },
    {
      header: "TDS",
      accessorKey: "tds",
      size: 30,
      cell: (row: any) => {
        return (
          <div>
            <Switch
              checked={row.row.original.tds}
              onChange={() =>
                handleSwitchChange(
                  row.row.original.commId,
                  "tds",
                  !row.row.original.tds
                )
              }
              inputProps={{ "aria-label": "status switch" }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: row.row.original.tds ? "green" : "red",
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: row.row.original.tds ? "green" : "red",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: row.row.original.tds ? "green" : "red",
                },
              }}
            />
          </div>
        );
      },
    },
    {
      header: "CCF",
      accessorKey: "ccf",
      size: 30,
      cell: (row: any) => {
        return (
          <div>
            <Switch
              checked={row.row.original.ccf}
              onChange={() =>
                handleSwitchChange(
                  row.row.original.commId,
                  "ccf",
                  !row.row.original.ccf
                )
              }
              inputProps={{ "aria-label": "status switch" }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: row.row.original.ccf ? "green" : "red",
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: row.row.original.ccf ? "green" : "red",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: row.row.original.ccf ? "green" : "red",
                },
              }}
            />
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 30,
      cell: (row: any) => {
        return (
          <div>
            <Switch
              checked={row.row.original.status}
              onChange={() =>
                handleSwitchChange(
                  row.row.original.commId,
                  "status",
                  !row.row.original.status
                )
              }
              inputProps={{ "aria-label": "status switch" }}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: row.row.original.status ? "green" : "red",
                },
                "& .MuiSwitch-thumb": {
                  backgroundColor: row.row.original.status ? "green" : "red",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: row.row.original.status ? "green" : "red",
                },
              }}
            />
          </div>
        );
      },
    },
  ];

  const handleSwitchChange = async (
    commId: string,
    field: string,
    newValue: boolean
  ) => {
    try {
      const updatedCommData = { [field]: newValue };
      await updateCommissions(commId, updatedCommData);
      refetch();
      toast.success(`Commission ${field} updated successfully.`);
    } catch (error) {
      toast.error(`Failed to update ${field}.`);

      console.error("Error updating commission:", error);
    }
  };
  const [isEdited, setIsEdited] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [userType, setUserType] = useState("");
  const [bulkEdit, setBulkEdit] = useState(false);
  const [oprater, setOprater] = useState([]);
  const [commName, setCommName] = useState("");
  const [commType, setCommType] = useState("");
  const [payType, setPayType] = useState("");
  const [categorys, setCategorys] = useState([]);
  const [opratersOptions, setOpratersOptions] = useState([]);
  const [openError, setOpenError] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  const [refVal, setRefValue] = useState("");
  const [distributorValue, setDistributorValue] = useState("");
  const [mdistributorValue, setMDistributorValue] = useState("");
  const [retailerValue, setRetailerValue] = useState("");
  const [apiValue, setApiValue] = useState();
  const [gst, setGst] = useState(false);
  const [tds, setTds] = useState(false);
  const [ccf, setCcf] = useState(false);
  const [commissions, setCommissions] = useState([]);
  const [retailercommType, setretailercommType] = useState("");
  const [selectedFilterCommission, setSelectedFilterCommission] = useState("");
  const [commNameOptions, setCommNameOptions] = useState([]);
  const [deletId, setDeleteId] = useState("");

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["categorys"],
    queryFn: async () => {
      try {
        const response = await getAllCategorys();

        const categoryData = response.category;
        let _dataCat: any = [];
        if (categoryData.length > 0) {
          categoryData.forEach((cat: any) => {
            _dataCat.push({
              showvalue: cat?.name,
              value: cat?.categoryCode,
            });
          });
        }
        if (_dataCat.length > 0) {
          setCategorys(_dataCat);
        }
        const commissions = await getCommissions();

        let uniqueCommissions = new Set();
        let _dataComm: any = [];
        if (commissions.length > 0) {
          commissions.forEach((op: any) => {
            if (op?.commName && !uniqueCommissions.has(op.commName)) {
              uniqueCommissions.add(op.commName);
              _dataComm.push({
                showvalue: `${op.commName}`,
                value: op.commName,
              });
            }
          });
        }
        if (_dataComm.length > 0) {
          setCommNameOptions(_dataComm);
        }
        return categoryData;
      } catch (error) {
        setOpenError(true);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  async function handleAddCommission() {
    const emptyFields = [];
    setLoading(true);
    if (!catName) emptyFields.push("Category");
    if (!oprater) emptyFields.push("Oprater");
    if (!commName) emptyFields.push("Name");
    if (!payType) emptyFields.push("Payment Type");
    if (!commType) emptyFields.push("Commission Type");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }

    const commData = {
      catName,
      oprater,
      commName,
      payType,
      commType,
      userType,
      refValue: refVal,
      retailercommType,
      mdistributorValue,
      retailerValue,
      distributorValue,
      apiValue,
      gst,
      tds,
      ccf,
    };

    try {
      await addCommission(commData);
      toast.success("Commission added successfully.");
      closePopup();
      refetch();
      reset();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenEdit = async (id: string) => {
    try {
      const _data = await getCommission(id);
      setEditId(id);
      const commissionData = _data.commission;
      const opraters = await getOpraters(commissionData.category);
      const opratersData = opraters.opraters;
      let _dataCat: any = [];
      if (opratersData.length > 0) {
        opratersData.forEach((op: any) => {
          _dataCat.push({
            showvalue: `${op?.name} (${op.amountMinRange} - ${op.amountMaxRange}) - ${op.operatorCode}`,
            value: op?.id,
          });
        });
      }
      if (_dataCat.length > 0) {
        setOpratersOptions(_dataCat);
      }
      if (commissionData) {
        setCatName(commissionData.category);
        setCommName(commissionData.commName);
        setCommType(commissionData.commType);
        setRefValue(commissionData.refValue);
        setOprater(commissionData.operator);
        setUserType(commissionData.userType);
        setPayType(commissionData.paymentType);
        setDistributorValue(commissionData.distributorValue);
        setMDistributorValue(commissionData.distributorValue);
        setRetailerValue(commissionData.retailerValue);
        setApiValue(commissionData.apiValue);
        setGst(commissionData.gst);
        setTds(commissionData.tds);
        setCcf(commissionData.ccf);
        setretailercommType(commissionData.retailercommType);
      }
      setIsEdited(true);
      setIsOpen(true);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  async function reset() {
    setIsOpen(false);
    setIsEdited(false);
    setCatName("");
    setUserType("");
    setCommName("");
    setCommType("");
    setRefValue("");
    setOprater([]);
    setPayType("");
    setGst(false);
    setTds(false);
    setCcf(false);
    setMDistributorValue("");
    setApiValue("");
    setRetailerValue("");
    setDistributorValue("");
    setEditId("");
    setretailercommType("");
    setBulkEdit(false);
    setLoading(false);
  }

  async function getOpratersWithId(id: string) {
    setOpratersOptions([]);
    try {
      setLoading(true);
      const opraters = await getOpraters(id);
      const opratersData = opraters.opraters;
      let _dataCat: any = [];
      if (opratersData.length > 0) {
        opratersData.forEach((op: any) => {
          _dataCat.push({
            showvalue: `${op?.name} (${op.amountMinRange}-${op.amountMaxRange}) -${op.operatorCode}`,
            value: op?.id,
          });
        });
      }
      if (_dataCat.length > 0) {
        setOpratersOptions(_dataCat);
      }
      setLoading(false);

      console.log(opraters);
    } catch (error) {
      toast.error(`${error}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCommission(id: any) {
    try {
      await deleteCommissions(id);
      toast.success(`Commission deletd successfully.`);
      refetch();
    } catch (error) {
      toast.error(`falied to delete commission.`);
    }
  }

  async function handleEditCommission() {
    try {
      const emptyFields = [];
      if (!catName) emptyFields.push("Category");
      if (!oprater) emptyFields.push("Oprater");
      if (!commName) emptyFields.push("Name");
      if (!payType) emptyFields.push("Payment Type");
      if (!commType) emptyFields.push("Commission Type");
      if (!editId) emptyFields.push("Id not found.");

      if (emptyFields.length > 0) {
        toast.error(
          `Please fill in the following fields: ${emptyFields.join(", ")}`
        );
        return;
      }

      const updatedCommData = {
        catName,
        oprater,
        commName,
        payType,
        commType,
        refValue: refVal,
        mdistributorValue,
        retailerValue,
        distributorValue,
        retailercommType,
        apiValue,
        gst,
        tds,
        ccf,
      };

      await updateCommissions(editId, updatedCommData);
      handleCommFilterChange(commName);
      reset();
      refetch();
      toast.success(`Commission updated successfully.`);
    } catch (error) {
      toast.error(`Failed to update.`);

      console.error("Error updating commission:", error);
    }
  }

  const getUniqueValues = (accessorKey) => {
    return [...new Set(data.map((row) => row[accessorKey]))];
  };

  if (isLoading)
    return (
      <DefaultLayout>
        <Loader />
      </DefaultLayout>
    );

  if (error) {
    return toast.error("Something went wrong!");
  }

  async function handleCatChange(value: string) {
    setCatName(value);
    await getOpratersWithId(value);
  }
  async function openDeleteModal(id: string) {
    setDeleteId(id);
    setShowModal(true);
  }

  async function handleCommFilterChange(value: string) {
    setSelectedFilterCommission(value);
    const commissionsData = await getCommissionsData(value);
    setCommissions(commissionsData);
  }

  async function handleOPChange(value: any) {
    setOprater(value);
  }

  async function handleCommChange(value: any) {
    setCommName(value);
  }
  function handleUserTypeChange(value: any) {
    setUserType(value);
  }

  async function HandleBulkUpdate() {
    try {
      const emptyFields = [];
      setLoading(true);
      if (!catName) emptyFields.push("Category");
      if (!oprater) emptyFields.push("Oprater");
      if (!commName) emptyFields.push("Name");
      if (!payType) emptyFields.push("Payment Type");
      if (!commType) emptyFields.push("Commission Type");

      if (emptyFields.length > 0) {
        toast.error(
          `Please fill in the following fields: ${emptyFields.join(", ")}`
        );
        setLoading(false);
        return;
      }

      const updatedCommData = {
        catName,
        oprater,
        commName,
        payType,
        commType,
        refValue: refVal,
        mdistributorValue,
        retailerValue,
        distributorValue,
        apiValue,
        gst,
        tds,
        ccf,
        retailercommType,
        userType,
      };

      await updateBulkCommissions(commName, updatedCommData);
      reset();
      refetch();
      toast.success(`Commission updated successfully.`);
    } catch (error) {
      toast.error(`Failed to update.`);

      console.error("Error updating commission:", error);
    }
  }

  return (
    <DefaultLayout isList={true}>
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 py-2">
        <div className="w-full"></div>
        <DropSearch
          value={selectedFilterCommission}
          onchange={handleCommFilterChange}
          placeholder="Select Commission"
          options={[...commNameOptions]}
          error={""}
        />
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <ButtonLabel
            onClick={() => setBulkEdit(true)}
            type="button"
            label="Bulk Update"
            Icon={<BsPlus fontSize={18} />}
          />
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <ButtonLabel
            onClick={openPopup}
            type="button"
            label="Add Commission"
            Icon={<BsPlus fontSize={18} />}
          />
        </div>
      </div>

      {categorys && (
        <BasicTable
          data={commissions}
          columns={columns}
          actions={""}
          filter={["status", "category"]}
        />
      )}

      <Popup
        title={isEdited ? "Edit Commission" : "Add Commission"}
        isOpen={isOpen}
        onClose={closePopup}
        width={"xxl"}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <TextInput
              name={"commName"}
              isModel={true}
              label="Commission Name"
              onChange={setCommName}
              value={commName}
            />
          </div>
        </div>
        <div className="flex -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {isEdited ? (
              <DropSearch
                value={catName}
                onchange={handleCatChange}
                placeholder="Select Category"
                options={[...categorys]}
                error={""}
              />
            ) : (
              <DropDownCheakBox
                label={"Select Category"}
                options={[
                  { showvalue: "Select All", value: "All" },
                  ...categorys,
                ]}
                value={catName}
                onChange={handleCatChange}
              />
            )}
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {isEdited ? (
              <DropSearch
                value={oprater}
                onchange={handleOPChange}
                placeholder="Operator"
                options={[...opratersOptions]}
                error={""}
              />
            ) : (
              <DropDownCheakBox
                label={"Operator"}
                isLoading={Loading}
                options={[
                  { showvalue: "Select All", value: "All" },
                  ...opratersOptions,
                ]}
                value={oprater}
                onChange={handleOPChange}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <DropSearch
              placeholder="Select UserType"
              options={[
                { showvalue: "Select UserType", value: undefined },
                { showvalue: "admin", value: "admin" },
                {
                  showvalue: "Master Distributor",
                  value: "masterdistributor",
                },
                { showvalue: "Distributor", value: "distributor" },
                { showvalue: "Retailer", value: "retailer" },
                { showvalue: "Api User", value: "apiuser" },

                { showvalue: "Referal", value: "Referal" },
              ]}
              value={userType}
              name="userType"
              onchange={handleUserTypeChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <DropSearch
              value={commType}
              onchange={(val) => setCommType(val)}
              placeholder="Select Commission Type"
              options={[
                { showvalue: "Select CommType", value: "" },
                { showvalue: "Commission", value: "commission" },
                {
                  showvalue: "Surcharge",
                  value: "Surcharge",
                },
              ]}
              error={""}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-5">
            <DropSearch
              value={payType}
              onchange={(val) => setPayType(val)}
              placeholder="Select Payment Type"
              options={[
                { showvalue: "Select PaymentType", value: "" },
                { showvalue: "Precentage", value: "precentage" },
                {
                  showvalue: "Rupee",
                  value: "rupee",
                },
              ]}
              error={""}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-5">
            <TextInput
              name={"refValue"}
              isModel={true}
              label="Referal Value"
              type="number"
              onChange={setRefValue}
              value={refVal}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2 mt-5">
          {userType == "masterdistributor" && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0">
              <TextInput
                name={"commMDDistributor"}
                isModel={true}
                type="number"
                label="Master distributor Commission"
                onChange={setMDistributorValue}
                value={mdistributorValue}
              />
            </div>
          )}
          {(userType == "masterdistributor" || userType == "distributor") && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0">
              <TextInput
                name={"commDistributor"}
                isModel={true}
                type="number"
                label="Distributor Commission"
                onChange={setDistributorValue}
                value={distributorValue}
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          {userType == "apiuser" && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0">
              <TextInput
                name={"apiUser"}
                isModel={true}
                type="number"
                label="Api User Commission"
                onChange={setApiValue}
                value={apiValue}
              />
            </div>
          )}
          {(userType == "masterdistributor" ||
            userType == "retailer" ||
            userType == "distributor") && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0 mt-3">
              <TextInput
                name={"commRetailer"}
                isModel={true}
                type="number"
                label="Retailer Commission"
                onChange={setRetailerValue}
                value={retailerValue}
              />
            </div>
          )}
          {(userType == "masterdistributor" ||
            userType == "retailer" ||
            userType == "distributor") && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0 mt-3">
              <DropSearch
                value={retailercommType}
                onchange={(val) => setretailercommType(val)}
                placeholder="Select Retaier Commission Type"
                options={[
                  { showvalue: "Commission", value: "commission" },
                  {
                    showvalue: "Surcharge",
                    value: "Surcharge",
                  },
                ]}
                error={""}
              />
            </div>
          )}
          <div className="flex items-center w-1/2 mt-8 ml-5">
            <div className="flex gap-2 items-center">
              <span>TDS : </span>

              <Switch
                checked={tds}
                onChange={() => setTds(!tds)}
                inputProps={{ "aria-label": "status switch" }}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: tds ? "green" : "red",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: tds ? "green" : "red",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: tds ? "green" : "red",
                  },
                }}
              />
            </div>
            <div className="flex gap-2 items-center">
              <span>GST : </span>

              <Switch
                checked={gst}
                onChange={() => setGst(!gst)}
                inputProps={{ "aria-label": "status switch" }}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: gst ? "green" : "red",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: gst ? "green" : "red",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: gst ? "green" : "red",
                  },
                }}
              />
            </div>
            <div className="flex gap-2 items-center">
              <span>CCF : </span>

              <Switch
                checked={ccf}
                onChange={() => setCcf(!ccf)}
                inputProps={{ "aria-label": "status switch" }}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: ccf ? "green" : "red",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: ccf ? "green" : "red",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: ccf ? "green" : "red",
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-around">
          <ButtonLabel
            label={`${isEdited ? "Edit" : "Add"} Commission`}
            onClick={isEdited ? handleEditCommission : handleAddCommission}
          />
          <ButtonLabel label="Cancel" veriant={"outline"} onClick={reset} />
        </div>
      </Popup>

      <Popup
        title={"Edit Commission"}
        isOpen={bulkEdit}
        onClose={() => setBulkEdit(false)}
        width={"xxl"}
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <DropSearch
              value={commName}
              onchange={handleCommChange}
              placeholder="Commission Name"
              options={[...commNameOptions]}
              error={""}
            />
          </div>
        </div>
        <div className="flex -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <DropDownCheakBox
              label={"Select Category"}
              options={[
                { showvalue: "Select All", value: "All" },
                ...categorys,
              ]}
              value={catName}
              onChange={handleCatChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {isEdited ? (
              <DropSearch
                value={oprater}
                onchange={handleOPChange}
                placeholder="Operator"
                options={[...opratersOptions]}
                error={""}
              />
            ) : (
              <DropDownCheakBox
                label={"Operator"}
                isLoading={Loading}
                options={[
                  { showvalue: "Select All", value: "All" },
                  ...opratersOptions,
                ]}
                value={oprater}
                onChange={handleOPChange}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <DropSearch
              placeholder="Select UserType"
              options={[
                { showvalue: "Select UserType", value: undefined },
                { showvalue: "admin", value: "admin" },
                {
                  showvalue: "Master Distributor",
                  value: "masterdistributor",
                },
                { showvalue: "Distributor", value: "distributor" },
                { showvalue: "Retailer", value: "retailer" },
                { showvalue: "Api User", value: "apiuser" },

                { showvalue: "Referal", value: "Referal" },
              ]}
              value={userType}
              name="userType"
              onchange={handleUserTypeChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <DropSearch
              value={commType}
              onchange={(val) => setCommType(val)}
              placeholder="Select Commission Type"
              options={[
                { showvalue: "Select CommType", value: "" },
                { showvalue: "Commission", value: "commission" },
                {
                  showvalue: "Surcharge",
                  value: "Surcharge",
                },
              ]}
              error={""}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-5">
            <DropSearch
              value={payType}
              onchange={(val) => setPayType(val)}
              placeholder="Select Payment Type"
              options={[
                { showvalue: "Select PaymentType", value: "" },
                { showvalue: "Precentage", value: "precentage" },
                {
                  showvalue: "Rupee",
                  value: "rupee",
                },
              ]}
              error={""}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-5">
            <TextInput
              name={"refValue"}
              isModel={true}
              label="Ref Value"
              onChange={setRefValue}
              value={refVal}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2 mt-5">
          {userType == "masterdistributor" && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0">
              <TextInput
                name={"commMDDistributor"}
                isModel={true}
                label="Master distributor Commission"
                onChange={setMDistributorValue}
                value={mdistributorValue}
              />
            </div>
          )}
          {(userType == "masterdistributor" || userType == "distributor") && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0">
              <TextInput
                name={"commDistributor"}
                isModel={true}
                label="Distributor Commission"
                onChange={setDistributorValue}
                value={distributorValue}
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          {userType == "apiuser" && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0">
              <TextInput
                name={"apiUser"}
                isModel={true}
                label="Api User Commission"
                onChange={setApiValue}
                value={apiValue}
              />
            </div>
          )}
          {(userType == "masterdistributor" ||
            userType == "retailer" ||
            userType == "distributor") && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0 mt-3">
              <TextInput
                name={"commRetailer"}
                isModel={true}
                label="Retailer Commission"
                onChange={setRetailerValue}
                value={retailerValue}
              />
            </div>
          )}
          {(userType == "masterdistributor" ||
            userType == "retailer" ||
            userType == "distributor") && (
            <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0 mt-3">
              <DropSearch
                value={retailercommType}
                onchange={(val) => setretailercommType(val)}
                placeholder="Select Retaier Commission Type"
                options={[
                  { showvalue: "Commission", value: "commission" },
                  {
                    showvalue: "Surcharge",
                    value: "Surcharge",
                  },
                ]}
                error={""}
              />
            </div>
          )}
          <div className="flex items-center w-1/2 mt-8 ml-5">
            <div className="flex gap-2 items-center">
              <span>TDS : </span>

              <Switch
                checked={tds}
                onChange={() => setTds(!tds)}
                inputProps={{ "aria-label": "status switch" }}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: tds ? "green" : "red",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: tds ? "green" : "red",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: tds ? "green" : "red",
                  },
                }}
              />
            </div>
            <div className="flex gap-2 items-center">
              <span>GST : </span>

              <Switch
                checked={gst}
                onChange={() => setGst(!gst)}
                inputProps={{ "aria-label": "status switch" }}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: gst ? "green" : "red",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: gst ? "green" : "red",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: gst ? "green" : "red",
                  },
                }}
              />
            </div>
            <div className="flex gap-2 items-center">
              <span>CCF : </span>

              <Switch
                checked={ccf}
                onChange={() => setCcf(!ccf)}
                inputProps={{ "aria-label": "status switch" }}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: ccf ? "green" : "red",
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: ccf ? "green" : "red",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: ccf ? "green" : "red",
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-around">
          <ButtonLabel
            label={`Upadate Commission`}
            onClick={HandleBulkUpdate}
          />
          <ButtonLabel label="Cancel" veriant={"outline"} onClick={reset} />
        </div>
      </Popup>
    </DefaultLayout>
  );
};

export default Commission;
