import { Grid} from "@mui/material";
interface Props {
    kernel: JSX.Element;
    standarization: JSX.Element;
  }

export default function AdvancedOptions({kernel, standarization}: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {kernel}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {standarization}
        </Grid>
      </Grid>
    </>
  )
}