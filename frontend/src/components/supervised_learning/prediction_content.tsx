import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDataTableClustering } from "../../hooks/useDataTableClustering";
import BackdropComponent from "../common/backdrop_component";
import ButtonDownloadPrimary from "../common/button_download_primary";
import PieChart from "../charts/pie_chart";
import ScatterPlot from "../charts/scatter_plot";
import DataTable from "../common/datatable";
import { useDataTablePrediction } from "../../hooks/useDataTablePrediction";

interface Props {
  result: any
}

export default function PredictionContent({ result }: Props) {
  return (
    <>
      <Box marginTop={3} boxShadow={4}>
        <DataTable table={result.predictions} title="Predictions" />
      </Box>
      {result.probabilities && 
      <Box marginTop={3} boxShadow={4}>
        <DataTable table={result.probabilities} title="Predicted probabilities" />
      </Box>}
      
    </>
  );
}
