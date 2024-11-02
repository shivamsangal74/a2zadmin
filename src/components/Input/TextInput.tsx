import { TextField, FormControl, FormHelperText } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { MdErrorOutline } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { VscVerifiedFilled } from "react-icons/vsc";

type TextInputProps = {
  label: string;
  placeholder?: string;
  error?: string;
  name: string;
  registerAction?: any;
  isModel?: boolean;
  onChange?: (value: string) => void;
  disabledProp?: boolean;
  value?: any;
  Icon?: any;
  type?: "string" | "number" | "password";
  required?: boolean;
  style?: any;
  multiline?: boolean;
  verificationFn?: any;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  name,
  registerAction,
  isModel = false,
  onChange,
  disabledProp,
  placeholder,
  value,
  Icon,
  type = "string",
  required = false,
  style,
  multiline = false,
  verificationFn,
}) => {
  const [isFilled, setIsFilled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value !== "") {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [value]);

  const handleInputChange = (value: any) => {
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
          <TextField
            inputRef={inputRef}
            id="outlined-basic"
            placeholder={placeholder}
            disabled={disabledProp}
            label={label}
            size="small"
            name={name}
            {...registerAction}
            variant="outlined"
            InputLabelProps={{
              className: `block text-black  dark:${
                isModel ? "text-Black" : "text-white"
              } ${required ? "required-label" : ""}`,
            }}
            value={value}
            className="w-full"
            inputProps={{
              className: `bg-slate-50	 border border-gray-300 text-gray-900 text-s rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full !p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500  ${
                !isModel ? "dark:bg-form-input dark:text-white " : ""
              }`,
            }}
            onChange={(e) => handleInputChange(e.target.value)}
            InputProps={{
              startAdornment: Icon && Icon,
              endAdornment: (
                <>
                  {disabledProp && name === "gstin" ? (
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
            multiline={multiline}
            sx={
              label != "Address"
                ? {
                    "& .MuiInputBase-root": {
                      height: 40,
                    },
                  }
                : ""
            }
            type={type}
            required={required}
            error={required && !isFilled}
            style={style}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      </StyledEngineProvider>
    </div>
  );
};

export default TextInput;
