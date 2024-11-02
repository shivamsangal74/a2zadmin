import React, { useState } from "react";
import { ButtonLabel } from "../Button/Button";
import { toast } from "react-toastify";

interface TwoFacterAuthProps {
  onSubmit: (code: string, reqID: string) => void;
  codeLength: number;
  reqID: string;
  cancelButtonAction: any;
}

const TwoFacterAuth: React.FC<TwoFacterAuthProps> = ({
  onSubmit,
  codeLength,
  reqID,
  cancelButtonAction,
}) => {
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(codeLength).fill("")
  );
  const [error, setError] = useState("");

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const { key } = e;
    if (
      !/^[0-9]{1}$/.test(key) &&
      key !== "Backspace" &&
      key !== "Delete" &&
      key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (
      (key === "Delete" || key === "Backspace") &&
      e.currentTarget.value === ""
    ) {
      if (index > 0) {
        e.currentTarget.blur();
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      }
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    if (value) {
      if (index < codeLength - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      } else {
        //  onSubmit(newVerificationCode.join(""),reqID);
      }
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${codeLength}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    const newVerificationCode = [...verificationCode];
    digits.forEach((digit, i) => {
      if (index + i < codeLength) {
        newVerificationCode[index + i] = digit;
      }
    });
    setVerificationCode(newVerificationCode);
    if (index + codeLength <= codeLength) {
      // onSubmit(newVerificationCode.join(""),reqID);
    }
  };

  async function handleValidateOTP() {
    try {
      if (verificationCode.join("").length < 6) {
        toast.error(`Fill Otp please.`);
        return;
      }
      const res = await onSubmit(verificationCode.join(""), reqID);
    } catch (error) {
      setError(`${error}`);
    }
  }

  return (
    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 rounded-xl shadow">
      <header className="mb-8">
        <p className="text-[15px] text-slate-500">
          Enter the {codeLength}-digit verification code that was sent to your
          phone number.
        </p>
      </header>
      <form>
        <div className="flex items-center justify-center gap-3">
          {[...Array(codeLength)].map((_, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              className="w-12 h-12 rounded-lg border-[1.5px] border-stroke text-center border-black text-l font-extrabold text-slate-900 bg-slate-100  border border-indigo-400 border-4 border-solid hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              pattern="\d*"
              maxLength={1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onChange={(e) => handleInput(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              value={verificationCode[index]}
            />
          ))}
        </div>
      </form>
      <div className="text-sm text-slate-500 mt-4">
        Didn't receive code?{" "}
        <a
          className="font-medium text-indigo-500 hover:text-indigo-600"
          href="#0"
        >
          Resend
        </a>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{error}</span>
        </p>
      )}

      <div className="flex justify-between mt-5">
        <ButtonLabel
          onClick={cancelButtonAction}
          label="Cancel"
          type="button"
          veriant={"outline"}
        />
        <ButtonLabel
          onClick={handleValidateOTP}
          label="Verify"
          type="button"
          veriant={"outline"}
        />
      </div>
    </div>
  );
};

export default TwoFacterAuth;
