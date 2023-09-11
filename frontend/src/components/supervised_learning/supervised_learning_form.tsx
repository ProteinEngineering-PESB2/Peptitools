import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { parserFormDataWithOptions } from "../../helpers/parserFormData";
import { useSelectAlgorithmSupervisedLearning } from "../../hooks/useSelectAlgorithmSupervisedLearning";
import  useTextField from "../../hooks/useTextField";
import { requestPost } from "../../services/api";
import { InitialValuePostData } from "../../utils/initial_values";
import {
  IDataClassificationSupervisedLearning,
  IDataRegressionSupervisedLearning,
  PostData,
} from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonRun from "../form/button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import AdvancedOptions from "../form/advanced_options";
import RepresentationOptions from "../form/representation_method_options";
import TrainingOptions from "../form/training_options";
import config from "../../config.json";
import useSelectValue from "../../hooks/useSelectValue";

interface Props {
  setResultClassification: Dispatch<
    SetStateAction<IDataClassificationSupervisedLearning | null>
  >;
  setResultRegression: Dispatch<
    SetStateAction<IDataRegressionSupervisedLearning | null>
  >;
  setTaskType: Dispatch<SetStateAction<string>>;
  setEncoding: Dispatch<SetStateAction<string>>;
  setProperty: Dispatch<SetStateAction<string>>;
}

const markdownText = `
  + **Input**: 
    + CSV File.
    + **Columns**: id - sequence - target.
    + 200 or more amino acid sequences.
    + Sequences with maxium length 150.
`;

export default function SupervisedLearningForm({
  setResultClassification,
  setResultRegression,
  setTaskType,
  setEncoding,
  setProperty,
}: Props) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  const [ selectedEncoding, encodings, handleChangeSelectedEncoding ] = useSelectValue(
    {array_values: config.encodings});

  const [ selectedProperty, properties, handleChangeSelectedProperty ] = useSelectValue(
    {array_values: config.properties});

  const [ selectedKernel, kernelsSupervisedLearning, handleChangeSelectedKernel ] = useSelectValue(
    {array_values: config.kernels});

  const [ selectedStandarization, standarizations, handleChangeSelectedStandarization ] = useSelectValue(
    {array_values: config.standarizations});

  const [ selectedTaskType, taskTypes, handleChangeSelectedTaskType ] = useSelectValue(
    {array_values: config.supervised_learning.task_types});
  
  const [ selectedTestSize, test_size, handleChangeSelectedTestSize ] = useSelectValue(
    {array_values: config.supervised_learning.test_size});
    
  const [ kvalue, handleChangeKValue ] = useTextField({actual: "2"});
  
  const {
    selectedAlgorithm,
    sl_algorithms_clf,
    sl_algorithms_regr,
    handleChangeSelectedAlgorithm,
  } = useSelectAlgorithmSupervisedLearning({ taskType: selectedTaskType });
    
  const [ selectedEmbedding, embeddings, handleChangeSelectedEmbedding ] = useSelectValue(
    {array_values: config.embeddings});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setOpenBackdrop(true);
    setResultClassification(null);
    setResultRegression(null);

    const options = {
      encoding: selectedEncoding,
      selected_property: selectedProperty,
      task: selectedTaskType,
      algorithm: selectedAlgorithm,
      validation: parseInt(kvalue),
      test_size: parseFloat(selectedTestSize),
      kernel: selectedKernel,
      preprocessing: selectedStandarization,
      pretrained_model: selectedEmbedding,
    };

    const postData = parserFormDataWithOptions(data, options);

    try {
      const { data } = await requestPost({
        postData,
        url: "/api/supervised_learning/",
      });

      if (data.status === "error") {
        toast.error(data.description);
      } else {
        const { job_path, result } = data;

        if (selectedTaskType === "classification") {
          setTaskType("classification");
          setResultClassification({ job_path, result });
        }
        if (selectedTaskType === "regression") {
          setTaskType("regression");
          setResultRegression({ job_path, result });
        }
      }
      setEncoding(selectedEncoding);
      setProperty(selectedProperty);
      setOpenBackdrop(false);
    } catch (error) {
      toast.error("Server error");
      setResultClassification(null);
      setResultRegression(null);
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <BackdropComponent open={openBackdrop} />
      <FormContainer markdownText={markdownText}>
        <form onSubmit={handleSubmit}>
          <InputFileType data={data} setData={setData} />
          <TextFieldFasta
            data={data}
            setData={setData}
          />
          <InputFileFasta data={data} setData={setData} />
          <RepresentationOptions 
            encodings = {encodings} selectedEncoding = {selectedEncoding} handleChangeSelectedEncoding = {handleChangeSelectedEncoding}
            embeddings = {embeddings} handleChangeSelectedEmbedding = {handleChangeSelectedEmbedding} selectedEmbedding = {selectedEmbedding}
            handleChangeSelectedProperty = {handleChangeSelectedProperty} properties = {properties} selectedProperty = {selectedProperty} />
          <TrainingOptions
            kvalue = {kvalue} handleChangeKValue = {handleChangeKValue}
            taskTypes = {taskTypes} handleChangeSelectedTaskType = {handleChangeSelectedTaskType}
            selectedTaskType = {selectedTaskType}
            sl_algorithms_regr = {sl_algorithms_regr} sl_algorithms_clf = {sl_algorithms_clf}
            handleChangeSelectedAlgorithm = {handleChangeSelectedAlgorithm}
            selectedAlgorithm = {selectedAlgorithm} test_size = {test_size}
            handleChangeSelectedTestSize = {handleChangeSelectedTestSize} selectedTestSize = {selectedTestSize} />
          <AdvancedOptions 
            kernelItems = {kernelsSupervisedLearning} selectedKernel = {selectedKernel} handleChangeKernel = {handleChangeSelectedKernel}
            standItems = {standarizations} selectedStand = {selectedStandarization} handleChangeStand = {handleChangeSelectedStandarization} />
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
