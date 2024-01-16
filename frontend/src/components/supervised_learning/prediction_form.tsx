import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { parserFormDataWithOptions } from "../../helpers/parserFormData";
import { requestPost } from "../../services/api";
import { InitialValuePostData } from "../../utils/initial_values";
import {PostData} from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonRun from "../form/button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import config from "../../config.json";

interface Props {
    result: any;
    setResult: any;
}

const markdownText = `
  + **Input**: 
    + CSV File.
    + **Columns**: id - sequence - target.
    + 200 or more amino acid sequences.
    + Sequences with maxium length 150.
`;

export default function PredictForm({result, setResult}: Props) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setOpenBackdrop(true);
    const postData = parserFormDataWithOptions(data, result);
    try {
      const { data } = await requestPost({
        postData,
        url: config.evaluate_model.api
      });
      setResult(data.result)
    } catch (error:any) {
      toast.error(error.response.data.description);
      setOpenBackdrop(false);
    }
  setOpenBackdrop(false);
  };

  return (
    <>
      <BackdropComponent open={openBackdrop} />
      <FormContainer markdownText={markdownText}>
        <form onSubmit={handleSubmit}>
          <InputFileType data={data} setData={setData} />
          <TextFieldFasta data={data} setData={setData} />
          <InputFileFasta data={data} setData={setData} />
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
