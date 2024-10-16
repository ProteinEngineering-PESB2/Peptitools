"""Distance clustering module"""

import multiprocessing as mp
from random import random

import numpy as np
import pandas as pd
from joblib import Parallel, delayed
from scipy.spatial import distance

from peptitools.modules.machine_learning_tools.clustering_methods.graph_clustering import (
    GraphClustering,
)


class DistanceClustering(GraphClustering):
    """Distance Clustering class"""

    def __init__(self, data, options):
        super().__init__(data, options)
        self.dataset_encoded_path = f"{self.results_folder}/{round(random() * 10**20)}.csv"
        self.options = options
        self.dataset_encoded = None
        self.cores = mp.cpu_count()

    def __get_vector(self, index, dataset, column_ignore):
        """Ignore a column"""
        row = [dataset[value][index] for value in dataset.columns if value != column_ignore]
        return np.array(row)

    def __estimated_distance(self, vector1, vector2, type_distance):
        """Estimate one vs one distance"""
        distance_value = None
        if type_distance == "euclidean":
            distance_value = np.linalg.norm(vector1 - vector2)
        elif type_distance == "bray_curtis":
            distance_value = distance.braycurtis(vector1, vector2)
        elif type_distance == "canberra":
            distance_value = distance.canberra(vector1, vector2)
        elif type_distance == "chebyshev":
            distance_value = distance.chebyshev(vector1, vector2)
        elif type_distance == "manhattan":
            distance_value = distance.cityblock(vector1, vector2)
        elif type_distance == "correlation":
            distance_value = distance.correlation(vector1, vector2)
        elif type_distance == "cosine":
            distance_value = distance.cosine(vector1, vector2)
        elif type_distance == "minkowski":
            distance_value = distance.minkowski(vector1, vector2)
        elif type_distance == "hamming":
            distance_value = distance.hamming(vector1, vector2)
        return distance_value

    def __estimated_distance_one_vs_rest(self, index, dataset, column_ignore, type_distance):
        """Estimate one vs all distances"""
        vector_target = self.__get_vector(index, dataset, column_ignore)
        distance_to_vector = []
        index_value = dataset[column_ignore][index]
        for j in range(len(dataset)):
            if index != j:
                vector2 = self.__get_vector(j, dataset, column_ignore)
                id_value2 = dataset[column_ignore][j]
                distance_value = self.__estimated_distance(vector_target, vector2, type_distance)
                distance_to_vector.append([index_value, id_value2, distance_value])
        return distance_to_vector

    def __calculate_distance(self):
        """calculo de distancia entre todas las secuencias"""
        cores = self.cores
        data_distance = Parallel(n_jobs=cores, require="sharedmem")(
            delayed(self.__estimated_distance_one_vs_rest)(
                i, self.dataset_encoded, "id", self.options["distance"]
            )
            for i in range(len(self.dataset_encoded))
        )
        data_values = []
        for element in data_distance:
            for values in element:
                data_values.append(values)

        self.df_data_distance = pd.DataFrame(data_values, columns=["id_1", "id_2", "distance"])

    def run_clustering(self):
        """Run all distance clustering process"""
        self.run_encoding()
        self.__calculate_distance()
        self.filter(self.options["filter_type"])
        self.create_graph()
        self.louvain_modularity()
        self.get_groups()
        return self.parse_response()
