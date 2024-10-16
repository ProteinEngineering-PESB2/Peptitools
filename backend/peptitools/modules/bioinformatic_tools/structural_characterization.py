"""Structural Properties module"""

import subprocess
from os.path import basename
from random import random

import peptitools.config as config
from peptitools.modules.utils import fasta2df


class StructuralCharacterization:
    """Structural Properties Class"""

    def __init__(self, fasta_path):
        self.fasta_path = fasta_path
        self.results_folder = config.results_folder
        self.temp_folder = config.temp_folder
        self.output_path = f"{self.results_folder}/{basename(fasta_path)}"
        self.predictions = ["ss3", "ss8", "acc", "diso", "tm2", "tm8"]

    def execute_predict_property(self, splitted_fasta):
        """Execute Predict Property software"""
        command = [
            "Predict_Property.sh",
            "-i",
            splitted_fasta,
            "-o",
            self.output_path,
        ]
        subprocess.check_output(command)

    def parse_results(self, input_path):
        """Parse output files"""
        all_file = basename(input_path).replace("fasta", "all")
        with open(f"{self.output_path}/{all_file}", "r", encoding="utf-8") as file:
            lines = file.readlines()
        self.name = lines[0].split(" ")[0].replace(">", "")[:-1]
        self.alignment = [{"id": 1, "label": self.name, "sequence": lines[1].replace("\n", "")}]
        for index, prediction_name in enumerate(self.predictions):
            self.alignment.append(
                {
                    "id": index + 2,
                    "label": prediction_name,
                    "sequence": lines[index + 2].replace("\n", ""),
                }
            )

    def __split_fasta(self):
        """Just split a fasta file in multiple 1-sequence fasta"""
        self.file_names = []
        with open(self.fasta_path, encoding="utf-8", mode="r") as file:
            text_file = file.read()
        df = fasta2df(text=text_file)
        for _, row in df.iterrows():
            single_fasta_text = f">{row.id}\n{row.sequence}"
            single_fasta_filename = (
                self.temp_folder + "/" + str(round(random() * 10**20)) + ".fasta"
            )
            with open(single_fasta_filename, encoding="utf-8", mode="w") as file:
                file.write(single_fasta_text)
            self.file_names.append(single_fasta_filename)

    def run_process(self):
        """Run all process"""
        self.__split_fasta()
        response = []
        for file in self.file_names:
            self.execute_predict_property(file)
            self.parse_results(file)
            response.append({"id": self.name, "alignment": self.alignment})
        if len(response) == 0:
            return {
                "status": "warning",
                "description": "There's no significant results for this sequences",
            }
        return {"status": "success", "result": response}
