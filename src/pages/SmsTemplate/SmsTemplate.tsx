import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import Popup from "../../components/Model/Model";
import TextInput from "../../components/Input/TextInput";
import { ButtonLabel } from "../../components/Button/Button";
import {
  addTemplate,
  getAllTemplate,
  getTemplate,
  deleteTemplate,
  updateTemplate,
} from "../../Services/smsTemplateService";
import {toast } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";
import Loader from "../../common/Loader";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import Switch from "@mui/material/Switch";
import { BsPencil, BsTrash } from "react-icons/bs";
import TextField from "@mui/material/TextField";
const SmsTemplate = () => {
  const columns = [
    {
      header: "sno",
      accessorKey: "sno",
      size: 50,
    },
    {
      header: "Sms Type",
      accessorKey: "smsType",
    },
    {
      header: "Sms Format",
      accessorKey: "smsFormat",
      size: 200,
    },
    {
      header: "Template Id",
      accessorKey: "tempId",
      size: 250,
    },
    {
      header: "Email Format",
      accessorKey: "emailFormat",
    },
    {
      header: "Sms Status",
      accessorKey: "sms_status",
      cell: (row: any) => (
        <Switch
          checked={row.row.original.sms_status == "1"}
          onChange={async (e) => {
            const newValue = e.target.checked ? "1" : ")";
            try {
              await updateTemplate(
                { sms_status: newValue },
                row.row.original.sno
              );
              toast.success("Template updated successfully.");
              refetch();
            } catch (error) {
              toast.error("Something went wrong.");
            }
          }}
          inputProps={{ "aria-label": "status switch" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: row.row.original.sms_status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor:
                row.row.original.sms_status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-track": {
              backgroundColor:
                row.row.original.sms_status == "1" ? "green" : "red",
            },
          }}
        />
      ),
    },
    {
      header: "Wathsapp Status",
      accessorKey: "whatsapp_status",
      cell: (row: any) => (
        <Switch
          checked={row.row.original.whatsapp_status == "1"}
          onChange={async (e) => {
            const newValue = e.target.checked ? "1" : ")";
            try {
              await updateTemplate(
                { whatsapp_status: newValue },
                row.row.original.sno
              );
              toast.success("Template updated successfully.");
              refetch();
            } catch (error) {
              toast.error("Something went wrong.");
            }
          }}
          inputProps={{ "aria-label": "status switch" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: row.row.original.whatsapp_status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor:
                row.row.original.whatsapp_status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-track": {
              backgroundColor:
                row.row.original.whatsapp_status == "1" ? "green" : "red",
            },
          }}
        />
      ),
    },
    {
      header: "Email Status",
      accessorKey: "email_status",
      cell: (row: any) => (
        <Switch
          checked={row.row.original.email_status == "1"}
          onChange={async (e) => {
            const newValue = e.target.checked ? "1" : ")";
            try {
              await updateTemplate(
                { email_status: newValue },
                row.row.original.sno
              );
              toast.success("Template updated successfully.");
              refetch();
            } catch (error) {
              toast.error("Something went wrong.");
            }
          }}
          inputProps={{ "aria-label": "status switch" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: row.row.original.email_status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-thumb": {
              backgroundColor:
                row.row.original.email_status == "1" ? "green" : "red",
            },
            "& .MuiSwitch-track": {
              backgroundColor:
                row.row.original.email_status == "1" ? "green" : "red",
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
              onClick={() => handleOpenEdit(row.row.original.sno)}
            />
          </div>
          <div className="cursor-pointer" title="Delete Template">
            <BsTrash
              fontSize={18}
              color="red"
              onClick={() => setShowModal(true)}
            />
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <p>
                  <b>Are you sure you want to delete this Template?</b>
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      setShowModal(false);
                      handleDeleteTemplate(row.row.original.apiId);
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
  const [sno, setSno] = useState("");
  const [smsType, setSmsType] = useState("");
  const [smsFormat, setSmsFormat] = useState("");
  const [tempId, setTempId] = useState("");
  const [emailFormat, setEmailFormat] = useState("");
  const [Loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  async function handleAddTemplate() {
    const emptyFields = [];
    setLoading(true);
    if (!smsType) emptyFields.push("SMS Type");
    if (!smsFormat) emptyFields.push("SMS Format");
    if (!tempId) emptyFields.push("Template Id");
    if (!emailFormat) emptyFields.push("Email Format");
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
      setLoading(false);
      return;
    }

    try {
      const _data = {
        sno: sno,
        smsType: smsType,
        smsFormat: smsFormat,
        tempId: tempId,
        emailFormat: emailFormat,
      };
      await addTemplate(_data);
      toast.success("Template added successfully.");
      refetch();
      closePopup();
      reset();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteTemplate(id: string) {
    try {
      setLoading(true);
      await deleteTemplate(id);
      refetch();
      toast.success("Template Successfully deleted.");
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

  const handleOpenEdit = async (id: string) => {
    try {
      setSno(id);
      let _data = await getTemplate(id);
      setIsEdit(true);
      if (_data.template.length > 0) {
        setSmsFormat(_data.template[0].smsFormat);
        setSmsType(_data.template[0].smsType);
        setEmailFormat(_data.template[0].emailFormat);
        setTempId(_data.template[0].tempId);
      }
      openPopup();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  async function reset() {
    setIsEdit(false);
    setEmailFormat("");
    setSmsFormat("");
    setSmsType("");
    setTempId("");
    setSno("");
  }

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["Apis"],
    queryFn: async () => {
      try {
        const response = await getAllTemplate();
        const apiData = response.templates;
        return apiData;
      } catch (error: any) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    },
    refetchOnWindowFocus: true,
  });
  if (isLoading) return <Loader />;
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
            label="Add Template"
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
        title={isEdit ? "Edit Api" : "Add Api"}
        isOpen={isOpen}
        onClose={closePopup}
      >
        <div className="">
          <div className="mb-6">
            <TextInput
              label="Template Name"
              value={smsType}
              onChange={setSmsType}
            />
          </div>
          <div className="mb-6">
            <TextField
              id="outlined-multiline-static"
              label="Sms Format"
              multiline
              fullWidth
              value={smsFormat}
              onChange={(e) => setSmsFormat(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <TextInput
              label="Template Id"
              value={tempId}
              onChange={setTempId}
            />
          </div>
          <div className="mb-6">
            <TextField
              id="outlined-multiline-static"
              label="Email Format"
              multiline
              fullWidth
              value={emailFormat}
              onChange={(e) => setEmailFormat(e.target.value)}
            />
          </div>

          <div className="flex justify-between mt-10">
            {isEdit ? (
              <ButtonLabel
                onClick={handleAddTemplate}
                disabled={Loading}
                loader={Loading}
                label="Edit Template"
              />
            ) : (
              <ButtonLabel
                onClick={handleAddTemplate}
                disabled={Loading}
                loader={Loading}
                label="Add Template"
              />
            )}
            <ButtonLabel
              style={{ backgroundColor: "red" }}
              onClick={handleClose}
              disabled={Loading}
              loader={Loading}
              label="Close"
            />
          </div>
        </div>
      </Popup>
    </DefaultLayout>
  );
};

export default SmsTemplate;
