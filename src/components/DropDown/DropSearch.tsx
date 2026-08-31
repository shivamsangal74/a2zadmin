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

const getOptionDisplay = (option: any): string => {
  if (!option) return "";
  if (typeof option === "string") return option;
  if (typeof option === "number") return String(option);
  return String(
    option.showvalue ??
    option.showValue ??
    option.label ??
    option.name ??
    option.value ??
    ""
  );
};

const getOptionVal = (option: any): string => {
  if (!option) return "";
  if (typeof option === "string" || typeof option === "number") return String(option);
  return String(
    option.value ??
    option.showvalue ??
    option.showValue ??
    option.label ??
    ""
  );
};

export const DropSearch = <O extends { value: string; showvalue: string; image?: string }>(
  props: SearchDropDownProps<O>
) => {
  const {
    value,
    onchange,
    options = [],
    placeholder,
    error,
    isLoading = false,
    isFilter = false,
    drop = 0,
    place2 = undefined,
    onOpen,
  } = props;

  const safeOptions = Array.isArray(options) ? options : [];

  const selectedOption =
    value !== undefined && value !== null && value !== ""
      ? safeOptions.find((o) => getOptionVal(o) === String(value)) ?? null
      : null;

  return (
    <div className="w-full">
      <FormControl fullWidth className="bg-transparent dark:bg-transparent">
        <Autocomplete
          loading={isLoading}
          disabled={isLoading}
          onOpen={onOpen}
          value={selectedOption}
          isOptionEqualToValue={(option, val) =>
            val ? getOptionVal(option) === getOptionVal(val) : false
          }
          filterOptions={(opts, state) => {
            const input = (state.inputValue || "").toLowerCase().trim();
            if (!input) return opts;

            const matches = opts.filter((o) => {
              const disp = getOptionDisplay(o).toLowerCase();
              const val = getOptionVal(o).toLowerCase();
              return disp.includes(input) || val.includes(input);
            });

            return matches.sort((a, b) => {
              const aDisp = getOptionDisplay(a).toLowerCase();
              const aVal = getOptionVal(a).toLowerCase();
              const bDisp = getOptionDisplay(b).toLowerCase();
              const bVal = getOptionVal(b).toLowerCase();

              const getScore = (disp: string, val: string) => {
                if (val === input || disp === input) return 1;
                if (val.startsWith(input) || disp.startsWith(input)) return 2;
                const vIdx = val.indexOf(input);
                const dIdx = disp.indexOf(input);
                const minPos = Math.min(
                  vIdx !== -1 ? vIdx : Infinity,
                  dIdx !== -1 ? dIdx : Infinity
                );
                return 3 + (minPos !== Infinity ? minPos : 100);
              };

              return getScore(aDisp, aVal) - getScore(bDisp, bVal);
            });
          }}
          size="small"
          sx={{
            "& .MuiInputBase-root": {
              height: 40,
            },
          }}
          getOptionLabel={(option) => getOptionDisplay(option)}
          onChange={(event: any, newValue) => {
            const valToPass = newValue ? getOptionVal(newValue) : null;
            isFilter
              ? onchange(
                  place2 ? place2 : placeholder,
                  valToPass,
                  drop
                )
              : onchange(valToPass);
          }}
          id="controllable-states-demo"
          options={safeOptions}
          renderOption={(props, option) => (
            <li {...props} key={getOptionVal(option)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {(option as any)?.image && (
                  <img
                    src={(option as any).image}
                    alt={getOptionDisplay(option)}
                    style={{ width: 22, height: 22, objectFit: "contain", borderRadius: 4, background: "#f3f4f6" }}
                  />
                )}
                <span>{getOptionDisplay(option)}</span>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: selectedOption && (selectedOption as any).image ? (
                  <img
                    src={(selectedOption as any).image}
                    alt={getOptionDisplay(selectedOption)}
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
