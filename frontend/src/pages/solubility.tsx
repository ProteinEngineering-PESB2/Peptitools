import {Box} from '@mui/material'
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import PfamContent from "../components/pfam/pfam_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import { IDataPfam } from "../utils/interfaces";
import config from "../config.json";
import GenericForm from "../components/common/generic_form";

export default function Solubility() {
  const [result, setResult] = useState<IDataPfam[]>([]);

  useHandleSection({ section: "solubility" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <GenericForm setResult={setResult} service={config.solubility}/>
        {result.length > 0 && <PfamContent result={result} />}
      </Box>
    </DashboardLayout>
  );
}
