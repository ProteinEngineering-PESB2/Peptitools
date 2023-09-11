import { Box } from "@mui/material";
import DataTable from "../common/datatable";
import DistributionBoxplots from "../charts/distribution_boxplots";

interface Props{
  result:{
    distribution: any;
    kruskal: {
      columns: string[];
      data: [string[]];
    }
    tukey: {
      columns: string[];
      data: [string[]];
    }
  }
}

export default function PhysichochemicalContent({ result }: Props) {
  const distribution = result.distribution
  const kruskal = result.kruskal
  const tukey = result.tukey
  const tableKruskal = {
    columns: kruskal.columns,
    data: kruskal.data,
  };

  const tableTukey = {
    columns: tukey.columns,
    data: tukey.data,
  };

  return (
    <>
      <Box marginTop={3} boxShadow={4}>
        <DistributionBoxplots data = {distribution}
          title = "Physicochemical properties distribution" height = {1200}
          columns = {2} rows = {5}>
        </DistributionBoxplots>
        <DataTable title= "Kruskal-Wallis test" table={tableKruskal} />
        {tableTukey.data.length > 0 && (
          <DataTable title= "Tukey's HSD  test" table={tableTukey} />
        )}
      </Box>
    </>
  );
}
