import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { InitialValuePostData } from "../../utils/initial_values";
import { PostData } from "../../utils/interfaces";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import TextFieldFasta from "../form/text_field_fasta";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";
import { parserFormDataWithOptions } from "../../helpers/parserFormData";
import toast from "react-hot-toast";
import ActivityPrediction from "../../pages/activity_prediction";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const markdownText = `
  + **Input**: 
    + Between 1 and 200 amino acid sequences with fasta format.
    + Sequence with maxium length 150.
`;

type Props = {
  setOpenBackdrop: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<typeof ActivityPrediction[]>>;
  service: any;
};

function ActivityPredictionForm({
  setOpenBackdrop,
  setResult,
  service
}: Props) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [activitiesValue, setActivitiesValue] = useState<any>([]);
  const [allActivities, setAllActivities] = useState<boolean>(false);
  const [activities, setActivities] = useState([]);

  const getActivities = async () => {
    try {
      const response = await axios.get(service.models_api);
      setActivities(response.data);
    } catch (error) {
      setActivities([]);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(undefined);
    setOpenBackdrop(true);

    let options = new Object();
    if (allActivities) {
      const filterActivities = activities.map(
        (activity: any) => activity.value
      );
      options = {
        activities: filterActivities,
      };
    } else {
      const filterActivities = activitiesValue.map(
        (activity: any) => activity.value
      );
      options = {
        activities: filterActivities,
      };
    }

    try {
      const postData = parserFormDataWithOptions(data, options);

      const response = await axios.post(service.api, postData);
      if (response.data.status === "error") {
        toast.error(response.data.description);
      } else {
        setResult(response.data);
      }
    } catch (error) {
      toast.error("Server error");
    }

    setOpenBackdrop(false);
  };

  return (
    <FormContainer markdownText={markdownText}>
      <form onSubmit={handleSubmit}>
        <InputFileType data={data} setData={setData} />
        <TextFieldFasta
          data={data}
          setData={setData}
        />
        <InputFileFasta data={data} setData={setData} />

        <FormControlLabel
          control={
            <Switch
              checked={allActivities}
              onChange={(e) => setAllActivities(e.target.checked)}
            />
          }
          label={allActivities ? "All Activities" : "Select Activities"}
        />

        {allActivities === false && (
          <Autocomplete
            multiple
            id="activities-autocomplete"
            value={activitiesValue}
            onChange={(event, newValue) => {
              setActivitiesValue([...newValue]);
            }}
            options={activities}
            getOptionLabel={(activity) => activity.label}
            disableCloseOnSelect
            renderOption={(props, activity, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {activity.label}
              </li>
            )}
            sx={{ maxWidth: 400, marginTop: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Activities"
                placeholder="Activities"
              />
            )}
          />
        )}

        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: {
                xl: "12rem",
                lg: "12rem",
                md: "12rem",
                sm: "12rem",
                xs: "100%",
              },
              backgroundColor: "#2962ff",
              ":hover": { backgroundColor: "#3A6CF6" },
            }}
            size="medium"
            disabled={
              (data.fastaText === "" && data.fastaFile === null) ||
              (allActivities === false && activitiesValue.length === 0 && true)
            }
          >
            run
          </Button>
        </FormControl>
      </form>
    </FormContainer>
  );
}

export default ActivityPredictionForm;
