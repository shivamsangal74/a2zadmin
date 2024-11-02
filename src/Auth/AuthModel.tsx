import { useState } from "react";
import TextInput from "../components/Input/TextInput";
import TwoFacterAuth from "../components/2FA/2FA";
import { validateAadhar, generateAddress } from "../Utills/Utility";
import { generateOTP, validateOTP } from "../Services/AuthServices";
import { ButtonLabel } from "../components/Button/Button";
import ButtonOutline from "../components/Button/ButtonOutline";
interface AuthModel {
  setOpen: any;
  open: boolean;
  setAadharData: any;
}

const AuthModel: React.FC<AuthModel> = ({
  open,
  setOpen,
  validateOtp,
  reqID,
}) => {
  function handleCancel() {
    setOpen(false);
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
                <TwoFacterAuth
                  onSubmit={validateOtp}
                  codeLength={6}
                  reqID={reqID}
                  cancelButtonAction={handleCancel}
                />

               
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModel;
