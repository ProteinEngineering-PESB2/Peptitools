import { Box } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import MSAContent from "../components/msa/msa_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import { MSAResult } from "../utils/interfaces";
import config from "../config.json";
import GenericForm from "../components/common/generic_form";

export default function MSA() {
  const [result, setResult] = useState<MSAResult | undefined>(undefined);

  useHandleSection({ section: "msa" });
  useLoadingComponent();
  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <GenericForm setResult={setResult} service={config.msa}/>
        {
        (result)&&
        <MSAContent result={result} />}
      </Box>
    </DashboardLayout>
  );
}
