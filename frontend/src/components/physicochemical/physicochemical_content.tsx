import { Box } from "@mui/material";
import DataTable from "../common/datatable";
import DistributionBoxplots from "../charts/distribution_boxplots";
import { StatisticsResult } from "../../utils/interfaces";

interface Props{
  result: StatisticsResult;
}

export default function PhysichochemicalContent( {result} : Props) {
  const distribution = result.distribution
  const kruskal = result.kruskal
  const tukey = result.tukey
  const tableKruskal = {
    columns: kruskal.columns,
    data: kruskal.data,
  };

  return (
    <>
      <Box marginTop={3} boxShadow={4}>
        <DistributionBoxplots data = {distribution}
          title = "Physicochemical properties distribution" height = {1200}
          columns = {2} rows = {5}/>
        <DataTable title= "Kruskal-Wallis test" table={tableKruskal} />
        {tukey && (
          <DataTable title= "Tukey's HSD  test" table={{
            columns: tukey.columns,
            data: tukey.data,
          }} />
        )}
      </Box>
    </>
  );
}
