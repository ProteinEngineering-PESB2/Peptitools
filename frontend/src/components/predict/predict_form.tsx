import { useEffect, useState , FormEvent} from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import { InitialValuePostData } from "../../utils/initial_values";
import { PostData } from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonRun from "./button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import SectionTitle from "../common/section_title";
import axios from "axios";
import config from "../../config.json";
import SelectOptions from "./select_options";
import { parserFormDataWithOptions } from "../../helpers/parserFormData";
import CheckParents from "./check_parents";
import PredictionContent from "./prediction_content";
import SelectComponent from "../form/select_component";
import { Box, Grid, Paper} from "@mui/material";

export default function PredictForm({service}: any) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [openBackdropFile, setOpenBackdropFile] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const [activities, setActivities] = useState([]);
  const [ids, setIds] = useState([]);
  const [query, setQuery] = useState({})
  const [result, setResult] = useState<any>(undefined)
  const [predicted_activities, setPredictedActivities] = useState<any>()
  const [selected_predicted_activity, setSelectedPredictedActivity] = useState<any>()
  const get_activities = async ()=>{
    const res = await axios.get(config.predict.form_api)
    setActivities(res.data.activities)
    setIds(res.data.activities)
  }
  useEffect(()=>{
    get_activities()
  }, [])
  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    setOpenBackdrop(true);
    e.preventDefault();
    setResult(undefined)
    const postData = parserFormDataWithOptions(data, query);
    const res = await axios.post("/api/predict/activity/", postData)
    setResult(res.data.data)
    setPredictedActivities(res.data.predicted_activities)
    setOpenBackdrop(false);
  }

  const handleChangePredictedActivity = (event: SelectChangeEvent<any>) => {
    const { target: { value }} = event;
    setSelectedPredictedActivity(
      typeof value === 'string' ? value.split(',')[0] : value[0],
    );
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
          <SelectOptions
            options = {{name: activities, id_activity: ids}}
            setQuery = {setQuery}
            query = {query}/>
          <CheckParents
            setQuery = {setQuery}
            query = {query}/>
          <ButtonRun data={data} query={query}/>
        </form>
      </FormContainer>
      {(result !== undefined) &&
        (<>
      <Box marginTop={3} boxShadow={4}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <SelectComponent
              title="Predicted activity"
              items={predicted_activities}
              value={selected_predicted_activity}
              handleChange={handleChangePredictedActivity}
            />
            {(selected_predicted_activity !== undefined) && 
            (
              <PredictionContent result={result[selected_predicted_activity]}></PredictionContent>
            )}
            </Paper>
          </Box>
      </>)  
      }
    </>
  );
}
