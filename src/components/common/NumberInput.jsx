import React from "react";
import TextField from "@mui/material/TextField";

export default function NumberInput({
  label,
  type = "number",
  value,
  onChange,
  placeholder,
  required = false,
  ...props
}) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      variant="outlined"
      fullWidth
      margin="normal"
      {...props}
    />
  );
}
