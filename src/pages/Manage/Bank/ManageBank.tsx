import { useQuery } from "@tanstack/react-query";
import DefaultLayout from "../../../layout/DefaultLayout";
import { editBank, getBankList } from "../../../Services/commonService";
import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import { BsPencil, BsTrash } from "react-icons/bs";
import { apiUrl } from "../../../Utills/constantt";
import BasicTable from "../../../components/BasicTable/BasicTable";
import Popup from "../../../components/Model/Model";
import { TextField } from "@mui/material";
import FileUpload from "../../../components/FileUpload/FileUpload";
import { ButtonLabel } from "../../../components/Button/Button";

const ManageBank = () => {
  const [Loading, setLoading] = useState(false);
  const [bankId, setBankId] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [deletId, setDeleteId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [bank_id, setBank_id] = useState("");
  const [iinno, setIinno] = useState("");
  const [shortname, setShortName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);
  const columns = [
    {
      header: "bank Id",
      accessorKey: "bankId",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Short Name",
      accessorKey: "shortname",
    },
    {
      header: "icon",
      accessorKey: "icon",
      cell: (row: any) => (
        <div className="flex justify-center">
          <span className="h-6 w-6 rounded-full">
            <img
              crossOrigin="anonymous"
              className="rounded-full"
              height={40}
              width={40}
              src={`${apiUrl}/uploads/bank/${row.row.original.icon}`}
              alt="User"
            />
          </span>
        </div>
      ),
    },
    {
      header: "Ifsc Code",
      accessorKey: "ifscGlobal",
    },
    {
      header: "DMT BankID",
      accessorKey: "bank_Id",
    },
    {
      header: "Iinno",
      accessorKey: "iinno",
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
    setDeleteId(id);
    setShowModal(true);
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["categorys"],
    queryFn: async () => {
      try {
        const response = await getBankList();

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
      setLoading(false);
      toast.error("Something went wrong!");
    }
  }

  const handleOpenEdit = async (data: any) => {
    try {
      setBank_id(data.bank_Id);
      setShortName(data.shortname);
      setIinno(data.iinno);
      setBankId(data.id);
      setIsEdit(true);

      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  function handleFileChange(e: any) {
    setImageFile(e.target.files[0]);
  }

  async function handleEditBank() {
    setLoading(true);
    const formData = new FormData();
    formData.append("shortname", shortname);
    formData.append("id", bankId);
    formData.append("bank_Id", bank_id);

    formData.append("iinno", iinno);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await editBank(formData);
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
    setShortName("");
    setImageFile(null);
  }
  return (
    <DefaultLayout isList={true}>
      {data && (
        <BasicTable data={data} columns={columns} actions={""} filter={[]} />
      )}

      <Popup title={"Edit Bank"} isOpen={isOpen} onClose={closePopup}>
        <div className="flex flex-col gap-3">
          <TextField
            size="small"
            label="Shortname"
            placeholder="Enter short name"
            fullWidth
            onChange={(e) => setShortName(e.target.value)}
            value={shortname}
          />
          <TextField
            size="small"
            label="Bank ID"
            placeholder="Enter Bank ID"
            fullWidth
            onChange={(e) => setBank_id(e.target.value)}
            value={bank_id}
          />
          <TextField
            size="small"
            label="Iinno"
            placeholder="Enter iinno name"
            fullWidth
            onChange={(e) => setIinno(e.target.value)}
            value={iinno}
          />
          <div className="mb-6">
            <FileUpload onChange={handleFileChange} />
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <ButtonLabel onClick={handleEditBank} label="Edit Bank" />

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

export default ManageBank;
