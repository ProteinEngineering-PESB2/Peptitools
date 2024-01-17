import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { parserFormDataWithOptions } from "../../helpers/parserFormData";
import { requestPost } from "../../services/api";
import { downloadFile } from "../../services/downloadFile";
import { InitialValuePostData } from "../../utils/initial_values";
import { PostData } from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonRun from "../form/button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import AdvancedOptions from "../form/advanced_options";
import useSelectValue from "../../hooks/useSelectValue";
import config from "../../config.json";
import SelectComponent from "../form/select_component";
import SectionTitle from "../common/section_title";
import NumericalRepresentation from "../form/num_repr";

export default function EncodingForm({service}: any) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [openBackdropFile, setOpenBackdropFile] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

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


  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenBackdrop(true);

    const options = {
      encoding: selectedEncoding,
      pretrained_model: selectedEmbedding,
      selected_property: selectedProperty,
      kernel: selectedKernel,
      preprocessing: selectedStandarization,
    };
    const postData = parserFormDataWithOptions(data, options);

    try {
      const res = await requestPost({
        postData,
        url: service.api,
      })
      downloadFile({
        url: res.data.result.encoding_path,
        name: "encoding.csv",
        setOpenBackdrop: setOpenBackdropFile,
        setPercentage,
      });

    } catch (error: any) {
      toast.error(error.response.data.description);
      }
    setOpenBackdrop(false);
  }
  return (
    <>
      <SectionTitle
        title={service.title}
        description={service.description}
      />
      <BackdropComponent open={openBackdrop} />
      <BackdropComponent open={openBackdropFile} percentage={percentage} />
      <FormContainer markdownText={service.markdown_text}>
        <form onSubmit={onSubmit}>
          <InputFileType data={data} setData={setData} />
          <TextFieldFasta
            data={data}
            setData={setData}
          />
          <InputFileFasta data={data} setData={setData} />

          <NumericalRepresentation
            representation={encoding_element}
            repr_value={selectedEncoding}
            embeddings={embedding_element}
            properties={properties_element}
            />
          <AdvancedOptions 
            kernel={kernel_element} standarization = {standarization_element} />
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
