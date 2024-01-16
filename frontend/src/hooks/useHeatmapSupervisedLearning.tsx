import { useEffect, useState } from "react";
import { IDataClassificationSupervisedLearning } from "../utils/interfaces";

interface Props {
  result: any;
}

export const useHeatmapSupervisedLearning = ({ result }: Props) => {
  const [dataHeatmap, setDataHeatmap] = useState<any[]>([]);
  const [dataHeatmapTesting, setDataHeatmapTesting] = useState<any[]>([]);

  useEffect(() => {
    const array = [
      {
        x: result.confusion_matrix.x,
        y: result.confusion_matrix.y,
        z: result.confusion_matrix.z,
        type: "heatmap",
        hoverongaps: false,
      },
    ];

    if (result.confusion_matrix_testing) {
      const array_testing = [
        {
          x: result.confusion_matrix_testing.x,
          y: result.confusion_matrix_testing.y,
          z: result.confusion_matrix_testing.z,
          type: "heatmap",
          hoverongaps: false,
        },
      ];
      setDataHeatmapTesting(array_testing);
    }

    setDataHeatmap(array);
  }, []);

  return {
    dataHeatmap,
    dataHeatmapTesting,
  };
};
