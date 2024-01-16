"""Structural Properties module"""
import subprocess
from os.path import basename
import os
import peptitools.config as config

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
        all_file  = basename(input_path).replace("fasta", "all")
        with open(f"{self.output_path}/{all_file}", "r", encoding="utf-8") as file:
            lines = file.readlines()
        self.name = lines[0].split(" ")[0].replace(">", "")[:-1]
        self.alignment = [
            {"id": 1, "label": self.name, "sequence": lines[1].replace("\n", "")}
        ]
        for index, prediction_name in enumerate(self.predictions):
            self.alignment.append(
                {
                    "id": index + 2,
                    "label": prediction_name,
                    "sequence": lines[index + 2].replace("\n", ""),
                }
            )

    def run_process(self):
        """Run all process"""
        os.system(f'splitfasta {self.fasta_path}')
        splited_files = [f'{self.temp_folder}/{a}' for a in os.listdir(self.temp_folder)
                        if basename(self.fasta_path).split(".")[0] in a and
                        a != basename(self.fasta_path) and
                        "split_files" not in a]
        response = []
        for file in splited_files:
            self.execute_predict_property(file)
            self.parse_results(file)
            response.append({"id": self.name, "alignment": self.alignment})

        if len(response) == 0:
            return {
                "status": "warning",
                "description": "There's no significant results for this sequences"
            }
        return {"status": "success", "result": response}