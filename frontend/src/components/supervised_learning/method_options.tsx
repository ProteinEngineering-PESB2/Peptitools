import { Grid} from "@mui/material";
interface Props {
    task: JSX.Element;
    train_test_split?: JSX.Element;
    k_fold?: JSX.Element;
  }

export default function MethodOptions({task, train_test_split, k_fold}: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {task}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {train_test_split}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {k_fold}
        </Grid>
      </Grid>
    </>
  )
}