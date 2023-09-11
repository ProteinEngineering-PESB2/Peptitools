import { Grid, SelectChangeEvent} from "@mui/material";
import SelectComponent from "../form/select_component";
import { IItemSelect } from "../../utils/interfaces";
interface Props {
    clustering_distances: IItemSelect[];
    filter_types_clustering: IItemSelect[];
    selectedClusteringDistance: string;
    selectedFilterTypeClustering: string;
    handleChangeSelectClusteringDistance: (e: SelectChangeEvent) => void;
    handleChangeSelectFilterTypeClustering: (e: SelectChangeEvent) => void;
  }

export default function DistanceOptions({clustering_distances, selectedClusteringDistance, handleChangeSelectClusteringDistance,
    filter_types_clustering, selectedFilterTypeClustering, handleChangeSelectFilterTypeClustering}: Props){
    return (
        <>
        <Grid container spacing={2} marginTop={0}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <SelectComponent
                items={clustering_distances}
                title="Distance Type"
                value={selectedClusteringDistance}
                handleChange={handleChangeSelectClusteringDistance}
            />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <SelectComponent
                items={filter_types_clustering}
                title="Filter Type"
                value={selectedFilterTypeClustering}
                handleChange={handleChangeSelectFilterTypeClustering}
            />
            </Grid>
        </Grid>
        </>
    )
}