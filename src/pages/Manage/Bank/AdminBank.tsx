import { useQuery } from "@tanstack/react-query";
import DefaultLayout from "../../../layout/DefaultLayout";
import {
  getAdminBankList,
  getModes,
  saveAdminBankList,
} from "../../../Services/commonService";
import { useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import { BsPencil, BsTrash } from "react-icons/bs";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import { ButtonLabel } from "../../../components/Button/Button";
import TextInput from "../../../components/Input/TextInput";
import DropDownCheakBox from "../../../components/DropDown/DropDownCheakBox";
import { getFundsOn } from "../../../Services/categoryServices";

const AdminBank = () => {
  const [Loading, setLoading] = useState(false);
  const [bankId, setBankId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [fund, setFund] = useState<any[] | null>(null);
  const [selectedFund, setSelectedfund] = useState(0);
  const [commissionData, setCommissionData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [bankName, setbankName] = useState("");
  const [AcNo, setAcNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [AcName, setAcName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  const columns = [
    {
      header: "Bank Id",
      accessorKey: "id",
    },
    {
      header: "Bank Name",
      accessorKey: "bankName",
    },
    {
      header: "Ifsc Code",
      accessorKey: "ifscCode",
    },
    {
      header: "Ac No",
      accessorKey: "AcNo",
    },
    {
      header: "Ac Name",
      accessorKey: "AcName",
    },
    {
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-2 justify-center">
          <div className="cursor-pointer">
            <BsPencil
              fontSize={18}
              color="blue"
              onClick={() => handleOpenEdit(row.row.original)}
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
                  <b>Are you sure you want to delete this bank?</b>
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

  async function openDeleteModal(id: string) {
    // setDeleteId(id);
    setShowModal(true);
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      try {
        let _dataComm: any = [];
        const response = await getAdminBankList();
        const modeData = await getModes();
        const fundsdata = await getFundsOn();
        if (fundsdata.fund.length > 0) {
          setFund(fundsdata.fund);
        }
        if (modeData.length > 0) {
          modeData.forEach((op: any) => {
            _dataComm.push({
              showvalue: `${op.modeName}`,
              value: op.id,
            });
          });
        }
        setCommissionData(_dataComm);

        return response;
      } catch (error) {
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <Loader />;
  if (error) return toast.error("Unable to fetch banks.");

  async function handleDeleteCategory(id: string) {
    try {
      setLoading(true);
      console.log(id);
      refetch();
      toast.success("Bank Successfully deleted.");
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  const handleOpenEdit = async (data: any) => {
    try {
      setbankName(data.bankName);
      setIfscCode(data.ifscCode);
      setMode(data.mode);
      setAcName(data.AcName);
      setAcNo(data.AcNo);
      setIsEdit(true);
      setSelectedfund(Number(data.fundCode));

      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  const handleFundChange = (event: any) => {
    setSelectedfund(event);
  };
  const handleOpenAdd = async () => {
    try {
      setIfscCode("");
      setbankName("");
      setAcName("");
      setMode("");
      setAcNo("");
      setSelectedfund(0);
      setIsEdit(false);

      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  async function handleMode(values: any) {
    const commaSeparatedValues = values.join(",");
    setMode(commaSeparatedValues);
  }

  async function handleEditBank() {
    setLoading(true);

    try {
      await saveAdminBankList({
        AcName,
        AcNo,
        bankName,
        ifscCode,
        mode,
        fundCode: selectedFund,
      });
      toast.success("Bank updated successfully.");
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
    setbankName("");
    setIfscCode("");
    setAcNo("");
    setSelectedfund(0);
    setAcName("");
  }
  return (
    <DefaultLayout isList={true}>
      <ButtonLabel label="Add Bank" onClick={handleOpenAdd} />
      {data && (
        <BasicTable data={data} columns={columns} actions={""} filter={[]} />
      )}

      <Popup title={"Bank"} isOpen={isOpen} onClose={closePopup}>
        <div className="flex flex-col gap-3">
          <TextInput
            label="BankName"
            placeholder="Enter Bank name"
            onChange={setbankName}
            value={bankName}
          />
          <TextInput
            label="Bank Ifsc"
            placeholder="Enter Ifsc Code"
            onChange={setIfscCode}
            value={ifscCode}
          />
          <TextInput
            label="Bank AcNo"
            placeholder="Enter AcNo"
            onChange={setAcNo}
            value={AcNo}
          />
          <TextInput
            label="Bank Ac Name"
            placeholder="Enter Ac Name"
            onChange={setAcName}
            value={AcName}
          />
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

          <DropDownCheakBox
            label={"Mode"}
            options={[
              { showvalue: "Select All", value: "All" },
              ...commissionData,
            ]}
            value={mode}
            onChange={handleMode}
          />
        </div>

        <div className="flex justify-between mt-10">
          <ButtonLabel onClick={handleEditBank} label="Save Bank" />

          <ButtonLabel
            style={{ backgroundColor: "red" }}
            onClick={closePopup}
            label="Close"
          />
        </div>
      </Popup>
    </DefaultLayout>
  );
};

export default AdminBank;
