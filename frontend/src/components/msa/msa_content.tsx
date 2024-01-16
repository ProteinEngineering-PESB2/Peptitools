import { Box, Paper } from "@mui/material";
import { useState } from "react";
import useHandlerBackendUrl from "../../hooks/useHandlerBackendUrl";
import { MSAResult } from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonDownloadPrimary from "../common/button_download_primary";
import ProSeqViewer from "../common/pro_seq_viewer";

interface Props {
  result: MSAResult;
}

export default function MSAContent({ result }: Props) {
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const { backendUrl } = useHandlerBackendUrl();
  return (
    <>
      <BackdropComponent open={openBackdrop} percentage={percentage} />
      <Box
        marginTop={3}
        boxShadow={4}
        sx={{
          width: {
            xs: "25rem",
            sm: "35rem",
            md: "50rem",
            lg: "60rem",
            xl: "70rem",
          },
        }}
      >
        <ProSeqViewer sequences={result.alignment} />
      </Box>
      <Box marginTop={3} boxShadow={4}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            maxHeight: 800,
            overflowX: "scroll",
            overflowY: "scroll",
          }}
        >
          <img
            src={`${backendUrl}${result.dendrogram}`}
            alt="Dendrogram"
            width="100%"
            height="100%"
          />
        </Paper>
      </Box>
      <Box marginTop={3}>
        <ButtonDownloadPrimary
          path={result.output_file}
          name="msa.aln"
          title="MSA"
          setOpenBackdrop={setOpenBackdrop}
          setPercentage={setPercentage}
        />
      </Box>
      <Box marginTop={3}>
        <ButtonDownloadPrimary
          path={result.distances_file}
          name="distances_matrix.mat"
          title="Distances Matrix"
          setOpenBackdrop={setOpenBackdrop}
          setPercentage={setPercentage}
        />
      </Box>
    </>
  );
}
