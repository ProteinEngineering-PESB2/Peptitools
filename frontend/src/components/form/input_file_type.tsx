import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { EnumFileType } from "../../utils/enums";
import { PostData } from "../../utils/interfaces";

interface Props {
  data: PostData;
  setData: Dispatch<SetStateAction<PostData>>;
}

export default function InputFileType({ data, setData }: Props) {
  const handleChangeFileType = (e: ChangeEvent<HTMLInputElement>): void => {
    setData({ ...data, fileType: (e.target as HTMLInputElement).value });
  };

  return (
    <FormControl fullWidth>
      <FormLabel id="label-file-type">File Type</FormLabel>
      <RadioGroup
        row
        aria-labelledby="label-file-type"
        name="row-file-alignment-type"
        value={data.fileType}
        onChange={handleChangeFileType}
      >
        <FormControlLabel
          value="text"
          control={<Radio />}
          label="Fasta Text"
          checked={data.fileType === EnumFileType.TEXT}
        />
        <FormControlLabel
          value="fasta"
          control={<Radio />}
          label="Fasta File"
          checked={data.fileType === EnumFileType.FASTA_FILE}
        />
        <FormControlLabel
          value="csv"
          control={<Radio />}
          label="Csv File"
          checked={data.fileType === EnumFileType.CSV_FILE}
        />
      </RadioGroup>
    </FormControl>
  );
}
