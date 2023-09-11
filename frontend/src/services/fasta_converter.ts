import axios from "axios";
import config from "../config.json"
interface Props {
  data: string;
}

export const fasta_converter = async (props: Props) => {
  const { data } = await axios.post(config.convert_to_fasta.api, props);

  return data;
};
