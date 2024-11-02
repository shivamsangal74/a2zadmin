import { TextField, FormControl, FormHelperText } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { MdErrorOutline } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaAsterisk } from "react-icons/fa";
import { VscVerifiedFilled } from "react-icons/vsc";

type RHFInputProps = {
  label: string;
  placeholder?: string;
  error?: string;
  name: string;
  isModel: boolean;
  onChange?: (value: string) => void;
  disabledProp?: boolean;
  value?: any;
  Icon?: any;
  type?: "string" | "number" | "password";
  required?: boolean; // Add required prop
  style?: any;
  controlProp: any; // Add control prop for React Hook Form
  registerAction?: any;
  verificationFn?: any;
};

const RHFInput: React.FC<RHFInputProps> = ({
  label,
  error,
  name,
  isModel,
  onChange,
  disabledProp,
  placeholder,
  value,
  verificationFn,
  Icon,
  type = "string", // Default to "string"
  required = false, // Default to false
  style,
  controlProp, // Destructure control prop
}) => {
  const [isFilled, setIsFilled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current && inputRef.current.value.trim() !== "") {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [inputRef.current?.value]);
  const handleInputChange = (value: string) => {
    if (type === "number" && isNaN(Number(value))) {
      return;
    }
    if (value.trim() !== "") {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
    if (value.startsWith("-")) {
      return;
    }

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      <StyledEngineProvider>
        <FormControl fullWidth className="bg-white">
          <Controller
            name={name}
            control={controlProp}
            defaultValue=""
            render={({ field }) => (
              <TextField
                inputRef={inputRef}
                id="outlined-basic"
                placeholder={placeholder}
                disabled={disabledProp}
                label={
                  <label style={{ display: "flex" }}>
                    {label}{" "}
                    {required && (
                      <span style={{ color: required ? "red" : "inherit" }}>
                        {" "}
                        <FaAsterisk fontSize={8} />{" "}
                      </span>
                    )}
                  </label>
                }
                {...field} // Pass field props
                variant="outlined"
                InputLabelProps={{
                  className: `block text-black  dark:${
                    isModel ? "text-Black" : "text-white"
                  } ${required ? "required-label" : ""}`,
                }}
                value={field.value} // Use field value instead of value prop
                className="w-full"
                inputProps={{
                  className: `bg-slate-50 border border-gray-300 text-gray-900 text-s rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full !p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500  ${
                    !isModel ? "dark:bg-form-input dark:text-white " : ""
                  }`,
                }}
                onChange={(e) => {
                  if (e.target.name == "aadharNo") {
                    handleInputChange(e.target.value);
                  } else {
                    field.onChange(e); // Trigger onChange from React Hook Form
                  }
                }}
                InputProps={{
                  startAdornment: Icon && Icon,
                  endAdornment: (
                    <>
                      {disabledProp && name === "aadharNo" ? (
                        <>
                          <VscVerifiedFilled color="green" fontSize="24px" />
                        </>
                      ) : (
                        <>
                          {verificationFn && (
                            <span
                              className="text-primary text-sm cursor-pointer"
                              onClick={() => verificationFn()}
                            >
                              Verify
                            </span>
                          )}
                        </>
                      )}
                      {error && (
                        <MdErrorOutline
                          style={{
                            color: "red",
                            height: "15px",
                            width: "15px",
                          }}
                        />
                      )}
                      {isFilled && !error && (
                        <TiTick
                          style={{
                            color: "green",
                            height: "15px",
                            width: "15px",
                          }}
                        />
                      )}
                    </>
                  ),
                }}
                multiline={label === "Address" ? true : false}
                size="small"
                sx={
                  label !== "Address"
                    ? {
                        "& .MuiInputBase-root": {
                          height: 40,
                        },
                      }
                    : {}
                }
                type={type}
                // required={required}
                // error={required && !isFilled}
                style={style}
              />
            )}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      </StyledEngineProvider>
    </div>
  );
};

export default RHFInput;
