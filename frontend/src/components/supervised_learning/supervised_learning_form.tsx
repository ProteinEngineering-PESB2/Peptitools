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
import NumericalRepresentation from "../form/num_repr";
import TrainingOptions from "../form/training_options";
import config from "../../config.json";
import useSelectValue from "../../hooks/useSelectValue";
import SelectComponent from "../form/select_component";
import MethodOptions from "./method_options";
import AlgorithmOptions from "./algorithm_options";

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

  const [ selectedTaskType, task_types, handleChangeTaskType ] = useSelectValue(
    {array_values: config.supervised_learning.task_types});
    
  const task_type_element = <SelectComponent
    items={task_types}
    title="Task"
    value={selectedTaskType}
    handleChange={handleChangeTaskType}
  />

  const [ selectedEncoding, encodings, handleChangeSelectedEncoding ] = useSelectValue(
    {array_values: config.encodings});
    
  const encoding_element = <SelectComponent
    items={encodings}
    title="Encoding Type"
    value={selectedEncoding}
    handleChange={handleChangeSelectedEncoding}
  />

  const [ selectedEmbedding, embeddings, handleChangeSelectedEmbedding ] = useSelectValue(
    {array_values: config.embeddings});
    
  const embedding_element = <SelectComponent
    items={embeddings}
    title="Embedding"
    value={selectedEmbedding}
    handleChange={handleChangeSelectedEmbedding}
  />

  const [ selectedProperty, properties, handleChangeSelectedProperty ] = useSelectValue(
    {array_values: config.properties});
    
  const properties_element = <SelectComponent
    items={properties}
    title="Physicochemical property"
    value={selectedProperty}
    handleChange={handleChangeSelectedProperty}
  />

    const [ selectedKernel, kernels, handleChangeKernel ] = useSelectValue(
      {array_values: config.kernels});
      
    const kernel_element = <SelectComponent
      items={kernels}
      title="PCA Kernel"
      value={selectedKernel}
      handleChange={handleChangeKernel}
    />
  
    const [ selectedStandarization, standarizations, handleChangeStandarization ] = useSelectValue(
      {array_values: config.standarizations});
      
    const standarization_element = <SelectComponent
      items={standarizations}
      title="Standarization"
      value={selectedStandarization}
      handleChange={handleChangeStandarization}/>

  const [ selectedTestSize, test_size, handleChangeSelectedTestSize ] = useSelectValue(
    {array_values: config.supervised_learning.test_size});
    
  const train_test_element = <SelectComponent
      items={test_size}
      title="Test split"
      value={selectedTestSize}
      handleChange={handleChangeSelectedTestSize}/>

  const [ selectedKfold, k_folds, handleChangeSelectedKfold ] = useSelectValue(
    {array_values: config.supervised_learning.k_folds});
    
  const kfold_element = <SelectComponent
      items={k_folds}
      title="K folds"
      value={selectedKfold}
      handleChange={handleChangeSelectedKfold}/>
      
  const [
    selectedAlgorithmClf, sl_algorithms_clf, handleChangeSelectedAlgorithmClf] = useSelectValue({ array_values: config.supervised_learning.sl_algorithms_clf });

  const clf_algorithm_element = <SelectComponent
      items={sl_algorithms_clf}
      title="Classification algorithm"
      value={selectedAlgorithmClf}
      handleChange={handleChangeSelectedAlgorithmClf}/>

  const [
    selectedAlgorithmRegr, sl_algorithms_regr, handleChangeSelectedAlgorithmRegr] = useSelectValue({ array_values: config.supervised_learning.sl_algorithms_regr });

  const regr_algorithm_element = <SelectComponent
      items={sl_algorithms_regr}
      title="Regression algorithm"
      value={selectedAlgorithmRegr}
      handleChange={handleChangeSelectedAlgorithmRegr}/>

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setOpenBackdrop(true);
    setResultClassification(null);
    setResultRegression(null);
    let selected_algorithm = ""
    if (selectedTaskType == "classification"){
      selected_algorithm = selectedAlgorithmClf
    }
    else{
      selected_algorithm = selectedAlgorithmRegr
    }
    const options = {
      encoding: selectedEncoding,
      selected_property: selectedProperty,
      task: selectedTaskType,
      algorithm: selected_algorithm,
      validation: Number(selectedKfold),
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
      const { result } = data;
      if (selectedTaskType === "classification") {
        setTaskType("classification");
        setResultClassification({ result });
      }
      if (selectedTaskType === "regression") {
        setTaskType("regression");
        setResultRegression({ result });
      }
      setEncoding(selectedEncoding);
      setProperty(selectedProperty);
    } catch (error:any) {
      toast.error(error.response.data.description);
      setResultClassification(null);
      setResultRegression(null);
    }
  setOpenBackdrop(false);
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
          <MethodOptions
            task={task_type_element}
            train_test_split={train_test_element}
            k_fold={kfold_element}/>
          <AlgorithmOptions
          task_type={selectedTaskType}
          class_algorithms={clf_algorithm_element}
          regr_algorithms={regr_algorithm_element}/>
          <NumericalRepresentation
            representation={encoding_element}
            repr_value={selectedEncoding}
            embeddings={embedding_element}
            properties={properties_element} />
          <AdvancedOptions 
            kernel={kernel_element} standarization = {standarization_element} />
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
