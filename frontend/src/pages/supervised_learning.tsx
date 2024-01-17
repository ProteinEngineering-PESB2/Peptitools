import { Box } from "@mui/material";
import { useState } from "react";
import BackdropComponent from "../components/common/backdrop_component";
import DashboardLayout from "../components/common/dashboard_layout";
import SectionTitle from "../components/common/section_title";
import SupervisedLearningContentClassification from "../components/supervised_learning/supervised_learning_content_classification";
import SupervisedLearningContentRegression from "../components/supervised_learning/supervised_learning_content_regression";
import SupervisedLearningForm from "../components/supervised_learning/supervised_learning_form";
import { useHandleSection } from "../hooks/useHandleSection";
import useLoadingComponent from "../hooks/useLoadingComponent";
import config from "../config.json";
import PredictForm from "../components/supervised_learning/prediction_form";
import PredictionContent from "../components/supervised_learning/prediction_content";

export default function SupervisedLearning() {
  const [openBackdropNewModel, setOpenBackdropNewModel] = useState<boolean>(false);
  const [result, setResult] = useState<any | undefined>(undefined);

  useHandleSection({ section: "supervised-learning" });
  useLoadingComponent();
  return (
    <DashboardLayout>
      <Box sx={{ padding: 4 }}>
        <BackdropComponent open={openBackdropNewModel} />
        <SectionTitle
          title={config.supervised_learning.title}
          description={config.supervised_learning.description}
        />

        <SupervisedLearningForm
          setResult={setResult}
        />
        {result && (
        <>
          {result.task == "classification" && <SupervisedLearningContentClassification result={result} />}
          {result.task == "regression" && <SupervisedLearningContentRegression result={result} />}
          <PredictForm result = {result} setResult={setResult}/>
          {result.predictions && <PredictionContent result = {result}/>}
        </>
        )}
      </Box>
    </DashboardLayout>
  );
}
