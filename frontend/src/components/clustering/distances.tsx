import { Grid} from "@mui/material";
interface Props {
    distance: JSX.Element;
    type: JSX.Element;
  }

export default function DistanceOptions({distance, type}: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {distance}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {type}
        </Grid>
      </Grid>
    </>
  )
}