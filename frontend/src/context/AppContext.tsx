import { createContext } from "react";

interface IAppContext {
  section: string;
  toggleSection: (section: string) => void;
  openTools: boolean;
  openBioinformaticTools: boolean;
  openStatisticTools: boolean;
  openMachineLearningTools: boolean;
  openPredictiveModels: boolean;
  handleChangeOpenTools: (value: boolean) => void;
  handleChangeOpenBioinformaticTools: (value: boolean) => void;
  handleChangeOpenStatisticTools: (value: boolean) => void;
  handleChangeOpenMachineLearningTools: (value: boolean) => void;
  handleChangeOpenPredictiveModels: (value: boolean) => void;
}

export const defaultState: IAppContext = {
  section: "home",
  toggleSection: () => "home",
  openBioinformaticTools: false,
  openMachineLearningTools: false,
  openPredictiveModels: false,
  openStatisticTools: false,
  openTools: false,
  handleChangeOpenBioinformaticTools: () => {},
  handleChangeOpenMachineLearningTools: () => {},
  handleChangeOpenTools: () => {},
  handleChangeOpenPredictiveModels: () => {},
  handleChangeOpenStatisticTools: () => {},
};

const AppContext = createContext<IAppContext>(defaultState);

export default AppContext;
