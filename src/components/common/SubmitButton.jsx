import React from "react";
import Button from "@mui/material/Button";

export default function SubmitButton({ isLoading, children, ...props }) {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      {...props}
    >
      {isLoading ? "Creating..." : children}
    </Button>
  );
}
