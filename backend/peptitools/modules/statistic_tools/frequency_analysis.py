"""Frequency analysis module"""

import pandas as pd
from Bio import SeqIO
from peptitools.modules.statistic_tools.statistics import apply_kruskal, distribution, apply_tukey
class FrequencyAnalysis:
    """Frequency Analysis class"""

    def __init__(self, input_path, options):
        self.canonical_residues = [ "A","R","N","D","C",
                                    "E","Q","G","H","I",
                                    "L","K","M","F","P",
                                    "S","T","W","Y","V"]
        self.dict_counts_seq = []
        self.temp_file_path = input_path
        self.options = options
        self.pvalue = float(options["pvalue"])

    def count_canonical_residues(self, sequence):
        """Count canonical residues in a specific aa sequence"""
        sequence = sequence.upper()
        dict_counts = {
            residue: sequence.count(residue) for residue in self.canonical_residues
        }
        return dict_counts

    def run_process(self):
        """Calls to count_canonical_residues in all sequences"""
        records = list(SeqIO.parse(self.temp_file_path, "fasta"))
        records = pd.read_csv(self.temp_file_path)
        for _, record in records.iterrows():
            sequence = str(record.sequence)
            self.count_canonical_residues(sequence)
            counts = self.count_canonical_residues(sequence)
            counts["id"] = record.id
            counts["target"] = record.target
            self.dict_counts_seq.append(counts)
        df = pd.json_normalize(self.dict_counts_seq)
        distribution_result = distribution(df)
        kruskal_result = apply_kruskal(df, self.pvalue)
        tukey_result = apply_tukey(kruskal_result, df, self.pvalue)
        return {"distribution": distribution_result, "kruskal": kruskal_result, "tukey": tukey_result}

