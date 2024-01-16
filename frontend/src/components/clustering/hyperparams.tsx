import { Grid} from "@mui/material";
interface Props {
    algorithm: JSX.Element;
    kvalue?: JSX.Element;
    linkage?: JSX.Element;
    affinity?: JSX.Element;
    xi?: JSX.Element;
    min_samples?: JSX.Element;
    min_cluster_size?: JSX.Element;
    algorithm_value?: string;
  }

export default function Hyperparams({algorithm, kvalue, linkage, affinity, xi, min_samples, min_cluster_size, algorithm_value}: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {algorithm}
        </Grid>
        {((algorithm_value === "kmeans") ||
        (algorithm_value === "birch") ||
        (algorithm_value === "agglomerative")) && (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {kvalue}
            </Grid>
        )}

        {algorithm_value === "agglomerative" && (
        <>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {linkage}
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {affinity}
            </Grid>
        </>
        )}

        {algorithm_value === "optics" && (
        <>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {xi}
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {min_samples}
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {min_cluster_size}
            </Grid>
        </>
        )}
      </Grid>
    </>
  )
}