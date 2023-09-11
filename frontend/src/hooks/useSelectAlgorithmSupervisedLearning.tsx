import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import config from "../config.json";

interface Props {
  taskType: string;
}

export const useSelectAlgorithmSupervisedLearning = ({ taskType }: Props) => {
  const sl_algorithms_clf =
    config.supervised_learning
      .sl_algorithms_clf;
  const sl_algorithms_regr =
    config.supervised_learning.sl_algorithms_regr;

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(
    taskType === "classification"
      ? sl_algorithms_clf[0].value
      : sl_algorithms_regr[0].value
  );

  const handleChangeSelectedAlgorithm = (e: SelectChangeEvent): void => {
    setSelectedAlgorithm(e.target.value as string);
  };

  return {
    selectedAlgorithm,
    handleChangeSelectedAlgorithm,
    sl_algorithms_clf,
    sl_algorithms_regr,
  };
};
