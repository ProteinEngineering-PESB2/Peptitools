import { Box } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import StructuralPredictionContent from "../components/structural_prediction/structural_prediction_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";
import GenericForm from "../components/common/generic_form";

function StructuralPrediction() {
  const [result, setResult] = useState<any|undefined>(undefined);
  useLoadingComponent();
  useHandleSection({ section: "structural_prediction" });

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <GenericForm setResult={setResult} service={config.structural_prediction}/>
        {result && (
          <StructuralPredictionContent
            result={result}
          />
        )}
      </Box>
    </DashboardLayout>
  );
}

export default StructuralPrediction;
