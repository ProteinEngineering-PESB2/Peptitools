import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ClusteringContent from "../components/clustering/clustering_content";
import ClusteringForm from "../components/clustering/clustering_form";
import DashboardLayout from "../components/common/dashboard_layout";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";

export default function Clustering() {
  const [result, setResult] = useState<any>(null);
  useHandleSection({ section: "clustering" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <ClusteringForm setResult={setResult} service = {config.clustering} />
        {result && <ClusteringContent result={result} />}
      </Box>
    </DashboardLayout>
  );
}
