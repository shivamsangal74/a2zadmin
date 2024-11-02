import { useState } from "react";
import TextInput from "../components/Input/TextInput";
import TwoFacterAuth from "../components/2FA/2FA";
import { validateAadhar, generateAddress } from "../Utills/Utility.js";
import axios from "axios";
import { generateOTP, validateOTP } from "../Services/AuthServices.js";
import { toast } from "react-toastify";
interface AuthModel {
  setOpen: any;
  open: boolean;
  handleEkycUpdate: any;
  selectedID: any;
  setSelectedID: any;
}

const EycAuthModel: React.FC<AuthModel> = ({
  open,
  setOpen,
  handleEkycUpdate,
  selectedID,
  setSelectedID,
}) => {
  const [isOtpSend, setIsOtopSend] = useState(false);
  const [error, setError] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [reqID, setReqID] = useState("");

  async function validateAndUpdate(code: string) {
    try {
      const res = await validateOTP(code, reqID.toString());
      await handleEkycUpdate(selectedID, aadhar, res);
      setSelectedID(null);
      setReqID("");
      setAadhar("");
      setOpen(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  function handleCancel() {
    setOpen(false);
    setReqID("");
  }

  async function generateAadharOtpHandler() {
    if (!aadhar) return toast.error(`Please enter aadhar number.`);
    try {
      if (validateAadhar(aadhar)) {
        const response = await generateOTP(aadhar);
        setReqID(response.request_id);
        setIsOtopSend(true);
      } else {
        setError("Invalid Aadhar");
      }
    } catch (error) {
      setError("Invalid Aadhar");
    }
  }

  return (
    <>
      {open && (
        <div
          id="authentication-modal"
          tabIndex={-1}
          aria-hidden="true"
          className=" fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                {isOtpSend ? (
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                    Please Enter OTP
                  </h3>
                ) : (
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                    Enter Aadhar Number
                  </h3>
                )}
                <button
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="authentication-modal"
                  onClick={() => setOpen(false)}
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                {isOtpSend ? (
                  <TwoFacterAuth
                    onSubmit={validateAndUpdate}
                    codeLength={6}
                    reqID={reqID}
                    cancelButtonAction={handleCancel}
                  />
                ) : (
                  <form className="space-y-4" action="#">
                    <TextInput
                      label="Aadhar Number"
                      name="Aadhar"
                      isModel={true}
                      onChange={setAadhar}
                      error={error}
                    />
                  </form>
                )}
                <div className="flex justify-between mt-5">
                  {!isOtpSend && (
                    <button
                      onClick={() => setOpen(false)}
                      className="w-half text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Cancel
                    </button>
                  )}
                  {isOtpSend ? (
                    ""
                  ) : (
                    <button
                      className="w-half text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={generateAadharOtpHandler}
                    >
                      Generate OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EycAuthModel;
