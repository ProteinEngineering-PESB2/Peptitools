"""Msa module"""
import os
import subprocess
from random import random
import matplotlib.pyplot as plt
import pandas as pd
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import squareform
import peptitools.config as config
plt.switch_backend('agg')
class MultipleSequenceAlignment:
    """MSA Class"""

    def __init__(self, fasta_path):
        self.fasta_path = fasta_path
        self.static_folder = config.static_folder
        self.results_folder = config.results_folder

        self.output_aln_file = f"{self.results_folder}/{round(random() * 10**20)}.aln"
        self.output_dist_file = self.output_aln_file.replace(".aln", ".dist")
        self.dendrogram_path = self.output_aln_file.replace(".aln", "_dendrogram.png")

    def execute_clustalo(self):
        """Execute clustalo and return alignment, distance matrix and plots"""
        command = f"clustalo -i {self.fasta_path} -o {self.output_aln_file} --distmat-out={self.output_dist_file} --full --force"
        os.system(command)

    def parse_output(self):
        """Transform output distance file to matrix and labels"""
        with open(self.output_aln_file, "r", encoding="utf-8") as file:
            output_text = file.read()

        sequences = output_text.split(">")
        data = [seq.split("\n") for seq in sequences]
        data = data[1:]
        number_proteins = len(data)
        labels = [sequence[0].split(" ")[0] for sequence in data]
        protein = ["".join(sequence[1:]) for sequence in data]
        self.alignment = []
        for i in range(number_proteins):
            dictionary = {}
            dictionary["label"] = ">" + labels[i]
            dictionary["sequence"] = protein[i]
            dictionary["id"] = i + 1
            self.alignment.append(dictionary)
        distance_table = pd.read_csv(
            self.output_dist_file, header=None, delimiter=r"\s+", skiprows=1
        )
        self.x_labels = distance_table[0].to_list()
        distance_table.drop([0], axis=1, inplace=True)
        self.z_values = distance_table.values.tolist()

    def draw_dendrogram(self):
        """Use matplotlib for to draw a dendrogram"""
        plt.figure(figsize=(20, 10))
        plt.ylabel("Distance")
        condensed_dist = squareform(self.z_values)
        linkresult = linkage(condensed_dist)
        dendrogram(linkresult, labels=self.x_labels, leaf_rotation=90)
        plt.xticks(fontsize=20, rotation=90)
        plt.yticks(fontsize=20, rotation=0)
        plt.ylabel("Distance", fontsize=30, rotation=90)
        plt.tight_layout()
        plt.savefig(self.dendrogram_path)

    def run_process(self):
        """Run MSA functions"""
        self.execute_clustalo()
        self.parse_output()
        self.draw_dendrogram()
        return {
                "alignment": self.alignment,
                "output_file": self.output_aln_file[1:],
                "distances_file": self.output_dist_file[1:],
                "dendrogram": self.dendrogram_path[1:]
            }
