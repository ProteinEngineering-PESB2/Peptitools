import { Grid, SelectChangeEvent} from "@mui/material";
import SelectComponent from "../form/select_component";
import { IItemSelect } from "../../utils/interfaces";
import TextFieldComponent from "../form/text_field_component";
interface Props {
  algorithms: IItemSelect[];
  selectedAlgorithm: string;
  handleChangeSelectedAlgorithm: (e: SelectChangeEvent) => void;
  kvalue: string;
  handleChangeKValue: (e: SelectChangeEvent) => void;
  linkages: IItemSelect[];
  selectedLinkage: string;
  handleChangeSelectedLinkage: (e: SelectChangeEvent) => void;
  affinities: IItemSelect[];
  selectedAffinity: string;
  handleChangeSelectedAffinity: (e: SelectChangeEvent) => void;
  xi: string;
  handleChangeXi: (e: SelectChangeEvent) => void;
  minSamples: string;
  handleChangeMinSamples: (e: SelectChangeEvent) => void;
  minClusterSize: string;
  handleChangeMinClusterSize: (e: SelectChangeEvent) => void;
  }

export default function AlgorithmOptions({
  algorithms, selectedAlgorithm, handleChangeSelectedAlgorithm,
  kvalue, handleChangeKValue,
  linkages, selectedLinkage, handleChangeSelectedLinkage,
  affinities, selectedAffinity, handleChangeSelectedAffinity,
  xi, handleChangeXi,
  minSamples, handleChangeMinSamples,
  minClusterSize, handleChangeMinClusterSize,
  }: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <SelectComponent
            items={algorithms}
            title="Algorithm"
            value={selectedAlgorithm}
            handleChange={handleChangeSelectedAlgorithm}
        />
        </Grid>
            
        {(selectedAlgorithm === "kmeans" ||
        selectedAlgorithm === "birch" ||
        selectedAlgorithm === "agglomerative") && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextFieldComponent
            title="K-Value"
            value={kvalue}
            handleChange={handleChangeKValue}
            />
        </Grid>
        )}
        {selectedAlgorithm === "agglomerative" && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <SelectComponent
            items={linkages}
            title="Linkage"
            value={selectedLinkage}
            handleChange={handleChangeSelectedLinkage}
            />
        </Grid>
        )}
        {selectedAlgorithm === "agglomerative" && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <SelectComponent
            items={affinities}
            title="Affinity"
            value={
            selectedLinkage === "ward"
            ? "euclidean"
            : selectedAffinity
            }
            handleChange={handleChangeSelectedAffinity}
            disabled={
            selectedLinkage === "ward"
            ? true
            : false
            }
            />
        </Grid>
        )}
        {selectedAlgorithm === "optics" && (
        <>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextFieldComponent
            title="Xi"
            value={xi}
            handleChange={handleChangeXi}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextFieldComponent
            title="Min Samples"
            value={minSamples}
            handleChange={handleChangeMinSamples}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextFieldComponent
            title="Min Cluster Size"
            value={minClusterSize}
            handleChange={handleChangeMinClusterSize}
            />
        </Grid></>
      )}
      </Grid>
    </>
  )
}