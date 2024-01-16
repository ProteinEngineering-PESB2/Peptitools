import { Box, Grid, Typography} from "@mui/material";
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
  result: any;
}

export default function SupervisedLearningContentClassification({result}: Props) {
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
          path={result.job_path}
          name="result.joblib"
          setOpenBackdrop={setOpenBackdrop}
          setPercentage={setPercentage}
          title="model"
        />
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box sx={{ display: "flex", flexDirection: "column" }} boxShadow={4} marginTop={4} >
            <DataTable table={result.metrics} title="Metrics" />
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

      {/* Heatmap confusion matrix */}
      <Grid container spacing={2}>
        <Grid item md={6} sm={6} xs={6}>
          <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }}>
            <ConfusionMatrix data = {dataHeatmap} title = "Training"></ConfusionMatrix>
          </Box>
        </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }} >
              <ConfusionMatrix data = {dataHeatmapTesting} title = "Testing"></ConfusionMatrix>
            </Box>
          </Grid>
      </Grid>
      {/* Sensibility / Specificity */}

      <Grid container spacing={2}>
        <Grid item md={6} sm={6} xs={6}>
          <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }} >
            <Sensibility data={dataBar} title="Training"></Sensibility>
          </Box>
        </Grid>
        <Grid item md={6} sm={6} xs={6}>
          <Box marginTop={3} boxShadow={4} sx={{ display: "flex", flexDirection: "column" }} >
            <Sensibility data={dataBarTesting} title="Testing"></Sensibility>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
