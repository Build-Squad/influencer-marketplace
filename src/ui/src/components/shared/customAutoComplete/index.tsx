"use client";

import { getService } from "@/src/services/httpServices";
import { Autocomplete, TextField } from "@mui/material";
import React from "react";

type CustomAutoCompleteProps = {
  apiEndpoint: string;
  label?: string;
  placeholder?: string;
  value?: any;
  onChange?: (value: unknown) => void;
  onClear?: () => void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  sx?: Record<string, unknown>;
  type?: string;
  getOptionLabel?: (option: unknown) => string;
  isOptionEqualToValue?: (option: unknown, value: unknown) => boolean;
  isMulti?: Boolean;
  getOptionDisabled?: (option: unknown) => boolean;
  customFilter?: object;
};

const CustomAutoComplete = ({
  apiEndpoint,
  label,
  placeholder,
  value,
  onChange,
  onClear,
  helperText,
  error,
  disabled,
  sx,
  type,
  getOptionLabel,
  isOptionEqualToValue,
  getOptionDisabled,
  isMulti = false,
  customFilter,
}: CustomAutoCompleteProps) => {
  const [selected, setSelected] = React.useState<unknown>(null); // This is the value that is selected from the options[]
  const [options, setOptions] = React.useState<unknown[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const [pagination, setPagination] = React.useState<PaginationType>({
    current_page_number: 1,
    current_page_size: 10,
    total_data_count: 0,
    total_page_count: 0,
  });

  const getOptions = async () => {
    try {
      const { isSuccess, data, message } = await getService(apiEndpoint, {
        search,
        page_size: pagination.current_page_size,
        page_number: pagination.current_page_number,
        ...customFilter,
      });
      if (isSuccess) {
        setOptions([...options, ...data?.data]);
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  const handleSearch = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setSearch(value);
    setOptions([]);
    setPagination({ ...pagination, current_page_number: 1 }); // Reset pagination
  };

  const handleClear = () => {
    setSearch("");
    setOptions([]);
    onClear && onClear();
  };

  const handleSelect = (value: unknown) => {
    if (!value) {
      handleClear();
      return;
    }
    onChange && onChange(value);
    setSelected(value);
  };

  const handleScroll = (event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollTop + clientHeight === scrollHeight) {
      setPagination({
        ...pagination,
        current_page_number: pagination.current_page_number + 1,
      });
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getOptions();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, pagination, customFilter]); // Add customFilter to the dependency array

  React.useEffect(() => {
    // Reset options and pagination
    setOptions([]);
    setPagination({
      current_page_number: 1,
      current_page_size: 10,
      total_data_count: 0,
      total_page_count: 0,
    });

    const timeout = setTimeout(() => {
      getOptions();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, customFilter]); // Remove pagination from the dependency array

  //

  // If value is not undefined, then we need to check if the value is there in the options, if not then we need to add the value to the options
  React.useEffect(() => {
    if (value && !isMulti) {
      const found = options.find((option) => option === value);
      if (!found) {
        setOptions([...options, value]);
      }
      setSelected(value);
    }
  }, [value]);

  return isMulti ? (
    <Autocomplete
      multiple={true}
      value={value}
      options={options}
      sx={{
        ...sx,
        ".MuiAutocomplete-inputRoot": {
          flexWrap: "nowrap",
          overflow: "hidden",
        },
      }}
      getOptionDisabled={getOptionDisabled}
      getOptionLabel={getOptionLabel}
      inputValue={search}
      onInputChange={handleSearch}
      renderInput={(params) => {
        return (
          <TextField
            color="secondary"
            {...params}
            label={label}
            helperText={helperText}
            error={error}
            disabled={disabled}
            type={type}
            size="medium"
            sx={{
              height: "100%",
            }}
          />
        );
      }}
      onChange={(event, value) => handleSelect(value)}
      onScroll={handleScroll}
    />
  ) : (
    <Autocomplete
      value={value}
      id="custom-input-demo"
      options={options}
      sx={sx}
      getOptionDisabled={getOptionDisabled}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      inputValue={search}
      onInputChange={handleSearch}
      renderInput={(params) => (
        <TextField
          color="secondary"
          {...params}
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          error={error}
          disabled={disabled}
          type={type}
          size="small"
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props} onScroll={handleScroll}>
          {getOptionLabel && getOptionLabel(option)}
        </li>
      )}
      onChange={(event, value) => handleSelect(value)}
      onScroll={handleScroll}
    />
  );
};

export default CustomAutoComplete;
