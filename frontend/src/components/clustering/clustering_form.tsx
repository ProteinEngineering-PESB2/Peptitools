import { Grid } from "@mui/material";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import toast from "react-hot-toast";
import { parserFormDataWithOptions, parserFormDataWithoutOptions} from "../../helpers/parserFormData";
import useSelectValue from "../../hooks/useSelectValue";
import useTextField from "../../hooks/useTextField";
import { requestPost } from "../../services/api";
import { InitialValuePostData } from "../../utils/initial_values";
import { IDataClustering, PostData } from "../../utils/interfaces";
import BackdropComponent from "../common/backdrop_component";
import ButtonRun from "../form/button_run";
import FormContainer from "../form/form_container";
import InputFileFasta from "../form/input_file_fasta";
import InputFileType from "../form/input_file_type";
import SelectComponent from "../form/select_component";
import TextFieldFasta from "../form/text_field_fasta";
import AdvancedOptions from "../form/advanced_options";
import RepresentationOptions from "../form/representation_method_options";
import DistanceOptions from "../form/distance_options";
import AlgorithmOptions from "../form/algorithms_options";
import config from "../../config.json";
import SectionTitle from "../common/section_title";

interface Props {
  setResult: Dispatch<SetStateAction<IDataClustering | null>>;
  service: any;
}

export default function ClusteringForm({ setResult, service }: Props) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  
  const [ selectedClusteringType, clustering_types, handleChangeSelectedClusteringType ] = useSelectValue(
    {array_values: service.clustering_types});

  const [ selectedClusteringDistance, clustering_distances, handleChangeSelectClusteringDistance ] = useSelectValue(
    {array_values: service.clustering_distances});
  
  const [ selectedFilterTypeClustering, filter_types_clustering, handleChangeSelectFilterTypeClustering ] = useSelectValue(
    {array_values: service.filter_types_clustering});
    
  const [ selectedEmbedding, embeddings, handleChangeSelectedEmbedding ] = useSelectValue(
    {array_values: config.embeddings});

  const [ selectedAlgorithm, algorithms, handleChangeSelectedAlgorithm ] = useSelectValue(
    {array_values: service.algorithms});

  const [ selectedProperty, properties, handleChangeSelectedProperty ] = useSelectValue(
    {array_values: config.properties});

  const [ selectedLinkage,  linkages, handleChangeSelectedLinkage ] = useSelectValue(
    {array_values: service.linkages});

  const [ selectedAffinity, affinities, handleChangeSelectedAffinity ] = useSelectValue(
    {array_values: service.affinities});

  const [ selectedKernel, kernelsSupervisedLearning, handleChangeSelectedKernel ] = useSelectValue(
    {array_values: config.kernels});

  const [ selectedStandarization, standarizations, handleChangeSelectedStandarization ] = useSelectValue(
    {array_values: config.standarizations});

  const [ selectedEncoding, encodings, handleChangeSelectedEncoding ] = useSelectValue(
      {array_values: config.encodings});

  const [ kvalue, handleChangeKValue ] = useTextField({actual: "2"});
  const [ xi, handleChangeXi ] = useTextField({actual: "0.05"});
  const [ minSamples, handleChangeMinSamples ] = useTextField({actual: "5"});
  const [ minClusterSize, handleChangeMinClusterSize ] = useTextField({actual: "5"});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setOpenBackdrop(true);
    setResult(null);

    let postData = null;
    let url = "";

    if (selectedClusteringType === "unsupervised_learning") {
      url = service.unsupervised_learning_api;

      let params = {};
      if (selectedAlgorithm === "kmeans" || selectedAlgorithm === "birch") {
        params = {
          k_value: parseFloat(kvalue),
        };
      }

      if (selectedAlgorithm === "agglomerative") {
        params = {
          k_value: parseFloat(kvalue),
          linkage: selectedLinkage,
          affinity: selectedAffinity,
        };
      }

      if (selectedAlgorithm === "optics") {
        params = {
          min_samples: parseFloat(minSamples),
          xi: parseFloat(xi),
          min_cluster_size: parseFloat(minClusterSize),
        };
      }

      const options = {
        encoding: selectedEncoding,
        selected_property: selectedProperty,
        algorithm: selectedAlgorithm,
        params: params,
        pretrained_model: selectedEmbedding,
        kernel: selectedKernel,
        preprocessing: selectedStandarization,
      };

      postData = parserFormDataWithOptions(data, options);
    }

    if (selectedClusteringType === "graph_clustering_alignments") {
      url = service.ssn_api;
      postData = parserFormDataWithoutOptions(data);
    }

    if (selectedClusteringType === "graph_clustering_distances") {
      url = service.nssn_api;

      const options = {
        encoding: selectedEncoding,
        selected_property: selectedProperty,
        distance: selectedClusteringDistance,
        filter_type: selectedFilterTypeClustering,
        pretrained_model: selectedEmbedding,
        kernel: selectedKernel,
        preprocessing: selectedStandarization,
      };

      postData = parserFormDataWithOptions(data, options);
    }

    try {
      const { data } = await requestPost({ url: url, postData });

      if (data.status === "error") {
        toast.error(data.description);
      } else {
        const { result } = data;
        if (result.description) {
          toast.error(result.description);
          setResult(null);
        } else {
          setResult({ ...result, clustering_type: selectedClusteringType });
        }
      }

      setOpenBackdrop(false);
    } catch (error) {
      toast.error("Server error");
      setOpenBackdrop(false);
      setResult(null);
    }
  };

  return (
    <>
      <SectionTitle
        title={service.title}
        description={service.description}
      />
      <BackdropComponent open={openBackdrop} />
      <FormContainer markdownText={service.markdown_text}>
        <form onSubmit={handleSubmit}>
          <InputFileType data={data} setData={setData} />
          <TextFieldFasta
            data={data}
            setData={setData}
          />
          <InputFileFasta data={data} setData={setData} />
          <Grid container spacing={2} marginTop={0}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <SelectComponent
                items={clustering_types}
                title="Clustering Type"
                value={selectedClusteringType}
                handleChange={handleChangeSelectedClusteringType}
              />
            </Grid>
          </Grid>
          {(selectedClusteringType === "unsupervised_learning") && (
            <>
              <RepresentationOptions 
                encodings = {encodings} selectedEncoding = {selectedEncoding} handleChangeSelectedEncoding = {handleChangeSelectedEncoding}
                embeddings = {embeddings} handleChangeSelectedEmbedding = {handleChangeSelectedEmbedding} selectedEmbedding = {selectedEmbedding}
                handleChangeSelectedProperty = {handleChangeSelectedProperty} properties = {properties} selectedProperty = {selectedProperty} />
              <AlgorithmOptions
                algorithms = {algorithms} selectedAlgorithm = {selectedAlgorithm} handleChangeSelectedAlgorithm = {handleChangeSelectedAlgorithm}
                kvalue = {kvalue} handleChangeKValue = {handleChangeKValue}
                linkages = {linkages} selectedLinkage = {selectedLinkage} handleChangeSelectedLinkage = {handleChangeSelectedLinkage}
                affinities = {affinities} selectedAffinity = {selectedAffinity} handleChangeSelectedAffinity = {handleChangeSelectedAffinity}
                xi = {xi} handleChangeXi = {handleChangeXi}
                minSamples = {minSamples} handleChangeMinSamples = {handleChangeMinSamples}
                minClusterSize = {minClusterSize} handleChangeMinClusterSize = {handleChangeMinClusterSize} />
            </>
            )
          }
          {selectedClusteringType === "graph_clustering_distances" && (
            <>
              <RepresentationOptions 
                encodings = {encodings} selectedEncoding = {selectedEncoding} handleChangeSelectedEncoding = {handleChangeSelectedEncoding}
                embeddings = {embeddings} handleChangeSelectedEmbedding = {handleChangeSelectedEmbedding} selectedEmbedding = {selectedEmbedding}
                handleChangeSelectedProperty = {handleChangeSelectedProperty} properties = {properties} selectedProperty = {selectedProperty} />
              <DistanceOptions
                clustering_distances = {clustering_distances} selectedClusteringDistance = {selectedClusteringDistance} handleChangeSelectClusteringDistance = {handleChangeSelectClusteringDistance}
                filter_types_clustering = {filter_types_clustering} selectedFilterTypeClustering = {selectedFilterTypeClustering} handleChangeSelectFilterTypeClustering = {handleChangeSelectFilterTypeClustering}/>
            </>
          )}
          <AdvancedOptions 
            kernelItems = {kernelsSupervisedLearning} selectedKernel = {selectedKernel} handleChangeKernel = {handleChangeSelectedKernel}
            standItems = {standarizations} selectedStand = {selectedStandarization} handleChangeStand = {handleChangeSelectedStandarization}/>
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
