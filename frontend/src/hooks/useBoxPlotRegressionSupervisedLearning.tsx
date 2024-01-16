import { useEffect, useState } from "react";
import { IDataRegressionSupervisedLearning } from "../utils/interfaces";

interface Props {
  data: any;
}

export const useBoxPlotRegressionSupervisedLearning = ({ data }: Props) => {
  const [dataBoxPlot, setDataBoxPlot] = useState<any[]>([]);

  useEffect(() => {
    let array = {
      y: data.error_values,
      type: "box",
      boxpoints: "all",
      name: "Training",
      marker:{
        color: 'rgb(135, 206, 235)'
      }
    };

    if (data.error_values_testing) {
      const array_testing = {
        y: data.error_values_testing,
        type: "box",
        boxpoints: "all",
        name: "Testing",
        marker:{
          color: 'rgb(250, 128, 114)'
        }
      };

      setDataBoxPlot([array, array_testing]);
    } else {
      setDataBoxPlot([array]);
    }
  }, []);

  return {
    dataBoxPlot,
  };
};
