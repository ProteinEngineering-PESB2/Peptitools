import { FormEvent, useState } from "react";
import { parserFormDataWithoutOptions } from "../../helpers/parserFormData";
import { InitialValuePostData } from "../../utils/initial_values";
import ButtonRun from "../form/button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import toast from "react-hot-toast";
import { requestPost } from "../../services/api";
import BackdropComponent from "../common/backdrop_component";
import { Box } from "@mui/material";
import SectionTitle from "./section_title";
import { FormProps, PostData } from "../../utils/interfaces";

export default function GenericForm({ setResult, service }: FormProps) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenBackdrop(true);
    
    const postData = parserFormDataWithoutOptions(data);
    console.log(service);
    try {
      const { data } = await requestPost({
        url: service.api,
        postData,
      });
      setResult(data.result);
    } catch (error:any) {
      toast.error(error.response.data.description);
      setResult(undefined);
    }
    setOpenBackdrop(false);
  };
  return (
    <>
      <Box>
        <SectionTitle
          title={service.title}
          description={service.description}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <BackdropComponent open={openBackdrop} />
        <FormContainer markdownText={service.markdown_text}>
          <form onSubmit={onSubmit}>
            <InputFileType data={data} setData={setData} />
            <TextFieldFasta data={data} setData={setData} />
            <InputFileFasta data={data} setData={setData} />
            <ButtonRun data={data} />
          </form>
        </FormContainer>
      </Box>
    </>
  );
}
