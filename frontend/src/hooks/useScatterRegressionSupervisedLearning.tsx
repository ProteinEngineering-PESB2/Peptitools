import { useState, useEffect } from "react";
import { IDataRegressionSupervisedLearning } from "../utils/interfaces";

interface Props {
  data: any;
}

export const useScatterRegressionSupervisedLearning = ({ data }: Props) => {
  const [dataScatter1, setDataScatter] = useState<any[]>([]);

  useEffect(() => {
    let max_value_train = Math.max(...data.scatter.x)
    let max_value_test = Math.max(...data.scatter_testing.x)
    let max_value = Math.max(...[max_value_train, max_value_test])
    const baseline_tracing = {
      x: [0, max_value],
      y: [0, max_value],
      type: "line",
      name: "Identity"
    }

    const trace_training = {
      x: data.scatter.x,
      y: data.scatter.y,
      mode: "markers",
      type: "scatter",
      name: "Training",
      marker:{
        color: 'rgb(135, 206, 235)'
      }
    };
    const trace_training_regr = {
      x: data.scatter.x_regr,
      y: data.scatter.y_regr,
      type:'scatter',
      name: 'Training',
      line:{
        color: 'rgb(135, 206, 235)'
      }
    }

    if (data.scatter_testing) {
      const trace_testing = {
        x: data.scatter_testing.x,
        y: data.scatter_testing.y,
        mode: "markers",
        type: "scatter",
        name: "Testing",
        marker:{
          color: 'rgb(250, 128, 114)'
        }
      };
      const trace_testing_regr = {
        x: data.scatter_testing.x_regr,
        y: data.scatter_testing.y_regr,
        type:'scatter',
        name: 'Testing',
        line:{
          color: 'rgb(250, 128, 114)'
        }
      }

      setDataScatter([baseline_tracing, trace_training, trace_training_regr, trace_testing, trace_testing_regr]);
    } else {
      setDataScatter([baseline_tracing, trace_training, trace_training_regr]);
    }
  }, []);

  return {
    dataScatter1
  };
};
