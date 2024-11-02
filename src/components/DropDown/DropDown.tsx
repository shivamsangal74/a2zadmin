import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";
import { FaAsterisk } from "react-icons/fa";

type Option = {
  showvalue: string;
  value: string;
};

type DropDownProps = {
  label: string;
  Options: Option[];
  registerAction?: any;
  error?: any;
  name: string;
  controlProp?: any;
  disabledProp?: boolean;
  isModel?: boolean;
  onChange?: (value: string) => void;
};

const DropDown: React.FC<DropDownProps> = ({
  label,
  registerAction,
  Options,
  error,
  name,
  controlProp,
  disabledProp,
  onChange,
  isModel,
  required=false
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(true);
  return (
    <div>
      <FormControl fullWidth className="bg-white">
        <InputLabel
        size="small"
          id="demo-simple-select-label"
          className={`mb-2.5 block  dark:bg-gray-700 `}
          style={isModel ? { color: "dark:black" } : { color: "dark:white" }}
        >
         <label style={{ display: 'flex' }}>
                      {label} {required && <span style={{ color: required ? 'red' : 'inherit'}}> <FaAsterisk fontSize={8} /> </span>}
                    </label>
        </InputLabel>

        <Controller
          render={({ field }) => (
            <Select
              label={label}
              {...field}
              disabled={disabledProp}
              inputProps={{
                className: `!p-3 dark:bg-gray-700`,
              }}
          size="small"
              
              sx={{
                height: 40,
              }}
              style={
                isModel ? { color: "dark:black" } : { color: "dark:white" }
              }
            >
              {Options.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.value}
                  className={`text-body ${
                    isOptionSelected
                      ? "dark:text-bodydark dark:bg-gray-700 "
                      : ""
                  }`}
                  style={
                    isModel ? { color: "dark:black" } : { color: "dark:white" }
                  }
                >
                  {option.showvalue}
                </MenuItem>
              ))}
            </Select>
          )}
          name={name}
          control={controlProp}
        />
      </FormControl>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{error}</span>
        </p>
      )}
    </div>
  );
};

export default DropDown;
