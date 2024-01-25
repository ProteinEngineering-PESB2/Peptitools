import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import AppProvider from "./context/AppProvider";
// Pages
import Home from "./pages/home";
import FastaConverter from "./pages/fasta_converter";
import MSA from "./pages/msa";
import Pfam from "./pages/pfam";
import GeneOntology from "./pages/gene_ontology";
import Frequency from "./pages/frequency";
import Physicochemical from "./pages/physicochemical";
import Encoding from "./pages/encoding";
import Clustering from "./pages/clustering";
import SupervisedLearning from "./pages/supervised_learning";
import { Routes, Route } from "react-router-loading";
import LoadingComponent from "./components/common/loading";
import NotFound from "./pages/not_found";
import StructuralPrediction from "./pages/structural_prediction";
import TestSequences from "./pages/test_sequences";
import ActivityPrediction from "./pages/predict";
import useHandlerBackendUrl from "./hooks/useHandlerBackendUrl";
import config from "./config.json"
export default function App() {
  const theme = createTheme();
  useHandlerBackendUrl();
  //For to add a new page, you create a component in pages folder, and bind it to the route in config.json file
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <>
          <BrowserRouter>
            <Routes loadingScreen={LoadingComponent}>
              <Route path={config.home.route} element={<Home />} loading />
              <Route path={config.convert_to_fasta.route} element={<FastaConverter />} loading />
              <Route path={config.test_sequences.route} element={<TestSequences />} loading />
              <Route path={config.msa.route} element={<MSA />} loading />
              <Route path={config.pfam.route} element={<Pfam />} loading />
              <Route path={config.gene_ontology.route} element={<GeneOntology />} loading />
              <Route path={config.frequency_evaluation.route} element={<Frequency />} loading />
              <Route path={config.structural_prediction.route} element={<StructuralPrediction />} loading />
              <Route path={config.properties_estimation.route} element={<Physicochemical />} loading/>
              <Route path={config.encoding_sequences.route} element={<Encoding />} loading />
              <Route path={config.clustering.route} element={<Clustering />} loading />
              <Route path={config.supervised_learning.route} element={<SupervisedLearning />} loading />
              <Route path={config.activity_prediction.route} element={<ActivityPrediction />} loading />
              <Route path="*" element={<NotFound />} loading />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </>
      </ThemeProvider>
    </AppProvider>
  );
}
