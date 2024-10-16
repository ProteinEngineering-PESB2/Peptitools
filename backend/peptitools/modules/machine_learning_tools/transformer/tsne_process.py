"""PCA module"""

from random import random

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.colors import to_hex

from peptitools.modules.machine_learning_tools.transformer.transformation_data import Transformer


class TSNE:
    """PCA class"""

    def __init__(self, path, static_folder):
        self.static_folder = static_folder
        self.path = path
        self.data = pd.read_csv(self.path)
        self.dataset_to_transform = self.data[[col for col in self.data.columns if "p_" in col]]
        self.transformer = Transformer()
        self.traces = []
        self.tsne_df = None

    def apply_tsne(self):
        """Apply PCA or kernel PCA"""
        pca_result = self.transformer.apply_tsne_data(self.dataset_to_transform, 2)
        self.tsne_df = pd.DataFrame(data=pca_result, columns=["X", "Y"])
        self.tsne_df["id"] = self.data["id"]
        self.tsne_df["label"] = self.data["label"]
        self.__generate_colors()
        self.__create_traces()
        pca_path = self.static_folder + "/" + str(round(random() * 10**20)) + ".csv"
        self.tsne_df.to_csv(pca_path, index=False)
        return self.traces, pca_path

    def __generate_colors(self):
        """Generate colors using matplotlib"""
        all_clusters = self.tsne_df.label.unique()
        all_clusters.sort()
        linspace = np.linspace(0.1, 0.9, len(all_clusters))
        hsv = plt.get_cmap("hsv")
        rgba_colors = hsv(linspace)
        for cluster, color in zip(all_clusters, rgba_colors):
            hex_value = to_hex([color[0], color[1], color[2], color[3]], keep_alpha=True)
            self.tsne_df.loc[self.tsne_df.label == cluster, "color"] = hex_value

    def __create_traces(self):
        """Create traces for a scatterplot"""
        all_clusters = self.tsne_df.label.unique()
        all_clusters.sort()
        for cluster in all_clusters:
            sub_df = self.tsne_df[self.tsne_df["label"] == cluster]
            trace = {
                "x": sub_df.X.to_list(),
                "y": sub_df.Y.to_list(),
                "text": sub_df.id.to_list(),
                "name": "Cluster " + str(cluster),
                "mode": "markers",
                "type": "scatter",
                "marker": {"color": sub_df.color.unique()[0]},
            }
            self.traces.append(trace)
