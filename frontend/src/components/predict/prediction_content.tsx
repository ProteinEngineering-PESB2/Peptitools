import { Box } from "@mui/material";
import DataTable from "../common/datatable";

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
