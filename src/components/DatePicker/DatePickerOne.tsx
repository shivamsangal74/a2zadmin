import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";

type DatePickerProps = {
  label: string;
  registerAction?: any;
  error: any;
  name: string;
  controlProp: any;
  disabelProp:any
};

const DatePicker1: React.FC<DatePickerProps> = ({
  label,
  name,
  registerAction,
  error,
  disabelProp,
  controlProp,
}) => {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormControl fullWidth className="bg-white">
          <Controller
        
            control={controlProp}
            name={name}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <DatePicker
                disabled={disabelProp}
                  label={label}
                  value={field.value}
                  inputRef={field.ref}
                  format="DD/MM/YYYY"
                  onChange={(date) => {
                    field.onChange(date);
                  }} 
                 
                  sx={{
                    "& .MuiInputBase-root": {
                        height: 40
                    }
                }}
                />
              );
            }}
          />
        </FormControl>
      </LocalizationProvider>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          <span className="font-medium">{error}</span>
        </p>
      )}
    </div>
  );
};

export default DatePicker1;
