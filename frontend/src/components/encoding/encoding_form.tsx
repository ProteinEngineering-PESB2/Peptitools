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
import RepresentationOptions from "../form/representation_method_options";
import useSelectValue from "../../hooks/useSelectValue";
import config from "../../config.json";
import SectionTitle from "../common/section_title";

export default function EncodingForm({service}: any) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [openBackdropFile, setOpenBackdropFile] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const [ selectedEmbedding, embeddings, handleChangeSelectedEmbedding ] = useSelectValue(
    {array_values: config.embeddings});
  const [ selectedEncoding, encodings, handleChangeSelectedEncoding ] = useSelectValue(
    {array_values: config.encodings});
  const [ selectedProperty, properties, handleChangeSelectedProperty ] = useSelectValue(
    {array_values: config.properties});

  const [ selectedStandarization, standarizations, handleChangeSelectedStandarization ] = useSelectValue(
    {array_values: config.standarizations});

  const [ selectedKernel, kernelsSupervisedLearning, handleChangeSelectedKernel ] = useSelectValue(
    {array_values: config.kernels});
  
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
      const { data } = await requestPost({
        postData,
        url: service.api,
      });

      if (data.status === "error") {
        toast.error(data.description);
      } else {
        const { result } = data;
        
        downloadFile({
          url: result.path,
          name: "encoding.csv",
          setOpenBackdrop: setOpenBackdropFile,
          setPercentage,
        });
      }

      setOpenBackdrop(false);
    } catch (error) {
      toast.error("Server error");
      setOpenBackdrop(false);
    }
  };

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
          <RepresentationOptions 
            encodings = {encodings} selectedEncoding = {selectedEncoding} handleChangeSelectedEncoding = {handleChangeSelectedEncoding}
            embeddings = {embeddings} handleChangeSelectedEmbedding = {handleChangeSelectedEmbedding} selectedEmbedding = {selectedEmbedding}
            handleChangeSelectedProperty = {handleChangeSelectedProperty} properties = {properties} selectedProperty = {selectedProperty} />
          <AdvancedOptions 
            kernelItems = {kernelsSupervisedLearning} selectedKernel = {selectedKernel} handleChangeKernel = {handleChangeSelectedKernel}
            standItems = {standarizations} selectedStand = {selectedStandarization} handleChangeStand = {handleChangeSelectedStandarization} />
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
