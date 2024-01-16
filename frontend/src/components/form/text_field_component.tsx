import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

interface Props {
  title: string;
  value: string | ((e: React.ChangeEvent<HTMLInputElement>) => void);
  handleChange: ((e: ChangeEvent<HTMLInputElement>) => void);
}

export default function TextFieldComponent({
  title,
  value,
  handleChange,
}: Props) {
  return (
    <TextField
      label={title}
      value={value}
      onChange={handleChange}
      fullWidth
    />
  );
}
