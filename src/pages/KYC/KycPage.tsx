import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import userThree from "../../images/icon/verified.gif";
import DefaultLayout from "../../layout/DefaultLayout";
import FileUpload from "../../components/FileUpload/FileUpload";
import { ButtonLabel } from "../../components/Button/Button";
import { toast } from "react-toastify";
import {
  getUserDeatils,
  getUserKyc,
  uploadDoc,
} from "../../Services/Axios/UserService";
import { IoCloudDone } from "react-icons/io5";
import { FaCloudUploadAlt } from "react-icons/fa";
import AuthModel from "../../Auth/AuthModel";
import EditUser from "../EditPage/EditUser";

type DocumentType = "aadharCard" | "panCard" | "gstRegistration" | "other";
type UserType = {
  fullName: string;
  aadharNo: string;
  phoneNumber: string;
  // Add other user properties
};
const KycPage: React.FC = () => {
  const { userid } = useParams();
  const [aadharData, setAadharData] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isEkycVerified, setIsEkycVerified] = useState(false);
  const verified = false;
  const navigate = useNavigate();
  const [files, setFiles] = useState<Record<DocumentType, File[]>>({
    aadharCard: [],
    panCard: [],
    gstRegistration: [],
    other: [],
  });

  const [uploadSuccess, setUploadSuccess] = useState<
    Record<DocumentType, boolean>
  >({
    aadharCard: false,
    panCard: false,
    gstRegistration: false,
    other: false,
  });

  const onFileChange = (docType: DocumentType, fileList: any) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [docType]: [...fileList.target.files],
    }));
  };

  const updateState = (key: any, value: any) => {
    setUploadSuccess((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const fileUploadHandler = async (docType: DocumentType) => {
    const docFiles = files[docType];
    if (!docFiles || docFiles.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const formData = new FormData();
      docFiles.forEach((file) => {
        formData.append("files", file);
      });
      if (userid) {
        await uploadDoc(userid, docType, formData);
        setUploadSuccess((prevSuccess) => ({
          ...prevSuccess,
          [docType]: true,
        }));
        toast.success("Files uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload files");
    }
  };

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const user = await getUserDeatils(userid);
        console.log(user);
        setIsEkycVerified(user.user.ekycStatus);
        setUser(user.user);
        const userKycData = await getUserKyc(userid);
        if (userKycData.userKycDetails.length > 0) {
          const kycJson = userKycData.userKycDetails[0].kycJson;
          kycJson.forEach((kyc: { status: string; doctype: any }) => {
            if (kyc.status === "pending" || kyc.status === "approved") {
              const key = kyc.doctype;
              if (uploadSuccess.hasOwnProperty(key)) {
                updateState(key, true);
              }
            }
          });
        }
      } catch (error) {
        toast("Somthing Went Wrong.");
      }
    }
    fetchUserDetails();
  }, []);

  return (
    <>
      <DefaultLayout>
        <div className="h-full">
          <Breadcrumb pageName="User KYC" />

          {verified ? (
            <div
              className="tab-pane fade active show "
              id="pills-finish"
              role="tabpanel"
              aria-labelledby="pills-finish-tab"
            >
              <div className="row text-center justify-content-center py-4">
                <div className="w-full flex flex-col items-center">
                  <div className="mb-4">
                    <img className="h-20 w-20" src={userThree} alt="" />
                  </div>
                  <h5>Verification Completed</h5>

                  <div className="hstack justify-content-center gap-2">
                    <ButtonLabel
                      label="Back to Users"
                      onClick={() => {
                        navigate("/users/userlist");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {" "}
              <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-2">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        User Information
                      </h3>
                    </div>
                    <div className="p-7">
                      <form action="#">
                        <div className="mb-4 flex items-center gap-3">
                          <div>
                            <div className="flex flex-col gap-2.5">
                              <div>
                                {" "}
                                <span className="font-bold">Name : </span>{" "}
                                <span>{user?.fullName}</span>
                              </div>
                              <div>
                                {" "}
                                <span className="font-bold">
                                  Service :{" "}
                                </span>{" "}
                                <span>Recharge and gateway</span>
                              </div>
                              <div>
                                <span className="font-bold">SponcerId : </span>{" "}
                                <span>{user?.aadharNo}</span>
                              </div>
                              <div>
                                <span className="font-bold">
                                  Mobile Number :{" "}
                                </span>{" "}
                                <span>{user?.phoneNumber}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-10">
                    <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        E-KYC
                      </h3>
                    </div>
                    <div className="p-7">
                      {isEkycVerified ? (
                        <div
                          className="tab-pane fade active show "
                          id="pills-finish"
                          role="tabpanel"
                          aria-labelledby="pills-finish-tab"
                        >
                          <div className="row text-center justify-content-center py-4">
                            <div className="w-full flex flex-col items-center">
                              <div className="mb-4">
                                <img
                                  className="h-20 w-20"
                                  src={userThree}
                                  alt=""
                                />
                              </div>
                              <h5>E-Kyc Already Completed</h5>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="hstack justify-content-center gap-2">
                          <ButtonLabel
                            label="Proceed to EKYC"
                            onClick={() => {
                              setOpen(true);
                            }}
                          />
                        </div>
                      )}
                      {open && (
                        <AuthModel
                          open={open}
                          setAadharData={setAadharData}
                          setOpen={setOpen}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-5 xl:col-span-3">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        Upload Documents
                      </h3>
                    </div>
                    <div className="p-7">
                      {Object.keys(files).map((docType) => (
                        <div
                          key={docType}
                          className="mb-5.5 flex flex-col gap-5.5 sm:flex-row"
                        >
                          <div className="w-full ">
                            <div className="w-full flex gap-10">
                              <div className="w-9/12">
                                <FileUpload
                                  label={docType}
                                  onChange={(fileList: any) =>
                                    onFileChange(
                                      docType as DocumentType,
                                      fileList
                                    )
                                  }
                                  error={undefined}
                                  name={docType}
                                />
                              </div>
                              <div className="w-20 mt-5 text-4xl text-primary">
                                {!uploadSuccess[docType as DocumentType] ? (
                                  <FaCloudUploadAlt
                                    label="Upload"
                                    onClick={() =>
                                      fileUploadHandler(docType as DocumentType)
                                    }
                                  />
                                ) : (
                                  <div className="text-green-500 text-4xl">
                                    <IoCloudDone />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DefaultLayout>
    </>
  );
};

export default KycPage;
