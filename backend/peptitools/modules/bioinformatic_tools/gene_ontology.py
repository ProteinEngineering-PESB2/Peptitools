"""Gene ontology module"""
import subprocess
import os
from random import random
import pandas as pd
import peptitools.config as config

class GeneOntology:
    """Gene ontology class"""
    def __init__(self, fasta_path):
        self.fasta_path = os.path.realpath(fasta_path)
        self.results_folder = config.results_folder
        self.output_path = os.path.realpath(f"{self.results_folder}/{round(random() * 10**20)}.aln")

    def run_process(self):
        """Execute metastudent and return results"""
        command = f"metastudent -i {self.fasta_path} -o {self.output_path}"
        os.system(command)
        response = self.find_and_load_data()
        if len(response) == 0:
            return {
                "status": "warning",
                "description": "There's no significant results for this sequences"
            }
        return response

    def find_and_load_data(self):
        """Parse metastudent results and returns json"""
        results = []
        params = [(".MFO.txt", "molecular_function"), (".BPO.txt", "biological_process"), (".CCO.txt", "celular_component")]
        for param_tuple in params:
            try:
                df_go = pd.read_csv(
                    self.output_path + param_tuple[0], header=None, sep="\t"
                )
                df_go.rename(
                    columns={0: "id_seq", 1: "id_go", 2: "probability", 3: "term"},
                    inplace=True,
                )
                unique_go = df_go.id_seq.unique()
                go_array = []
                for single_go in unique_go:
                    temp = df_go[df_go.id_seq == single_go][
                        ["id_go", "probability", "term"]
                    ]
                    go_array.append(
                        {"id_seq": single_go, "results": temp.to_dict("records")}
                    )
                results.append({"type": param_tuple[1], "prediction": go_array})
            except:
                return {"status": "warning", "description": "There's no significant results for this sequences"}
        print(results)
        return {"result": results, "status": "success"}