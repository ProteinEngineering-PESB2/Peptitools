"""Msa module"""
import os
import subprocess
from random import random
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import squareform

class MultipleSequenceAlignment:
    """MSA Class"""

    def __init__(self, fasta_path, config):
        self.fasta_path = fasta_path
        self.config = config

        self.static_folder = config["folders"]["static_folder"]
        self.results_folder = config["folders"]["results_folder"]

        self.output_aln_file = os.path.realpath(f"{self.results_folder}/{round(random() * 10**20)}.aln")
        self.output_dist_file = self.output_aln_file.replace(".aln", ".dist")
        self.heatmap_path = self.output_aln_file.replace(".aln", "_heatmap.png")
        self.dendrogram_path = self.output_aln_file.replace(".aln", "_dendrogram.png")

    def execute_clustalo(self):
        """Execute clustalo and return alignment, distance matrix and plots"""
        command = [
            "clustalo",
            "-i",
            self.fasta_path,
            "-o",
            self.output_aln_file,
            f"--distmat-out={self.output_dist_file}",
            "--full",
            "--force",
        ]
        subprocess.check_output(command)

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
        plt.clf()
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
            "result":{
                "alignment": self.alignment,
                "output_file": self.output_aln_file,
                "distances_file": self.output_dist_file,
                "image_heatmap": self.heatmap_path,
                "dendrogram": self.dendrogram_path
            },
            "status": "success"
        }
