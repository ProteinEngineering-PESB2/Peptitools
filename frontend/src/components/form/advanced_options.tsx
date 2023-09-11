import { Grid, SelectChangeEvent} from "@mui/material";
import SelectComponent from "../form/select_component";
import { IItemSelect } from "../../utils/interfaces";
interface Props {
    kernelItems: IItemSelect[];
    standItems: IItemSelect[];
    selectedKernel: string;
    selectedStand: string;
    handleChangeKernel: (e: SelectChangeEvent) => void;
    handleChangeStand: (e: SelectChangeEvent) => void;
  }

export default function AdvancedOptions({kernelItems, selectedKernel, handleChangeKernel,
    standItems, selectedStand, handleChangeStand}: Props){
    return (
        <>
        <Grid container spacing={2} marginTop={0}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <SelectComponent
                title="PCA Kernel"
                items={kernelItems}
                handleChange={handleChangeKernel}
                value={selectedKernel}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <SelectComponent
                title="Preprocessing"
                items={standItems}
                handleChange={handleChangeStand}
                value={selectedStand}
                />
            </Grid>
        </Grid>
        </>
    )
}