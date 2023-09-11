import { Box } from "@mui/material";
import { useState } from "react";
import ActivityPredictionForm from "../components/activity_prediction/activity_prediction_form";
import ActivityPredictionTable from "../components/activity_prediction/activity_prediction_content";
import BackdropComponent from "../components/common/backdrop_component";
import DashboardLayout from "../components/common/dashboard_layout";
import SectionTitle from "../components/common/section_title";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json"

function ActivityPrediction() {
  useLoadingComponent();
  useHandleSection({ section: "activity-prediction" });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [result, setResult] = useState(undefined);
  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <BackdropComponent open={openBackdrop} />

        <SectionTitle
          title={config.activity_prediction.title}
          description={config.activity_prediction.description}
        />

        <ActivityPredictionForm
          setOpenBackdrop={setOpenBackdrop}
          setResult={setResult}
        />
        {result !== undefined && <ActivityPredictionTable result={result.result} />}
      </Box>
    </DashboardLayout>
  );
}

export default ActivityPrediction;
