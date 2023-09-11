import { Box } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import MSAContent from "../components/msa/msa_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import { IAlign } from "../utils/interfaces";
import config from "../config.json";
import GenericForm from "../components/common/generic_form";

export default function MultiAlignmentSequence() {
  const [result, setResult] = useState<IAlign>({
    alignment: [],
    output_file: "",
    distances_file: "",
    image_heatmap: "",
    dendrogram: "",
  });

  useHandleSection({ section: "msa" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <GenericForm setResult={setResult} service={config.msa}/>
        {result.alignment.length > 0 && <MSAContent result={result} />}
      </Box>
    </DashboardLayout>
  );
}
