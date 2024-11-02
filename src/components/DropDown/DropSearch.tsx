import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CircularProgress, FormControl } from "@mui/material";

interface SearchDropDownProps<O extends { value: string; showvalue: string }> {
  value?: string | null;
  onchange: (value: string | null) => void;
  options: O[];
  placeholder?: string;
  error: any;
  isFilter?: boolean;
  isLoading?: boolean;
  drop?: number;
  place2?: string;
}

export const DropSearch = <O extends { value: string; showvalue: string }>(
  props: SearchDropDownProps<O>
) => {
  const {
    value,
    onchange,
    options,
    placeholder,
    error,
    isLoading = false,
    isFilter = false,
    drop = 0,
    place2 = undefined,
  } = props;

  return (
    <div className="w-full">
      <FormControl fullWidth className="bg-white">
        <Autocomplete
          loading={isLoading}
          disabled={isLoading}
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
            isFilter
              ? onchange(
                  place2 ? place2 : placeholder,
                  newValue ? newValue.value : null,
                  drop
                )
              : onchange(newValue ? newValue.value : null);
          }}
          id="controllable-states-demo"
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={placeholder}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            <span className="font-medium">{error}</span>
          </p>
        )}
      </FormControl>
    </div>
  );
};
