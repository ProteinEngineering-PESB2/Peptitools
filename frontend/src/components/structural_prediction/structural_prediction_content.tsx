import {
  Box,
  FormControl,
  Grid,
  Paper
} from "@mui/material";
import { useEffect, useState } from "react";
import ProSeqViewer from "../common/pro_seq_viewer";
import AutocompleteComponent from "../form/autocomplete_component";
import { usePfamAutocomplete } from "../../hooks/usePfamAutocomplete";

interface Props {
  result: any;
}

function StructuralPredictionContent({result}: Props) {
  const [alignment, setAlignment] = useState(null);
  const { sequences, selectedSequence, handleSequenceSelected, table } =
    usePfamAutocomplete({ result });

  const handleShowSequence = () => {
    result.map((r: any) => {
      if (r.id === selectedSequence) {
        setAlignment(r.alignment);
      }
    });
  };

  useEffect(() => {
    handleShowSequence();
  }, [selectedSequence]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Box marginTop={3}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <FormControl>
                <AutocompleteComponent
                  options={sequences}
                  handleChangeValue={handleSequenceSelected}
                  title="Sequence"
                  value={selectedSequence}
                />
              </FormControl>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Box
        marginTop={3}
        boxShadow={4}
        sx={{
          width: {
            xs: "25rem",
            sm: "35rem",
            md: "50rem",
            lg: "60rem",
            xl: "70rem",
          },
        }}
      >
        {alignment && <ProSeqViewer sequences={alignment} color={true} />}
      </Box>
    </>
  );
}

export default StructuralPredictionContent;
