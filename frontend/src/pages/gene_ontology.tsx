import { Box } from "@mui/material";
import { useState } from "react";
import DashboardLayout from "../components/common/dashboard_layout";
import GeneOntologyContent from "../components/gene_ontology/gene_ontology_content";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import { IDataGeneOntology } from "../utils/interfaces";
import config from "../config.json";
import GenericForm from "../components/common/generic_form";

export default function GeneOntology() {
  const [result, setResult] = useState<any>();

  useHandleSection({ section: "gene-ontology" });
  useLoadingComponent();

  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <>
        <GenericForm setResult={setResult} service={config.gene_ontology}/>
        {result && <GeneOntologyContent result={result} />}
        </>
      </Box>
    </DashboardLayout>
  );
}
