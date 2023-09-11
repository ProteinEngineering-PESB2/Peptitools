import { useState, useEffect } from "react";
import { IDataRegressionSupervisedLearning } from "../utils/interfaces";

interface Props {
  data: IDataRegressionSupervisedLearning;
}

export const useScatterRegressionSupervisedLearning = ({ data }: Props) => {
  const [dataScatter1, setDataScatter] = useState<any[]>([]);

  useEffect(() => {
    const trace_training = {
      x: data.result.scatter.x,
      y: data.result.scatter.y,
      mode: "markers",
      type: "scatter",
      name: "Training",
      marker:{
        color: 'rgb(135, 206, 235)'
      }
    };
    const trace_training_regr = {
      x: data.result.scatter.x_regr,
      y: data.result.scatter.y_regr,
      type:'scatter',
      name: 'Training',
      line:{
        color: 'rgb(135, 206, 235)'
      }
    }

    if (data.result.scatter_testing) {
      const trace_testing = {
        x: data.result.scatter_testing.x,
        y: data.result.scatter_testing.y,
        mode: "markers",
        type: "scatter",
        name: "Testing",
        marker:{
          color: 'rgb(250, 128, 114)'
        }
      };
      const trace_testing_regr = {
        x: data.result.scatter_testing.x_regr,
        y: data.result.scatter_testing.y_regr,
        type:'scatter',
        name: 'Testing',
        line:{
          color: 'rgb(250, 128, 114)'
        }
      }

      setDataScatter([trace_training, trace_training_regr, trace_testing, trace_testing_regr]);
    } else {
      setDataScatter([trace_training, trace_training_regr]);
    }
  }, []);

  return {
    dataScatter1
  };
};
