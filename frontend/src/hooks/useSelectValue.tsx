import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
interface Props{
    array_values: any;
}
function useSelectValue({array_values}: Props) {
  const [selected_value, setSelectedValue] = useState<string>(
    array_values[0].value
  );

  const handleChangeSelectedValue = (e: SelectChangeEvent) => {
    setSelectedValue(e.target.value as string);
  };

  return [
    selected_value,
    array_values,
    handleChangeSelectedValue,
  ];
}

export default useSelectValue;
