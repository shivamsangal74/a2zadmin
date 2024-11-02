import * as React from "react";
import { Controller, Control, Path, FieldValues } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControl } from "@mui/material";
import { FaAsterisk } from "react-icons/fa";

interface SearchDropDown<
  O extends { value: string; showvalue: string },
  TField extends FieldValues
> {
    controlProp: Control<TField>;
  name: Path<TField>;
  options: O[];
  placeholder?: string;
  error: any;
  disabledProp?:boolean
}

export const SearchDropDown = <
  O extends { value: string; showvalue: string },
  TField extends FieldValues
>(
  props: SearchDropDown<O, TField>
) => {
  const { controlProp, options, name,error,disabledProp=false,required=false } = props;
  return (
    <div className="w-full">
      <FormControl fullWidth className="bg-white">

      <Controller
      name={name}
      control={controlProp}
      
      render={({ field }) => {
        const { onChange, value, ref } = field;
        return (
          <>
            <Autocomplete
            disabled={disabledProp}
              value={
                value
                  ? options.find((option) => {
                      return value === option.value;
                    }) ?? null
                  : null
              }
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
              getOptionLabel={(option) => {
                return option.showvalue;
              }}
              onChange={(event: any, newValue) => {
                onChange(newValue ? newValue.value : null);
              }}
              id="controllable-states-demo"
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <label style={{ display: 'flex' }}>
                      {props.placeholder} {required && <span style={{ color: required ? 'red' : 'inherit'}}> <FaAsterisk fontSize={8} /> </span>}
                    </label>
                    }
                  inputRef={ref}
                />
              )}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">{error}</span>
              </p>
            )}
          </>
        );
      }}
    />
      </FormControl>

    </div>
    
  );
};
