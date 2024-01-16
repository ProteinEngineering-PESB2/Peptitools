import { useEffect, useState } from "react";
import { IDataClassificationSupervisedLearning } from "../utils/interfaces";

interface Props {
  data: any;
}

export const useGroupedBarSupervisedLearning = ({ data }: Props) => {
  const [dataBar, setDataBar] = useState<any[]>([]);
  const [dataBarTesting, setDataBarTesting] = useState<any[]>([]);

  useEffect(() => {
    let traceSensibility = {
      x: data.analysis.categories,
      y: data.analysis.sensibility,
      name: "Sensibility",
      type: "bar",
    };

    let traceSensivity = {
      x: data.analysis.categories,
      y: data.analysis.sensitivity,
      name: "Sensitivity",
      type: "bar",
    };

    if (data.analysis_testing) {
      const traceSensibilityTesting = {
        x: data.analysis_testing.categories,
        y: data.analysis_testing.sensibility,
        name: "Sensibility",
        type: "bar",
      };

      const traceSensivityTesting = {
        x: data.analysis_testing.categories,
        y: data.analysis_testing.sensitivity,
        name: "Sensitivity",
        type: "bar",
      };

      setDataBarTesting([traceSensibilityTesting, traceSensivityTesting]);
    }
    setDataBar([traceSensibility, traceSensivity]);
  }, []);

  return {
    dataBar,
    dataBarTesting,
  };
};
