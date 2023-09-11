import { Grid, SelectChangeEvent} from "@mui/material";
import SelectComponent from "../form/select_component";
import { IItemSelect } from "../../utils/interfaces";
interface Props {
  encodings: IItemSelect[];
  embeddings: IItemSelect[];
  properties: IItemSelect[];
  selectedEncoding: string;
  selectedEmbedding: string;
  selectedProperty: string;
  handleChangeSelectedEncoding: (e: SelectChangeEvent) => void;
  handleChangeSelectedEmbedding: (e: SelectChangeEvent) => void;
  handleChangeSelectedProperty: (e: SelectChangeEvent) => void;
  }

export default function RepresentationOptions({
  encodings, selectedEncoding, handleChangeSelectedEncoding,
  embeddings, handleChangeSelectedEmbedding, selectedEmbedding,
  handleChangeSelectedProperty, properties, selectedProperty
  }: Props){
  return (
    <>
      <Grid container spacing={2} marginTop={0}>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <SelectComponent
            items={encodings}
            title="Encoding Type"
            value={selectedEncoding}
            handleChange={handleChangeSelectedEncoding}
          />
        </Grid>
        {selectedEncoding === "embedding" && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <SelectComponent
          items={embeddings}
          title="Embedding"
          value={selectedEmbedding}
          handleChange={handleChangeSelectedEmbedding}
          />
        </Grid>
        )}
        {(selectedEncoding === "physicochemical_properties" || selectedEncoding === "digital_signal_processing") && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <SelectComponent
            items={properties}
            title="Select Property"
            value={selectedProperty}
            handleChange={handleChangeSelectedProperty}
          />
        </Grid>
        )}
      </Grid>
    </>
  )
}