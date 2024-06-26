import { Box } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import FrequencyContent from "../components/frequency/frequency_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";
import StatisticForm from "../components/common/statistic_form";
import { StatisticsResult } from "../utils/interfaces";

export default function Frequency() {
  const [result, setResult] = useState<StatisticsResult | undefined>(undefined);
  useHandleSection({ section: "frequency" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <StatisticForm setResult={setResult} service = {config.frequency_evaluation} />
        {result && (
          <FrequencyContent result={result}/>
        )}
      </Box>
    </DashboardLayout>
  );
}
