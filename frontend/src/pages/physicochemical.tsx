import { Box } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import PhysichochemicalContent from "../components/physicochemical/physicochemical_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";
import StatisticForm from "../components/common/statistic_form";
import { StatisticsResult } from "../utils/interfaces";


export default function Phisicochemical() {
  const [result, setResult] = useState<StatisticsResult | undefined>(undefined);

  useHandleSection({ section: "physicochemical" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <StatisticForm setResult={setResult} service = {config.properties_estimation}/>
        {result && <PhysichochemicalContent result={result} />}
      </Box>
    </DashboardLayout>
  );
}
