import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parserFormDataWithOptions } from "../../helpers/parserFormData";
import { requestPost } from "../../services/api";
import { InitialValuePostData } from "../../utils/initial_values";
import {PostData} from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonRun from "../form/button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "./input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import config from "../../config.json";
import {Box} from "@mui/material";
import SectionTitle from "../common/section_title";

interface Props {
    result: any;
    setResult: any;
}

export default function PredictForm({result, setResult}: Props) {
  const [predict_data, setPreditData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setOpenBackdrop(true);
    const postData = parserFormDataWithOptions(predict_data, result);
    try {
      const { data } = await requestPost({
        url: config.evaluate_model.api,
        postData
      });
      setResult(data.result)
    } catch (error:any) {
      toast.error(error.response.data.description);
    }
  setOpenBackdrop(false);
  };
  return (
    <>
    <Box sx={{ width: "100%", padding: 4 }}>
      <SectionTitle
        title={config.evaluate_model.title}
        description={config.evaluate_model.description}
      />
    </Box>

    <Box sx={{ width: "100%", padding: 4 }}>
      <BackdropComponent open={openBackdrop} />
      <FormContainer markdownText={config.evaluate_model.markdown_text}>
        <form onSubmit={handleSubmit}>
          <InputFileType data={predict_data} setData={setPreditData} />
          <TextFieldFasta data={predict_data} setData={setPreditData} />
          <InputFileFasta data={predict_data} setData={setPreditData} />
          <ButtonRun data={predict_data} />
        </form>
      </FormContainer>
    </Box>
    </>
  );
}
