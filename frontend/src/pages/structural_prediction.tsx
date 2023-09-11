import { Box, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import StructuralPredictionContent from "../components/structural_prediction/structural_prediction_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";
import GenericForm from "../components/common/generic_form";

function StructuralPrediction() {
  const [result, setResult] = useState<any>([]);
  const [sequenceValue, setSequenceValue] = useState("");

  const handleChangeSequenceValue = (e: SelectChangeEvent) => {
    setSequenceValue(e.target.value as string);
  };

  useLoadingComponent();
  useHandleSection({ section: "structural_prediction" });

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <GenericForm setResult={setResult} service={config.msa}/>
        {result && result.length > 0 && sequenceValue !== "" && (
          <StructuralPredictionContent
            result={result}
            handleChangeSequenceValue={handleChangeSequenceValue}
            sequenceValue={sequenceValue}
          />
        )}
      </Box>
    </DashboardLayout>
  );
}

export default StructuralPrediction;
