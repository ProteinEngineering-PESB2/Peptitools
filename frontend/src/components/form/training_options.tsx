import { Grid, SelectChangeEvent} from "@mui/material";
import SelectComponent from "../form/select_component";
import { IItemSelect } from "../../utils/interfaces";
import TextFieldComponent from "../form/text_field_component";
interface Props {
  kvalue: string;
  selectedTaskType: string;
  selectedTestSize: string;
  selectedAlgorithm: string;
  taskTypes: IItemSelect[];
  test_size: IItemSelect[];
  sl_algorithms_regr: IItemSelect[];
  sl_algorithms_clf: IItemSelect[];
  handleChangeKValue: (e: SelectChangeEvent) => void;
  handleChangeSelectedTaskType: (e: SelectChangeEvent) => void;
  handleChangeSelectedAlgorithm: (e: SelectChangeEvent) => void;
  handleChangeSelectedTestSize: (e: SelectChangeEvent) => void;
  }

export default function TrainingOptions({
    kvalue, handleChangeKValue,
    taskTypes, handleChangeSelectedTaskType, selectedTaskType,
    sl_algorithms_regr, sl_algorithms_clf,
    handleChangeSelectedAlgorithm,
    selectedAlgorithm, test_size, handleChangeSelectedTestSize, selectedTestSize
    }: Props){
  return (
    <>
    <Grid container spacing={2} marginTop={0}>
      <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
        <TextFieldComponent
        title="Number of folds cross validation"
        value={kvalue}
        handleChange={handleChangeKValue}
        />
      </Grid>
      <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
        <SelectComponent
        title="Task Type"
        items={taskTypes}
        handleChange={handleChangeSelectedTaskType}
        value={selectedTaskType}
        />
      </Grid>
      <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
        <SelectComponent
        title="Algorithm"
        items={
          selectedTaskType === "classification"
          ? sl_algorithms_regr
          : sl_algorithms_clf
        }
        handleChange={handleChangeSelectedAlgorithm}
        value={selectedAlgorithm}
        />
      </Grid>
      <Grid item xl={2} lg={3} md={4} sm={6} xs={12}>
        <SelectComponent
        title="Test Size"
        items={test_size}
        handleChange={handleChangeSelectedTestSize}
        value={selectedTestSize}
        />
      </Grid>
    </Grid>
    </>
  )
}