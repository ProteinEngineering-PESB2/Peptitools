import { FormControl, Button } from "@mui/material";
import { PostData } from "../../utils/interfaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface Props {
  data: PostData;
}

export default function ButtonRun({ data }: Props) {
  const [disable, setDisable] = useState(true)
  useEffect(()=>{
    if (data.fileType === "text"){
      if(data.fastaText !== ""){
        setDisable(false)
      }
      else{
        setDisable(true)
      }
    }
    else{
      if (data.fastaFile === null && data.fileType === "fasta"){
        setDisable(true)
      }
      else{
        if (data.fastaFile === null && data.fileType === "csv"){
          setDisable(true)
        }
        else{
          const text_splitted = data.fastaFileName.split(".")
          const extention = text_splitted[text_splitted.length - 1]
          if ( data.fileType !==  extention ){
            setDisable(true)
            toast.error("Check your file type XD.")
          }
          else{
            setDisable(false)
          }
        }
      }
    }
  }, [data])
  return (
    <FormControl fullWidth sx={{ marginTop: 2 }}>
      <Button
        type="submit"
        variant="contained"
        sx={{
          width: { xl: "12rem", lg: "12rem", md: "12rem", sm: "12rem", xs: "100%" },
          backgroundColor: "#2962ff",
          ":hover": { backgroundColor: "#3A6CF6" },
        }}
        size="medium"
        disabled={disable}
      >
        run
      </Button>
    </FormControl>
  );
}
