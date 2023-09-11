import { EnumFileType } from "../utils/enums";
import { PostData } from "../utils/interfaces";

export const parserFormDataWithoutOptions = (data: PostData): any => {
  const postData = new FormData();
  if (data.fileType === EnumFileType.TEXT) {
    postData.append("data", data.fastaText!);
    postData.append("type", "fasta_text");
  } else if (data.fileType === EnumFileType.FASTA_FILE){
    postData.append("file", data.fastaFile!);
    postData.append("type", "fasta_file");
  }
  else if (data.fileType === EnumFileType.CSV_FILE){
    postData.append("file", data.fastaFile!);
    postData.append("type", "csv_file");
  }
  return postData;
}

export const parserFormDataWithOptions = (data: PostData, options: any): any => {
  const postData = new FormData();
  if (data.fileType === EnumFileType.TEXT) {
    postData.append("data", data.fastaText)
    postData.append("options", JSON.stringify(options))
    postData.append("type", "fasta_text")
    return postData;

  } else if (data.fileType === EnumFileType.FASTA_FILE){
    postData.append("file", data.fastaFile!);
    postData.append("options", JSON.stringify(options))
    postData.append("type", "fasta_file");
    return postData;
  }
  else if (data.fileType === EnumFileType.CSV_FILE) {
    postData.append("file", data.fastaFile!);
    postData.append("options", JSON.stringify(options))
    postData.append("type", "csv_file");
    return postData;
  }
};

export const parserFormDataWithOptionsForCSV = (
  data: PostData,
  options: any
): any => {
  const newOptions = new Blob([JSON.stringify(options)]);

  const postData = new FormData();
  postData.append("file", data.csvFile!);
  postData.append("options", newOptions);

  return postData;
};
