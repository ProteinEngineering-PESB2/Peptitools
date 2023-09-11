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
import {
  InitialValuePostData,
  InitialValueTable,
} from "../utils/initial_values";
import {
  IDataClassificationSupervisedLearning,
  IDataRegressionSupervisedLearning,
  ITable,
  PostData,
} from "../utils/interfaces";
import config from "../config.json";

export default function SupervisedLearning() {
  const [tableNewModel, setTableNewModel] = useState<ITable>(InitialValueTable);
  const [taskType, setTaskType] = useState<string>("");
  const [encoding, setEncoding] = useState<string>("");
  const [property, setProperty] = useState<string>("");
  const [openBackdropNewModel, setOpenBackdropNewModel] =
    useState<boolean>(false);
  const [dataNewModel, setDataNewModel] =
    useState<PostData>(InitialValuePostData);
  const [resultClassification, setResultClassification] =
    useState<IDataClassificationSupervisedLearning | null>(null);
  const [resultRegression, setResultRegression] =
    useState<IDataRegressionSupervisedLearning | null>(null);

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
          setResultClassification={setResultClassification}
          setResultRegression={setResultRegression}
          setTaskType={setTaskType}
          setEncoding={setEncoding}
          setProperty={setProperty}
        />

        {resultClassification && (
          <SupervisedLearningContentClassification
            result={resultClassification}
          />
        )}
        {resultRegression && (
          <SupervisedLearningContentRegression result={resultRegression} />
        )}
      </Box>
    </DashboardLayout>
  );
}
