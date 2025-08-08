// react
import React, { useEffect, useRef } from "react";

// mui components
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// custom components
import Text from "./Text";

// constants
import { colorConstant } from "../../constants/colors";
import { ClearInput } from "../search/components/clearInput";

export default function CustomInput({
  inRef,
  label,
  placeholder,
  type = "text",
  value,
  clearInput,
  searchIconInput,
  inputAdornmentText,
  inputAdornmentIcon,
  ...props
}) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <FormControl sx={{ my: 1, width: "100%" }} variant="outlined">
      {label && (
        <Text
          text={label}
          tint="rgb(134,140,150)"
          align="left"
          marginBottom="5px"
        />
      )}
      <OutlinedInput
        inputRef={inRef == true ? inputRef : null}
        startAdornment={
          <InputAdornment position="start">
            {inputAdornmentText ? (
              <Text text={inputAdornmentText} tint="darkgray" />
            ) : (
              inputAdornmentIcon
            )}
          </InputAdornment>
        }
        endAdornment={
          searchIconInput && (
            <SearchIcon
              className="search-icon"
              onClick={searchIconInput}
              sx={{
                marginRight: "1.5rem",
                fontSize: "1rem",
              }}
            />
          )
        }
        value={value}
        type={type}
        size="small"
        placeholder={placeholder}
        sx={{
          borderRadius: "0.7rem",
          padding: "5px 10px",
          fontSize: "12px",
          backgroundColor: props?.disabled ? "#FAF9FE" : colorConstant.white,
          opacity: props?.disabled ? 0.5 : 1,
          "& fieldset": { border: "none" },
          border: "1px solid lightgrey",
          ...(props.customStyles || {}),
        }}
        inputProps={{
          ...props,
        }}
      />
      {clearInput && <ClearInput clearInput={clearInput} />}
    </FormControl>
  );
}
