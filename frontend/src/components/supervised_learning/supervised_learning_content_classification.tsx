import { Box, Grid} from "@mui/material";
import { useState } from "react";
import { useHeatmapSupervisedLearning } from "../../hooks/useHeatmapSupervisedLearning";
import { IDataClassificationSupervisedLearning } from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonDownloadPrimary from "../common/button_download_primary";
import { useLearningCurveSupervisedLearning } from "../../hooks/useLearningCurveSupervisedLearning";
import { useGroupedBarSupervisedLearning } from "../../hooks/useGroupedBarSupervisedLearning";
import ConfusionMatrix from "../charts/confusion_matrix";
import Sensibility from "../charts/sensibility";
import LearningCurve from "../charts/learning_curve";
import DataTable from "../common/datatable";

interface Props {
  result: IDataClassificationSupervisedLearning;
}

export default function SupervisedLearningContentClassification({
  result,
}: Props) {
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const { dataHeatmap, dataHeatmapTesting } = useHeatmapSupervisedLearning({
    result,
  });
  const { dataErrorBars, learningCurve } = useLearningCurveSupervisedLearning({
    data: result,
  });
  const { dataBar, dataBarTesting } = useGroupedBarSupervisedLearning({
    data: result,
  });

  return (
    <>
      <BackdropComponent open={openBackdrop} percentage={percentage} />
      <Box marginTop={3}>
        <ButtonDownloadPrimary
          path={result.result.job_path}
          name="result.joblib"
          setOpenBackdrop={setOpenBackdrop}
          setPercentage={setPercentage}
          title="model"
        />
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box sx={{ display: "flex", flexDirection: "column" }} boxShadow={4} marginTop={4} >
            <DataTable table={result.result.metrics} title="Metrics" />
          </Box>
        </Grid>
      </Grid>


      <Grid container spacing={2}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }}>
            <LearningCurve data = {dataErrorBars} learning_curve={learningCurve} title="Training Examples"></LearningCurve>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }}>
            <ConfusionMatrix data = {dataHeatmap} title = "Training Confussion Matrix"></ConfusionMatrix>
          </Box>
        </Grid>
        {result.result.confusion_matrix_testing && (
          <>
            <Grid item md={12} sm={12} xs={12}>
              <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }} >
                <ConfusionMatrix data = {dataHeatmapTesting} title = "Testing Confussion Matrix"></ConfusionMatrix>
              </Box>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }} >
            <Sensibility data={dataBar} title="Sensibility Training"></Sensibility>
          </Box>
        </Grid>
        {result.result.analysis_testing && (
          <Grid item md={12} sm={12} xs={12}>
            <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }} >
              <Sensibility data={dataBarTesting} title="Sensibility Testing"></Sensibility>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
}
