import { Grid} from "@mui/material";
interface Props {
    task_type: string;
    class_algorithms: JSX.Element;
    regr_algorithms: JSX.Element;
  }

export default function AlgorithmOptions({task_type, class_algorithms, regr_algorithms}: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        {(task_type === "classification") && 
        (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {class_algorithms}
            </Grid>)
        }
        {(task_type === "regression") && 
        (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {regr_algorithms}
            </Grid>)
        }
      </Grid>
    </>
  )
}