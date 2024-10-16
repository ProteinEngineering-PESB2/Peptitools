import { Grid, TextField } from "@mui/material";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import toast from "react-hot-toast";
import { parserFormDataWithOptions, parserFormDataWithoutOptions} from "../../helpers/parserFormData";
import useSelectValue from "../../hooks/useSelectValue";
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
import NumericalRepresentation from "../form/num_repr";
import DistanceOptions from "./distances";
import config from "../../config.json";
import SectionTitle from "../common/section_title";
import Hyperparams from "./hyperparams";

interface Props {
  setResult: Dispatch<SetStateAction<IDataClustering | null>>;
  service: any;
}

export default function ClusteringForm({ setResult, service }: Props) {
  const [data, setData] = useState<PostData>(InitialValuePostData);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  
  const [ selectedClusteringType, clustering_types, handleChangeSelectedClusteringType ] = useSelectValue(
    {array_values: service.clustering_types});
  
  const [ selectedEncoding, encodings, handleChangeSelectedEncoding ] = useSelectValue(
    {array_values: config.encodings});
    
  const encoding_element = <SelectComponent
    items={encodings}
    title="Encoding Type"
    value={selectedEncoding}
    handleChange={handleChangeSelectedEncoding}
  />

  const [ selectedEmbedding, embeddings, handleChangeSelectedEmbedding ] = useSelectValue(
    {array_values: config.embeddings});
    
  const embedding_element = <SelectComponent
    items={embeddings}
    title="Embedding"
    value={selectedEmbedding}
    handleChange={handleChangeSelectedEmbedding}
  />

  const [ selectedProperty, properties, handleChangeSelectedProperty ] = useSelectValue(
    {array_values: config.properties});
    
  const properties_element = <SelectComponent
    items={properties}
    title="Physicochemical property"
    value={selectedProperty}
    handleChange={handleChangeSelectedProperty}
  />

  const [ selectedAlgorithm, algorithms, handleChangeSelectedAlgorithm ] = useSelectValue(
    {array_values: config.clustering.algorithms});
    
  const algorithms_element = <SelectComponent
    items={algorithms}
    title="Algorithms"
    value={selectedAlgorithm}
    handleChange={handleChangeSelectedAlgorithm}
  />

  const [ selectedLinkage, linkages, handleChangeSelectedLinkage ] = useSelectValue(
    {array_values: config.clustering.linkages});
    
  const linkages_element = <SelectComponent
    items={linkages}
    title="Linkage"
    value={selectedLinkage}
    handleChange={handleChangeSelectedLinkage}
  />

  const [ selectedAffinity, affinities, handleChangeSelectedAffinity ] = useSelectValue(
    {array_values: config.clustering.affinities});
    
  const affinities_element = <SelectComponent
    items={affinities}
    title="Affinity"
    value={selectedAffinity}
    handleChange={handleChangeSelectedAffinity}
  />

  const [ selectedDistance, distances, handleChangeSelectedDistance ] = useSelectValue(
    {array_values: config.clustering.clustering_distances});
    
  const distances_element = <SelectComponent
    items={distances}
    title="Distance"
    value={selectedDistance}
    handleChange={handleChangeSelectedDistance}
  />

  const [ selectedFilterTypeClustering, filter_types_clustering, handleCHangeSelectedFilterTypeClustering ] = useSelectValue(
    {array_values: config.clustering.filter_types_clustering});
    
  const clustering_element = <SelectComponent
    items={filter_types_clustering}
    title="Filter"
    value={selectedFilterTypeClustering}
    handleChange={handleCHangeSelectedFilterTypeClustering}
  />

  const [ selectedKernel, kernels, handleChangeKernel ] = useSelectValue(
    {array_values: config.kernels});
    
  const kernel_element = <SelectComponent
    items={kernels}
    title="PCA Kernel"
    value={selectedKernel}
    handleChange={handleChangeKernel}
  />

  const [ selectedStandarization, standarizations, handleChangeStandarization ] = useSelectValue(
    {array_values: config.standarizations});
    
  const standarization_element = <SelectComponent
    items={standarizations}
    title="Standarization"
    value={selectedStandarization}
    handleChange={handleChangeStandarization}
  />

  const [kvalue, setKvalue] = useState("2")
  const kvalue_element = <TextField
    label="kvalue"
    value={kvalue}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setKvalue(event.target.value);
    }}/>


  const [xi, setXi] = useState("0.05")
  const xi_element = <TextField
    label="xi"
    value={xi}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setXi(event.target.value);
    }}/>


  const [min_samples, setMinSamples] = useState("5")
  const min_samples_element = <TextField
    label="Min samples"
    value={min_samples}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setMinSamples(event.target.value);
    }}/>


  const [min_cluster_size, setMinClusterSize] = useState("5")
  const min_cluster_size_element = <TextField
    label="Min cluster size"
    value={min_cluster_size}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      setMinClusterSize(event.target.value);
    }}/>


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
            k_value: Number(kvalue),
          };
        }
  
        if (selectedAlgorithm === "agglomerative") {
          params = {
            k_value: Number(kvalue),
            linkage: selectedLinkage,
            affinity: selectedAffinity,
          };
        }
  
        if (selectedAlgorithm === "optics") {
          params = {
            min_samples: Number(min_samples),
            xi: Number(xi),
            min_cluster_size: Number(min_cluster_size),
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
          distance: selectedDistance,
          filter_type: selectedFilterTypeClustering,
          pretrained_model: selectedEmbedding,
          kernel: selectedKernel,
          preprocessing: selectedStandarization,
        };
  
        postData = parserFormDataWithOptions(data, options);
      }
  
      try {
        const { data } = await requestPost({ url: url, postData });
        const { result } = data;
        if (result.description) {
          toast.error(result.description);
          setResult(null);
        } else {
          setResult({ ...result, clustering_type: selectedClusteringType });
        }
        setOpenBackdrop(false);
      } catch (error:any) {
        toast.error(error.response.data.description);
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
          {((selectedClusteringType === "unsupervised_learning") ||
          (selectedClusteringType === "graph_clustering_distances")) && (
            <NumericalRepresentation
            representation={encoding_element}
            repr_value={selectedEncoding}
            embeddings={embedding_element}
            properties={properties_element}
            />
            )
          }
          {(selectedClusteringType === "unsupervised_learning") &&
            <Hyperparams
            algorithm= {algorithms_element}
            kvalue={kvalue_element}
            linkage={linkages_element}
            affinity={affinities_element}
            xi={xi_element}
            min_samples={min_samples_element}
            min_cluster_size={min_cluster_size_element}
            algorithm_value={selectedAlgorithm}/>
          }
          {(selectedClusteringType === "graph_clustering_distances") &&
            <DistanceOptions distance={distances_element} type = {clustering_element}/>
          }
          {(selectedClusteringType !== "graph_clustering_alignments") &&
            <AdvancedOptions kernel={kernel_element} standarization={standarization_element}/>
          }
          <ButtonRun data={data} />
        </form>
      </FormContainer>
    </>
  );
}
