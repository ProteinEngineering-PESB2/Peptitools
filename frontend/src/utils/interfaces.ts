export interface PostData {
  fileType: string;
  fastaText: string;
  fastaFile: null | File;
  fastaFileName: string;
  checkboxs: ICheckboxs;
  csvFile: null | File;
  csvFileName: string;
}

export interface ICheckboxs {
  molecular_function: boolean;
  biological_process: boolean;
  celular_component: boolean;
  charge: boolean;
  charge_density: boolean;
  isoelectric_point: boolean;
  molecular_weight: boolean;
  length: boolean;
  instability_index: boolean;
  aromaticity: boolean;
  aliphatic_index: boolean;
  boman_index: boolean;
  hydrophobic_ratio: boolean;
  one_hot_encoding: boolean;
  physicochemical_properties: boolean;
  digital_signal_processing: boolean;
  ss3: boolean;
  ss8: boolean;
  acc: boolean;
  tm2: boolean;
  tm8: boolean;
  diso: boolean;
}

export interface ITable {
  columns: Array<string>;
  data: Array<Array<any>>;
}

export interface IOneAlign {
  id: number;
  label: string;
  sequence: string;
}

export interface IAlign {
  alignment: IOneAlign[];
  output_file: string;
  distances_file: string;
  image_heatmap: string;
  dendrogram: string;
}

export interface IFormatDataPfam {
  Accession: string;
  Bitscore: string;
  Class: string;
  Evalue: string;
  Id_accession: string;
  Type: string;
}

export interface IDataPfam {
  id: string;
  data: IFormatDataPfam[];
}

interface IResultsPredictionGeneOntology {
  id_go: string;
  probability: number;
  term: string;
}

interface IPredictionGeneOntology {
  id_seq: string;
  results: IResultsPredictionGeneOntology[];
}

export interface IDataGeneOntology {
  type: string;
  prediction: IPredictionGeneOntology[];
}

export interface IDataFrequency {
  id_seq: string;
  counts: Object;
}

export interface IDataSummary {
  x: string[];
  y: number[];
  z: number[];
}

export interface IDataPhysichochemical {
  charge: number;
  charge_density: number;
  id: string;
  length: number;
  isoelectric_point: number;
  molecular_weight: number;
  aliphatic_index: number;
  aromaticity: number;
  boman_index: number;
  hydrophobic_ratio: number;
  instability_index: number;
  helical_path: string;
  profile_path: string;
}

export interface IItemSelect {
  value: string;
  title: string;
}

export interface IDataClustering {
  clustering_type: string;
  encoding_path: string;
  is_normal: boolean;
  performance: {
    calinski: number;
    dalvies: number;
    siluetas: number;
  };
  data: {
    id: string;
    label: number;
  }[];
  resume: {
    category: number;
    percentage: number;
    value: number;
  }[];
}

export interface IDataClassificationSupervisedLearning {
  result: {
    job_path: string;
    is_normal: boolean;
    encoding_path: string;
    metrics: ITable;
    analysis: {
      categories: string[];
      sensibility: number[];
      sensitivity: number[];
    };
    analysis_testing?: {
      categories: string[];
      sensibility: number[];
      sensitivity: number[];
    };
    confusion_matrix: {
      x: string[];
      y: string[];
      z: Array<number[]>;
    };
    confusion_matrix_testing?: {
      x: string[];
      y: string[];
      z: Array<number[]>;
    };
    learning_curve: {
      error_testing: {
        x: number[];
        y: number[];
      };
      error_training: {
        x: number[];
        y: number[];
      };
      testing: {
        x: number[];
        y: number[];
      };
      training: {
        x: number[];
        y: number[];
      };
    };
    performance: {
      accuracy: number;
      f1_weighted: number;
      precision_weighted: number;
      recall_weighted: number;
    };
    performance_testing?: {
      accuracy: number;
      f1_weighted: number;
      precision_weighted: number;
      recall_weighted: number;
    };
  };
}

export interface IDataRegressionSupervisedLearning {
  result: {
    job_path: string;
    is_normal: boolean;
    encoding_path: string;
    corr: {
      kendall: {
        kendalltau: number;
        pvalue: number;
      };
      pearson: {
        pearsonr: number;
        pvalue: number;
      };
      spearman: {
        spearmanr: number;
        pvalue: number;
      };
    };
    corr_testing?: {
      kendall: {
        kendalltau: number;
        pvalue: number;
      };
      pearson: {
        pearsonr: number;
        pvalue: number;
      };
      spearman: {
        spearmanr: number;
        pvalue: number;
      };
    };
    error_values: number[];
    error_values_testing?: number[];
    performance: {
      neg_median_absolute_error: number;
      neg_root_mean_squared_error: number;
      r2: number;
    };
    performance_testing?: {
      neg_median_absolute_error: number;
      neg_root_mean_squared_error: number;
      r2: number;
    };
    metrics: ITable;
    corr_metrics: any;
    scatter: {
      x: number[];
      y: number[];
      x_regr: number[];
      y_regr: number[];
    };
    scatter_testing: {
      x: number[];
      y: number[];
      x_regr: number[];
      y_regr: number[];
    };
  };
}


export interface StatisticsResult{
  distribution: any;
  kruskal: {
    columns: string[];
    data: [string[]];
  }
  tukey?: {
    columns: string[];
    data: [string[]];
  }
}

export interface SingleAlignment{
  id: number;
  label: string;
  sequence: string;
}

export interface MSAResult{
  alignment: SingleAlignment[];
  output_file: string;
  distances_file: string;
  dendrogram: string;
}

export interface FormProps {
  setResult: React.Dispatch<React.SetStateAction<any>>;
  service: {
    api: string;
    title: string;
    description: string;
    markdown_text: string;
  }
}