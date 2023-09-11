import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { parserFormDataWithOptions } from "../../helpers/parserFormData";
import { requestPost } from "../../services/api";
import { InitialValuePostData } from "../../utils/initial_values";
import { IDataFrequency, PostData } from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonRun from "../form/button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import useTextField from "../../hooks/useTextField";
import TextFieldComponent from "../form/text_field_component";
import SectionTitle from "../common/section_title";

interface Props {
  setResult: Dispatch<SetStateAction<IDataFrequency[]>>;
  service: {
    api: string;
    title: string;
    description: string;
    markdown_text: string;
  }
}

export default function StatisticForm({ setResult, service}: Props) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  const [ alpha, handleChangeAlpha ] = useTextField({actual: "0.05"});

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setOpenBackdrop(true);
    setResult(undefined);

    const options = {
      pvalue: alpha,
    };
    const postData = parserFormDataWithOptions(data, options);
    try {
      const { data } = await requestPost({
        url: service.api,
        postData,
      });

      if (data.status === "error") {
        toast.error(data.description);
      } else {
        const { result } = data;
        setResult(result);
      }

      setOpenBackdrop(false);
    } catch (error) {
      toast.error("Server error");
      setOpenBackdrop(false);
      setResult(undefined);
    }
  };

  return (
    <>
      <SectionTitle
        title={service.title}
        description={service.description}
      />
      <BackdropComponent open={openBackdrop} />
      <FormContainer markdownText={service.markdown_text}>
        <form onSubmit={onSubmit}>
          <InputFileType data={data} setData={setData} />
          <TextFieldFasta
            data={data}
            setData={setData}
          />
          <InputFileFasta data={data} setData={setData} />
          <TextFieldComponent
            title="Alpha"
            value={alpha}
            handleChange={handleChangeAlpha}
          />
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
