import { FormControl, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { PostData } from "../../utils/interfaces";
import { EnumFileType } from "../../utils/enums";
import toast from "react-hot-toast";

const Input = styled("input")({
  display: "none",
  width: "100%",
});

interface Props {
  data: PostData;
  setData: Dispatch<SetStateAction<PostData>>;
}

export default function InputFileFasta({ data, setData }: Props) {
  const handleChangeFastaInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target !== null && e.target.files !== null && e.target.files.length === 1) {
      let nameFile = e.target.files[0].name;

      const text_splitted = e.target.files[0].name.split(".")
      const extention = text_splitted[text_splitted.length - 1]
      if (e.target.files[0].name.length > 15) {
        nameFile = e.target.files[0].name.substring(0, 7) + "..." + extention;
      }
      if ( data.fileType ===  extention ){
        if ( e.target.files[0].size < 1048576 ){
          setData({
            ...data,
            fastaFile: e.target.files[0],
            fastaFileName: nameFile,
          });
        }
        else{
          toast.error("File size exceeds 1 MB")
        }
      }
      else {
        toast.error("Check your file type.")
      }
    }
  };
  return (
    <FormControl sx={{ marginY: 1 }} fullWidth>
      <>
      <label htmlFor="contained-button-file" style={{ width: "100%" }}>
        <Input
          id="contained-button-file"
          type="file"
          disabled={data.fileType === EnumFileType.TEXT}
          onChange={handleChangeFastaInput}
        />
        <Button
          variant="outlined"
          component="span"
          endIcon={<CloudUploadIcon />}
          sx={{ width: { xl: "12rem", lg: "12rem", md: "12rem", sm: "12rem", xs: "100%" } }}
          disabled={data.fileType === EnumFileType.TEXT}
          color={data.fastaFileName !== "" ? "success" : "primary"}
        >
          {data.fastaFileName !== "" ? data.fastaFileName : "Upload file"}
        </Button>
      </label>
      </>
    </FormControl>
  );
}
