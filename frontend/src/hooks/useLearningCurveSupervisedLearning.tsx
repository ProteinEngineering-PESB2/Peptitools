import { useEffect, useState } from "react";
import { IDataClassificationSupervisedLearning } from "../utils/interfaces";

interface Props {
  data: IDataClassificationSupervisedLearning;
}

export const useLearningCurveSupervisedLearning = ({ data }: Props) => {
  const [dataErrorBars, setDataErrorBars] = useState<any[]>([]);
  const [learningCurve, setLearningCurve] = useState(data.result.learning_curve);
  useEffect(() => {
    // Areas
    const traceErrorTraining = {
      x: learningCurve.error_training.x,
      y: learningCurve.error_training.y,
      fill: "tozerox",
      fillcolor: "rgba(0,100,80,0.2)",
      line: { color: "transparent" },
      name: "Training",
      showlegend: false,
      type: "scatter",
    };

    const traceErrorTesting = {
      x: learningCurve.error_testing.x,
      y: learningCurve.error_testing.y,
      fill: "tozerox",
      fillcolor: "rgba(0,176,246,0.2)",
      line: { color: "transparent" },
      name: "Testing",
      showlegend: false,
      type: "scatter",
    };

    // Lineas
    const traceTraining = {
      x: learningCurve.training.x,
      y: learningCurve.training.y,
      line: { color: "rgb(0,100,80)" },
      mode: "lines",
      name: "Training",
      type: "scatter",
    };

    const traceTesting = {
      x: learningCurve.testing.x,
      y: learningCurve.testing.y,
      line: { color: "rgb(0,176,246)" },
      mode: "lines",
      name: "Testing",
      type: "scatter",
    };

    setDataErrorBars([
      traceErrorTraining,
      traceErrorTesting,
      traceTraining,
      traceTesting,
    ]);
  }, []);

  return {
    dataErrorBars, learningCurve
  };
};
