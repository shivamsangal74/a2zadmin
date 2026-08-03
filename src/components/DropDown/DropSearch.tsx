import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CircularProgress, FormControl } from "@mui/material";

interface SearchDropDownProps<O extends { value: string; showvalue: string; image?: string }> {
  value?: string | null;
  onchange: (value: string | null) => void;
  options: O[];
  placeholder?: string;
  error: any;
  isFilter?: boolean;
  isLoading?: boolean;
  drop?: number;
  place2?: string;
  onOpen?: () => void;
  accept?: string;
}

export const DropSearch = <O extends { value: string; showvalue: string; image?: string }>(
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
    onOpen,
  } = props;

  const selectedOption = value ? options.find((o) => o.value === value) ?? null : null;

  return (
    <div className="w-full">
      <FormControl fullWidth className="bg-transparent dark:bg-transparent">
        <Autocomplete
          loading={isLoading}
          disabled={isLoading}
          onOpen={onOpen}
          value={selectedOption}
          size="small"
          sx={{
            "& .MuiInputBase-root": {
              height: 40,
            },
          }}
          getOptionLabel={(option) => option.showvalue}
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
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {option.image && (
                  <img
                    src={option.image}
                    alt={option.showvalue}
                    style={{ width: 22, height: 22, objectFit: "contain", borderRadius: 4, background: "#f3f4f6" }}
                  />
                )}
                <span>{option.showvalue}</span>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: selectedOption?.image ? (
                  <img
                    src={selectedOption.image}
                    alt={selectedOption.showvalue}
                    style={{ width: 20, height: 20, objectFit: "contain", borderRadius: 3, marginRight: 4, background: "#f3f4f6" }}
                  />
                ) : undefined,
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
