import { ReactElement, useState } from "react";
import AppContext, { defaultState } from "./AppContext";

interface Props {
  children: ReactElement;
}

export default function AppProvider({ children }: Props) {
  const [section, setSection] = useState(defaultState.section);
  const [openTools, setOpenTools] = useState<boolean>(false);
  const [openBioinformaticTools, setOpenBioinformaticTools] =
    useState<boolean>(false);
  const [openStatisticTools, setOpenStatisticTools] = useState<boolean>(false);
  const [openMachineLearningTools, setOpenMachineLearningTools] =
    useState<boolean>(false);
  const [openPredictiveModels, setOpenPredictiveModels] =
    useState<boolean>(false);

  const handleChangeOpenTools = (value: boolean): void => setOpenTools(value);
  const handleChangeOpenBioinformaticTools = (value: boolean): void =>
    setOpenBioinformaticTools(value);
  const handleChangeOpenStatisticTools = (value: boolean): void =>
    setOpenStatisticTools(value);
  const handleChangeOpenMachineLearningTools = (value: boolean): void =>
    setOpenMachineLearningTools(value);
  const handleChangeOpenPredictiveModels = (value: boolean): void =>
    setOpenPredictiveModels(value);

  const toggleSection = (section: string) => {
    setSection(section);
  };
  return (
    <AppContext.Provider
      value={{
        section,
        toggleSection,
        handleChangeOpenBioinformaticTools,
        handleChangeOpenMachineLearningTools,
        handleChangeOpenPredictiveModels,
        handleChangeOpenStatisticTools,
        handleChangeOpenTools,
        openBioinformaticTools,
        openMachineLearningTools,
        openPredictiveModels,
        openStatisticTools,
        openTools,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
