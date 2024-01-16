import { ChangeEvent, useState } from "react";
interface Props{
  actual:string
}
function useTextField({actual}: Props) {
  const [stateValue, setStateValue] = useState<string>(actual);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value);
  };

  return [
    stateValue,
    handleChangeValue,
  ];
};

export default useTextField;