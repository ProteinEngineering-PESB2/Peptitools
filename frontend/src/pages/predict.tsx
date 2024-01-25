import { Box } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";
import GenericForm from "../components/common/generic_form";

export default function ActivityPrediction() {
  const [result, setResult] = useState<any | undefined>(undefined);

  useHandleSection({ section: "activity" });
  useLoadingComponent();
  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <GenericForm setResult={setResult} service={config.activity_prediction}/>
      </Box>
    </DashboardLayout>
  );
}
