import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { IDataRegressionSupervisedLearning } from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonDownloadPrimary from "../common/button_download_primary";
import { useScatterRegressionSupervisedLearning } from "../../hooks/useScatterRegressionSupervisedLearning";
import { useBoxPlotRegressionSupervisedLearning } from "../../hooks/useBoxPlotRegressionSupervisedLearning";
import ScatterPlot from "../charts/scatter_plot_regression";
import DataTable from "../common/datatable";
import Boxplot from "../charts/boxplot"

interface Props {
  result: IDataRegressionSupervisedLearning;
}

export default function SupervisedLearningContentRegression({ result }: Props) {
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const { dataScatter1 } = useScatterRegressionSupervisedLearning({
    data: result,
  });
  console.log(dataScatter1)
  const { dataBoxPlot } = useBoxPlotRegressionSupervisedLearning({
    data: result,
  });
  return (
    <>
      <BackdropComponent open={openBackdrop} percentage={percentage} />
      <Box marginTop={3}>
        <ButtonDownloadPrimary
          name="result.joblib"
          path={result.result.job_path}
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
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box sx={{ display: "flex", flexDirection: "column" }} boxShadow={4} marginTop={4} >
            <ScatterPlot 
              title = "Real vs Prediction"
              data = {dataScatter1}
              xlabels = "Real" ylabels= "Predicted"/>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box sx={{ display: "flex", flexDirection: "column" }} boxShadow={4} marginTop={4} >
            <DataTable table={result.result.corr_metrics} title="Correlation metrics" />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box
            sx={{ display: "flex", flexDirection: "column" }}
            boxShadow={4}
            marginTop={4}
          >
            <Boxplot data = {dataBoxPlot} title = "Error plot" />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
