
import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller } from 'react-hook-form';

const SearchDropdown = ({ controlProp,label,options }) => {
  

  return (
    <Controller
      name="autocomplete"
      control={controlProp}
      defaultValue={null}
      render={({ field }) => (
        <Autocomplete
          {...field}
          id="autocomplete"
          size="small"
          
          slotProps={{
            className: `!p-3 dark:bg-gray-700`,
          }}
          options={options}
          getOptionLabel={(option) => option.showvalue}
          renderInput={(params) => (
            <TextField {...params} label={label} variant="outlined" />
          )}
        />
      )}
    />
  );
};

export default SearchDropdown;

