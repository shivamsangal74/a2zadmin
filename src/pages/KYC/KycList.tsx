import DefaultLayout from "../../layout/DefaultLayout";
import BasicTable from "../../components/BasicTable/BasicTable";
import { FcApproval } from "react-icons/fc";
import { useParams } from "react-router-dom";
import { useState } from "react";
import DocumentViewer from "../../components/DocumentViewer/DocumentViewer";
import TextInput from "../../components/Input/TextInput";
import { useQuery } from "@tanstack/react-query";
import {
  addUserKyc,
  getUserKyc,
  getUserKycFiles,
  uploadDoc,
} from "../../Services/Axios/UserService";
import { FaCloudUploadAlt } from "react-icons/fa";

type Document = {
  id: number;
  doctype: string;
  status: string;
  comments: string;
  document: string;
};

const KycList = () => {
  const { userid } = useParams();
  const [open, setOpen] = useState(false);
  const [kycData, setKycData] = useState<Document[]>([]);
  const [documentPath, setDocumentPath] = useState("");
  const [selectedId, setSelectedID] = useState(null);
  const [openAction, setOpenAction] = useState(false);
  const [reason, setReason] = useState("");

  function actionHandler(row: any) {
    setOpenAction(true);
    setSelectedID(row.row.original.doctype);
  }
  const handleUpload = async (doctype: string) => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = true;
      fileInput.click();

      fileInput.onchange = async (event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("files", file);
        if (userid) {
          const response = await uploadDoc(userid, doctype, formData);
          refetch();
        }
      };
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const actions = [
    {
      label: "Approve/Reject",
      onClick: (row: any) => actionHandler(row),
      icon: <FcApproval fontSize={18} />,
    },
  ];

  const columns = [
    // {
    //   header: "ID",
    //   accessorKey: "id",
    // },
    {
      Header: "Document",
      accessorKey: "doctype",
      size: 20,
    },
    {
      Header: "Document",
      accessorKey: "document",
      cell: (row: any) => {
        const documentList = row.row.original.document.split(", ");
        return (
          <div>
            {documentList.map((document: any, index: any) => (
              <div onClick={() => handleOpenDocument(document)}>{document}</div>
            ))}
            {documentList[0] == "" && (
              <FaCloudUploadAlt
                onClick={() => handleUpload(row.row.original.doctype)}
              />
            )}
          </div>
        );
      },
    },
    {
      Header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <div>
          {row.row.original.status === "approved" && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
              {row.row.original.status}
            </span>
          )}

          {row.row.original.status === "rejected" && (
            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
              <span className="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
              {row.row.original.status}
            </span>
          )}

          {row.row.original.status === "pending" && (
            <span className="inline-flex items-center bg-orange-100 text-orange-500 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-500">
              <span className="w-2 h-2 me-1 bg-orange-500 rounded-full"></span>
              {row.row.original.status}
            </span>
          )}
        </div>
      ),
    },
    {
      Header: "Comments",
      accessorKey: "comments",
    },
  ];

  const { refetch } = useQuery({
    queryKey: ["userkyc"],
    queryFn: async () => {
      const response = await getUserKyc(userid);
      const filesData = await getUserKycFiles(userid);
      let kycData: { status: string; doctype: string; comment: string }[];
      if (response.userKycDetails.length > 0) {
        kycData = response.userKycDetails[0].kycJson;
      }
      const documentMap = new Map<string, Document>();
      const documentList = [
        "aadharCard",
        "panCard",
        "gstRegistrations",
        "cancelCaque",
        "passport",
        "voterId",
        "photograph",
        "drivingLicense",
      ];
      documentList.forEach((key: string) => {
        const statusObject = kycData?.find((status) => status.doctype === key);
        const status: string = statusObject ? statusObject.status : "";
        const comment: string = statusObject ? statusObject.comment : "";

        const files: string[] = filesData[key] || [];
        const id = documentMap.size + 1;
        const document: string = files.join(", ");
        documentMap.set(key, {
          id: id,
          doctype: key,
          status: status,
          comments: comment,
          document: document,
        });
      });
      const mappedData: Document[] = Array.from(documentMap.values());
      setKycData(mappedData);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleOpenDocument = (path: string) => {
    setDocumentPath(path);
    setOpen(true);
  };

  async function onUpdateStatus(action: string) {
    console.log(action, selectedId, reason, userid);
    try {
      await addUserKyc({
        userId: userid,
        kycJson: [{ doctype: selectedId, status: action, comment: reason }],
      });
      refetch();
    } catch (error) {}

    setOpenAction(false);
    setReason("");
    setSelectedID(null);
  }

  const handleCloseDialog = () => {
    setOpen(false);
  };
  return (
    <DefaultLayout>
      <div>
        <BasicTable
          data={kycData}
          columns={columns}
          actions={actions}
          isFilters={false}
        />
        <DocumentViewer
          path={documentPath}
          open={open}
          onClose={handleCloseDialog}
        />
        {openAction && (
          <div
            id="popup-modal"
            tabIndex={-1}
            className="absolute overflow-y-auto overflow-x-hidden top-60 right-0 left-80 z-999  w-full  max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  onClick={() => setOpenAction(false)}
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span
                    className="sr-only"
                    onClick={() => setOpenAction(false)}
                  >
                    Close modal
                  </span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <svg
                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span>Please Add comment here.</span>
                  <div className="m-4">
                    <TextInput
                      name="comment"
                      label="Comment"
                      onChange={setReason}
                      isModel
                    />
                  </div>
                  <div className="flex justify-around ">
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                      onClick={() => onUpdateStatus("rejected")}
                    >
                      Reject
                    </button>
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                      onClick={() => onUpdateStatus("approved")}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default KycList;
