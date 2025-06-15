import BasicTable from "../../components/BasicTable/BasicTable";
import { FcApproval } from "react-icons/fc";
import { useState } from "react";
import DocumentViewer from "../../components/DocumentViewer/DocumentViewer";
import TextInput from "../../components/Input/TextInput";
import { useQuery } from "@tanstack/react-query";
import {
  addUserKyc,
  getUserKyc,
  getUserKycFiles,
  updateKycStatus,
  uploadDoc,
} from "../../Services/Axios/UserService";
import Popup from "../../components/Model/Model";
import { ButtonLabel } from "../../components/Button/Button";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { MdOutlineVerifiedUser, MdVerified } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
import { validatePanCard, validateVoterID } from "../../Services/AuthServices";
import {
  JsonView,
  allExpanded,
  darkStyles,
  defaultStyles,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import AuthModel from "../../Auth/AuthModel";
import EycAuthModel from "../../Auth/EkycAuth";
type Document = {
  id: number;
  doctype: string;
  status: string;
  comments: string;
  document: string;
};

const KycEdit = ({ userid }) => {
  const [open, setOpen] = useState(false);
  const [kycData, setKycData] = useState<Document[]>([]);
  const [verification, setVerification] = useState("");
  const [documentPath, setDocumentPath] = useState("");
  const [selectedId, setSelectedID] = useState(null);
  const [openAction, setOpenAction] = useState(false);
  const [openEkyc, setOpenEkyc] = useState(false);
  const [openRes, setOpenRes] = useState(false);
  const [reason, setReason] = useState("");
  const [docNumber, SetDocNumber] = useState("");
  const [json, setJson] = useState("");
  const [aadharKyc, setAdharKyc] = useState(false);
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
          toast.success("Document uploaded successfully.");
          refetch();
        }
      };
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  async function handleEkycUpdate(doc, docNumber, resp) {
    try {
      await addUserKyc({
        userId: userid,
        kycJson: [
          { doctype: doc, ekycStatus: true, ekycRes: resp, docNo: docNumber },
        ],
      });
      refetch();
    } catch (error) {}
  }

  async function updateKycFinalStatus(status: string) {
    try {
      await updateKycStatus({
        userId: userid,
        status: status,
      });
      refetch();
    } catch (error) {}
  }

  function handleShowRes(resp) {
    setOpenRes(true);
    setJson(JSON.stringify(resp));
  }
  const actions = [
    {
      label: "Approve/Reject",
      onClick: (row: any) => actionHandler(row),
      icon: <FcApproval fontSize={18} />,
    },
  ];

  const showNameDoc: any = {
    aadharFrontCard: "Aadhaar Front Card",
    aadharBackCard: "Aadhaar Back Card",
    panCard: "Pan Card",
    gstRegistrations: "GST Registrations",
    cancelCaque: "Cancel Cheque",
    passport: "Passport",
    voterId: "Voter Id",
    photograph: "Photograph",
    drivingLicense: "Driving License",
    shopPhotos: "Shop Photo",
    selfVideo: "Self Video",
  };

  const columns = [
    {
      header: "Document Type",
      accessorKey: "doctype",
      maxSsize: 20,
      cell: (row: any) => (
        <div>
          <span className="inline-flex items-center text-l font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            {showNameDoc[row.row.original.doctype]}
          </span>
        </div>
      ),
    },
    {
      header: "Document Number",
      accessorKey: "doctype",
      maxSize: 150,
      cell: (row: any) => {
        return row.row.original.ekycStatus ? (
          <div className="flex items-center gap-1">
            <span className="font-bold">{row.row.original.docNo}</span>
            <MdVerified color="#17D50D" />
            <span onClick={() => handleShowRes(row.row.original.ekycRes)}>
              <FaEye />
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span
              className="text-primary text-lg"
              onClick={() => handleEkycVerification(row.row.original.doctype)}
            >
              Verify
            </span>
          </div>
        );
      },
    },
    {
      header: "Document",
      accessorKey: "document",
      size: 100,
      cell: (row: any) => {
        const documentList = row.row.original.document.split(", ");
        console.log(documentList);

        return (
          <div>
            {documentList[0] != "" && row.row.original.status != "rejected" ? (
              documentList.map(
                (document: any, index: any) =>
                  row.row.original.status != "rejected" && (
                    <div
                      onClick={() => handleOpenDocument(document)}
                      className="flex gap-2 items-center"
                    >
                      {document && (
                        <div>
                          <img
                            crossOrigin="anonymous"
                            height={20}
                            width={25}
                            src={document}
                            alt="preview"
                          />
                        </div>
                      )}
                      <div>
                        {document.split("/").pop().slice(0, 10) + "..."}
                      </div>
                    </div>
                  )
              )
            ) : (
              <div
                className="w-full"
                onClick={() => handleUpload(row.row.original.doctype)}
              >
                <div className="relative ">
                  <label
                    title="Click to upload"
                    htmlFor="button2"
                    className="cursor-pointer flex items-center gap-1 px-6 py-2 before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-3xl before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105  active:duration-75 active:before:scale-95"
                  >
                    <div className="relative">
                      <img
                        className=""
                        src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
                        alt="file upload icon"
                        width="25"
                        height="25"
                      />
                    </div>
                    <div className="relative">
                      <span className="block text-base font-semibold relative text-blue-900 group-hover:text-blue-500">
                        Upload
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 20,
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
      header: "Comments",
      accessorKey: "comments",
    },
  ];

  const { refetch } = useQuery({
    queryKey: ["userkyc"],
    queryFn: async () => {
      const response = await getUserKyc(userid);
      const filesData = await getUserKycFiles(userid);

      let kycData: {
        status: string;
        doctype: string;
        comment: string;
        ekycStatus: boolean;
        ekycRes: any;
        docNo: any;
      }[];
      if (response.userKycDetails.length > 0) {
        kycData = JSON.parse(response.userKycDetails[0].kycJson);
      }
      setVerification(response?.userKycDetails[0]?.kycStatus);
      const documentMap = new Map<string, Document>();
      const documentList = [
        "aadharFrontCard",
        "aadharBackCard",
        "panCard",
        "gstRegistrations",
        "cancelCaque",
        "passport",
        "voterId",
        "photograph",
        "drivingLicense",
        "shopPhotos",
        "selfVideo",
      ];
      documentList.forEach((key: string) => {
        const statusObject = kycData?.find((status) => status.doctype === key);
        const status: string = statusObject ? statusObject.status : "";
        const comment: string = statusObject ? statusObject.comment : "";
        const ekycStatus: boolean = statusObject
          ? statusObject.ekycStatus
          : false;

        const ekycRes: any = statusObject ? statusObject.ekycRes : "";

        const docNo: any = statusObject ? statusObject.docNo : "";

        const files: string[] = filesData[key] || [];
        const id = documentMap.size + 1;
        const document: string = files.join(", ");
        documentMap.set(key, {
          id: id,
          doctype: key,
          status: status,
          comments: comment,
          document: document,
          ekycStatus: ekycStatus,
          ekycRes: ekycRes,
          docNo: docNo,
        });
      });
      debugger;
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

  const handleEkycVerification = (doctype: string) => {
    setSelectedID(doctype);
    if (doctype == "aadharCard") {
      setAdharKyc(true);
    } else {
      setOpenEkyc(true);
    }
  };

  const OnValidateEyc = async () => {
    if (!selectedId) return;
    if (!docNumber) {
      toast.error("please enter document number!");
      return;
    }
    try {
      if (selectedId == "panCard") {
        const data = await validatePanCard(docNumber);
        await handleEkycUpdate(selectedId, docNumber, data);
      } else if (selectedId == "voterId") {
        const data = await validateVoterID(docNumber);
        await handleEkycUpdate(selectedId, docNumber, data);
      } else {
        toast.error("api not given.");
        setOpenEkyc(false);
        return;
      }

      toast.success("Document verified successfully.");
      setOpenEkyc(false);
      setSelectedID(null);
      SetDocNumber("");
    } catch (error) {
      console.log(error);
      setOpenEkyc(false);
      setSelectedID(null);
      SetDocNumber("");
      toast.error(`${error || "Unable to validate the document!"}`);
    }
  };

  const isAdmin = true;

  return (
    <div className="!w-full ">
      <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-between md:space-x-3 flex-shrink-0 mb-2">
        <div className="gap-2">
          <ButtonLabel
            type="button"
            onClick={() => updateKycFinalStatus("1stverifed")}
            label="Complete 1st level verification"
          />
          {isAdmin && (
            <ButtonLabel
              type="button"
              style={{ marginLeft: "4px" }}
              onClick={() => updateKycFinalStatus("2ndverifed")}
              label="Complete 2nd level verification"
            />
          )}
        </div>
        <div className="flex">
          <span>KYC Status:</span>
          {verification === "1stverifed" && (
            <div className="flex flex-column">
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                {"1st Level Verified "}
              </span>
              <span className="inline-flex items-center bg-orange-100 text-orange-500 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-500">
                <span className="w-2 h-2 me-1 bg-orange-500 rounded-full"></span>
                2nd Level pending
              </span>
            </div>
          )}

          {verification === "2ndverifed" && (
            <div className="flex flex-column">
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                {"1st Level Verified "}
              </span>
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                2nd Level Verified
              </span>
            </div>
          )}

          {!verification && (
            <span className="inline-flex items-center bg-orange-100 text-orange-500 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-500">
              <span className="w-2 h-2 me-1 bg-orange-500 rounded-full"></span>
              1st level pending
            </span>
          )}
        </div>
      </div>
      <BasicTable
        data={kycData}
        columns={columns}
        actions={actions}
        isFilters={false}
        isSeachable={false}
      />
      <DocumentViewer
        path={documentPath}
        open={open}
        onClose={handleCloseDialog}
      />
      {openAction && (
        <Popup
          title={"Approve/Reject"}
          isOpen={openAction}
          onClose={() => setOpenAction(false)}
        >
          <div className="">
            <div className="mb-10">
              <TextInput
                name="comment"
                label="Comment"
                onChange={setReason}
                isModel
              />
            </div>

            <div className="flex justify-around gap-2">
              <ButtonLabel
                type="button"
                style={{ backgroundColor: "#22C55E" }}
                onClick={() => onUpdateStatus("approved")}
                label="approved"
              />
              <ButtonLabel
                type="button"
                style={{ backgroundColor: "red" }}
                onClick={() => onUpdateStatus("rejected")}
                label="rejected"
              />
            </div>
          </div>
        </Popup>
      )}

      {openEkyc && (
        <Popup
          title={"EKYC"}
          isOpen={openEkyc}
          onClose={() => setOpenEkyc(false)}
        >
          <div className="">
            <div className="mb-10">
              <TextInput
                name="Document No."
                label="Document No."
                onChange={SetDocNumber}
                isModel
              />
            </div>

            <div className="flex justify-around gap-2">
              <ButtonLabel
                type="button"
                onClick={() => OnValidateEyc()}
                label="Verify"
              />
              <ButtonLabel
                type="button"
                veriant={"outline"}
                onClick={() => setOpenEkyc(false)}
                label="Cancel"
              />
            </div>
          </div>
        </Popup>
      )}

      {openRes && (
        <Popup
          title={"EKYC"}
          isOpen={openRes}
          onClose={() => setOpenRes(false)}
        >
          <div className="max-h-100 overflow-y-auto">
            <JsonView
              data={json}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          </div>
        </Popup>
      )}

      {aadharKyc && (
        <EycAuthModel
          open={aadharKyc}
          setOpen={setAdharKyc}
          handleEkycUpdate={handleEkycUpdate}
          selectedID={selectedId}
          setSelectedID={setSelectedID}
        />
      )}
    </div>
  );
};

export default KycEdit;
