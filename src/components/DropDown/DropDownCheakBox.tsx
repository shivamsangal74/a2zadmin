import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { CircularProgress, FormControl } from "@mui/material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Option {
  value: string; // Adjust the type as per your option structure
  showvalue: string; // Adjust the type as per your option structure
}

interface DropDownCheakBoxProps {
  onChange: (newValue: string | null, label: any, drop: any) => void;
  options: Option[];
  value: string | null;
  isLoading: boolean;
  label: string;
  place2: string;
  isFilter: boolean;
  drop: string;
}

export default function DropDownCheakBox({
  onChange,
  options,
  value,
  label,
  isLoading = false,
  isFilter = false,
  place2 = "",
  drop = "",
}: DropDownCheakBoxProps) {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: Option[],
    label: "",
    drop: ""
  ) => {
    const selectedValues = newValue.map((option) => option.value);

    if (selectedValues.includes("All")) {
      isFilter
        ? onChange(
            newValue
              ? options
                  .filter((option) => option.value !== "All") // Filter first
                  .map((option) => option.value)
              : null,
            label,
            drop
          )
        : onChange(
            options
              .filter((option) => option.value !== "All") // Filter first
              .map((option) => option.value) // Then map
          );
    } else {
      isFilter
        ? onChange(selectedValues, place2, drop)
        : onChange(selectedValues); // Use selected values if not filtering
    }
  };

  return (
    <div className="w-full">
      <FormControl fullWidth className="bg-white">
        <Autocomplete
          multiple
          loading={isLoading}
          id="checkboxes-tags-demo"
          options={options}
          limitTags={2}
          disableCloseOnSelect
          value={
            value
              ? options.filter((option) => value.includes(option.value))
              : []
          }
          size="small"
          sx={{
            "& .MuiInputBase-root": {
              height: 40,
            },
          }}
          getOptionLabel={(option) => option.showvalue}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.showvalue}
            </li>
          )}
          onChange={(event: any, newValue: Option[]) =>
            handleChange(event, newValue, label, drop)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={label}
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
      </FormControl>
    </div>
  );
}
