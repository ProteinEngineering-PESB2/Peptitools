import { Grid} from "@mui/material";
interface Props {
    representation: JSX.Element;
    embeddings?: JSX.Element;
    properties?: JSX.Element;
    repr_value?: string;
  }

export default function NumericalRepresentation({representation, repr_value, embeddings, properties}: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {representation}
        </Grid>
        {repr_value === "embedding" && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {embeddings}
        </Grid>
        )}
        {(repr_value === "physicochemical_properties" || repr_value === "digital_signal_processing") && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {properties}
        </Grid>
        )}
      </Grid>
    </>
  )
}