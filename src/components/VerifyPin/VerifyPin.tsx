import React, { useState } from "react";
import "./VerifyPin.css";
import img from "../../images/lockscreen.jpeg";
const PinInput = ({ length = 4, onComplete }) => {
  const [pin, setPin] = useState(Array(length).fill(""));
  const [isError, setIsError] = useState(false);

  const handleChange = (value, index) => {
    if (value.length > 1) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (isError) {
      setIsError(false);
    }

    if (index < length - 1 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus();
    }

    if (newPin.every((num) => num !== "") && onComplete) {
      const enteredPin = newPin.join("");
      const isMatched = enteredPin === "2211";

      if (isMatched) {
        console.log("matched");
        onComplete(enteredPin);
      } else {
        console.log("not matched");
        setIsError(true);
      }
    }
  };

  const handleBackspace = (e: any, index: any) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  return (
    <div className="backdrop">
      <div className="pin-container">
        <h2 className="font-bold">Enter your 4-digit iPIN to confirm</h2>

      <div className="con">

      <div className="inputCon">
          <div className="pin-inputs">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className={`pin-input ${isError ? "error" : ""}`}
              />
            ))}
          </div>
          <p className="forgot-pin">Forgot iPIN?</p>
        </div>
        {/* <div className="imgCon">
          <img src={img} alt="" srcset="" />
        </div> */}

      </div>
      </div>
    </div>
  );
};
export default PinInput;
