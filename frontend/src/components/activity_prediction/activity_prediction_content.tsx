import { Grid, Paper } from "@mui/material";
import DataTable from "../common/datatable";


function ActivityPredictionTable({ result }:any) {

  return (
    <>
    <Grid container spacing={2} marginTop={2}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column", boxShadow: 4 }} >
          <DataTable title="Activity predictions" table={result} />
        </Paper>
      </Grid>
    </Grid>
    </>
  );
}

export default ActivityPredictionTable;
