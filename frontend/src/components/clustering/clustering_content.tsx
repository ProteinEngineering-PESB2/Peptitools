import { Box, Paper } from "@mui/material";
import { useState } from "react";
import { useDataTableClustering } from "../../hooks/useDataTableClustering";
import BackdropComponent from "../common/backdrop_component";
import ButtonDownloadPrimary from "../common/button_download_primary";
import PieChart from "../charts/pie_chart";
import ScatterPlot from "../charts/scatter_plot";
import DataTable from "../common/datatable";

interface Props {
  result: {
    performance: any;
    pca: any;
    clustering_type: any;
    encoding_path: string;
    is_normal: boolean;
    data: any;
    resume: any;
    alignment_path: string;
    distances_path: string;
  };
}

export default function ClusteringContent({ result }: Props) {
  
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const { table } = useDataTableClustering({ result });
  
  return (
    <>
      <BackdropComponent open={openBackdrop} percentage={percentage} />
      
      <Box marginTop={3} boxShadow={4}>
        <DataTable title="Metrics" table={result.performance}></DataTable>
      </Box>
      
      <Box marginTop={3} boxShadow={4}>
        <DataTable table={table} title="Clustering Results" />
      </Box>
      

      {result.clustering_type === "unsupervised_learning" && (
        <Box marginTop={3} boxShadow={4}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <ScatterPlot title="t-SNE visualization" data={result.pca.result} xlabels="" ylabels="" />
          </Paper>
        </Box>

      )}

      <Box marginTop={3} boxShadow={4}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <PieChart
            labels={result.resume.labels}
            values={result.resume.values}
            markers={result.resume.marker}
          />
        </Paper>
      </Box>


      <Box marginTop={3}>
        <ButtonDownloadPrimary
          path={result.encoding_path}
          name="clustering.csv"
          setOpenBackdrop={setOpenBackdrop}
          setPercentage={setPercentage}
          title="clustering"
        />
      </Box>
      {result.clustering_type === "graph_clustering_alignments" && (
        <>
          <Box marginTop={3}>
            <ButtonDownloadPrimary
              path={result.alignment_path}
              name="alignment.aln"
              setOpenBackdrop={setOpenBackdrop}
              setPercentage={setPercentage}
              title="alignment"
            />
          </Box>
          <Box marginTop={3}>
            <ButtonDownloadPrimary
              path={result.distances_path}
              name="distances.dist"
              setOpenBackdrop={setOpenBackdrop}
              setPercentage={setPercentage}
              title="distances"
            />
          </Box>
        </>
      )}
    </>
  );
}
