"""Config utilities"""
import ast
import configparser
import re
from pathlib import Path
from random import random

import pandas as pd
from Bio import SeqIO

AMINOACID_ALPHABET = "ARNDCEQGHILKMFPSTWYVX*"


class ConfigTool:
    """Config tool class"""
    def __init__(self, config_module_name, data, config, is_file, is_fasta=True):
        self.data = data
        self.config = config
        self.static_folder = config["folders"]["static_folder"]
        self.temp_folder = config["folders"]["temp_folder"]
        self.results_folder = config["folders"]["results_folder"]
        self.temp_file_path = f"{self.temp_folder}/{str(round(random() * 10**20))}"
        self.temp_csv_file = None

        if is_fasta:
            self.temp_file_path += ".fasta"
        else:
            self.temp_file_path += ".csv"

        if not is_file:
            self.create_file()
        else:
            self.save_file()

        if is_fasta:
            self.check = FastaFile(
                self.temp_file_path, config, config_module_name
            ).verify()
        else:
            self.check = CsvFile(
                self.temp_file_path, config, config_module_name
            ).verify()

    def create_file(self):
        """create file using data in specific path"""
        with open(self.temp_file_path, "w", encoding="utf-8") as file:
            file.write(self.data)

    def save_file(self):
        """save file in specific path"""
        self.data.save(self.temp_file_path)

    def delete_file(self):
        """Delete file from path"""
        try:
            Path(self.temp_file_path).unlink()
        except:
            pass

    def create_csv_from_fasta(self):
        """Transform fasta format to csv file"""
        self.temp_csv_file = f"{self.temp_folder}/{round(random() * 10**20)}.fasta"
        with open(self.temp_file_path, "r", encoding="utf-8") as file:
            data = file.read()
        with open(self.temp_csv_file, "w", encoding="utf-8") as file:
            for record in parse_fasta(data):
                file.write(">{id}\n{sequence}\n".format(**record))

    @staticmethod
    def create_df(fasta):
        """Create a dataframe from fasta text"""
        return pd.DataFrame(parse_fasta(fasta))

    def save_csv_on_static(self, csv, path):
        csv.to_csv(f"{self.results_folder}/{path}", index=False)


class CsvFile:
    def __init__(self, path, config, config_name, needs_target, task):
        self.path = path
        self.max_number_sequences = int(config[config_name]["max_sequences"])
        self.min_number_sequences = int(config[config_name]["min_sequences"])
        self.max_length = int(config["global"]["max_length"])
        self.min_length = int(config["global"]["min_length"])
        self.id_column = config["csv"]["id_column"]
        self.sequence_column = config["csv"]["sequence_column"]
        self.target_column = config["csv"]["target_column"]
        self.task = task

        try:
            self.data = pd.read_csv(self.path)
        except:
            self.data = None
        self.needs_target = needs_target

    def verify(self):
        new_line = "\n"
        message = ""
        
        if not self.is_csv():
            message = "Not a csv file / ASCII error"
            return _error_message(message)
        
        incorrect_columns = self.has_correct_columns()
        if len(incorrect_columns) != 0:
            message = f"This csv file doesn't have the required columns:\nColumns not found:{', '.join(incorrect_columns)}"
            return _error_message(message)
        
        if not self.null_values():
            message = "Data has null values"
            return _error_message(message)
        
        duplicated_id = self.unique_ids()
        if len(duplicated_id) > 0:
            message = f"Duplicated ids.{new_line}{new_line.join(duplicated_id)}"
            return _error_message(message)
        
        if not self.less_than_n():
            message = f"Too many sequences.{new_line}Use {self.max_number_sequences} or less."
            return _error_message(message)
        
        if not self.more_than_n():
            message = f"Too few sequences.{new_line}Use {self.min_number_sequences} or more."
            return _error_message(message)
        
        invalid_protein_ids = self.invalid_proteins()
        if len(invalid_protein_ids) > 0:
            message = f"There are some invalid sequences, just use aminoacids.{new_line}{new_line.join(invalid_protein_ids)}"
            return _error_message(message)
        
        invalid_lengths = self.invalid_lengths()
        if len(invalid_lengths) > 0:
            message = f"There are some invalid sequences, use peptides with a length between {self.min_length} and {self.max_length}.{new_line}{new_line.join(invalid_lengths)}"
            return _error_message(message)
        if not self.correct_target():
            message = f"Please verify target column. Needs a {self.task} column."
            return _error_message(message)
        return {"status": "success", "path": self.path}
    
    def unique_ids(self):
        return self.data.id[self.data.id.duplicated()]

    def is_csv(self):
        return self.data is not None

    def less_than_n(self):
        return self.data.shape[0] <= self.max_number_sequences

    def more_than_n(self):
        return self.data.shape[0] >= self.min_number_sequences

    def invalid_proteins(self):
        invalid_ids = []
        aa_regex = re.compile(f"[{AMINOACID_ALPHABET}]+")
        for row in self.data.itertuples():
            if not aa_regex.fullmatch(row.sequence.upper()):
                invalid_ids.append(row.id)
        return invalid_ids

    def invalid_lengths(self):
        invalid_ids = []
        for row in self.data.itertuples():
            sequence = row.sequence
            if len(sequence) > self.max_length or len(sequence) < 2:
                invalid_ids.append(row.id)
        return invalid_ids

    def null_values(self):
        return self.data.isnull().any(axis=1).sum() == 0

    def has_correct_columns(self):
        incorrect_columns = []
        if self.id_column not in self.data.columns:
            incorrect_columns.append(self.id_column)
        if self.sequence_column not in self.data.columns:
            incorrect_columns.append(self.sequence_column)
        if self.target_column not in self.data.columns and self.needs_target:
            incorrect_columns.append(self.target_column)
        return incorrect_columns
    
    def correct_target(self):
        if self.task == "regression":
            try:
                self.data.target.astype(float)
                return True
            except:
                return False
        return True

class FastaFile:
    def __init__(self, path, config, config_name, needs_target, task):
        self.path = path
        self.max_number_sequences = int(config[config_name]["max_sequences"])
        self.min_number_sequences = int(config[config_name]["min_sequences"])
        self.max_length = int(config["global"]["max_length"])
        self.min_length = int(config["global"]["min_length"])
        self.task = task
        try:
            self.fasta = list(SeqIO.parse(self.path, "fasta"))
            SeqIO.write(self.fasta, self.path, "fasta")
        except:
            self.fasta = None
        self.needs_target = needs_target

    def verify(self):
        new_line = "\n"
        message = ""
        if not self.__is_fasta():
            message = "Not a fasta file / ASCII error"

        duplicated_ids = self.__unique_ids()
        if len(duplicated_ids) > 0:
            message = f"Duplicated ids.\n{new_line.join(duplicated_ids.tolist())}"

        if not self.__less_than_n():
            message = f"Too many sequences.{new_line}Use {self.max_number_sequences} or less."

        if not self.__more_than_n():
            message = f"Too few sequences.{new_line}Use {self.min_number_sequences} or more."

        invalid_protein_ids = self.__invalid_proteins()
        if len(invalid_protein_ids) > 0:
            message = f"There are invalid sequences, just use aminoacids.{new_line}{new_line.join(invalid_protein_ids)}"

        invalid_lengths = self.__invalid_lengths()
        if len(invalid_lengths) > 0:
            message = f"There are invalid sequences.\nUse peptides with a length between {self.min_length} and {self.max_length} residues.{new_line}{new_line.join(invalid_lengths)}"
        if not self.target_verification():
            message = f"Please verify target column. Needs a {self.task} column."
        if message != "":
            return _error_message(message)

        return {"status": "success", "path": self.path}

    def __unique_ids(self):
        ids = pd.Series([sequence.id for sequence in self.fasta])
        duplicated_ids = ids[ids.duplicated()]
        return duplicated_ids

    def __is_fasta(self):
        return self.fasta is not None

    def __less_than_n(self):
        return len(self.fasta) <= self.max_number_sequences

    def __more_than_n(self):
        return len(self.fasta) >= self.min_number_sequences

    def __invalid_proteins(self):
        invalid_ids = []
        aa_regex = re.compile(f"[{AMINOACID_ALPHABET}]+")
        for record in self.fasta:
            if not aa_regex.fullmatch(str(record.seq).upper()):
                invalid_ids.append(record.id)
        return invalid_ids

    def __invalid_lengths(self):
        invalid_ids = []
        for row in self.fasta:
            sequence = row.seq
            if len(sequence) > self.max_length or len(sequence) < 2:
                invalid_ids.append(row.id)
        return invalid_ids
        
    def target_verification(self):
        if self.needs_target:
            for a in self.fasta:
                try:
                    target = a.description.split("|")[1]
                    if target is None and target.strip() != "":
                        return False
                    return self.correct_target(target)
                except:
                    return False
        return True
        

    def correct_target(self, target):
        if self.task == "regression":
            try:
                float(target)
                return True
            except:
                return False
        return True

class Interface:
    def __init__(self, request):
        self.request = request
        self.post_json = None
        self.post_file = None
        self.data = None
        self.options = None
        self.is_json = False
        self.is_file = False

    def parse_json_and_file(self):
        try:
            self.post_json = self.request.json
            self.data = self.post_json["data"]
            self.is_json = True
            return
        except (Exception, AttributeError):
            self.post_json = None

        try:
            self.post_file = self.request.files
            self.data = self.post_file["file"]
            self.is_file = True
        except (Exception, AttributeError):
            self.post_file = None

    def parse_options(self):
        if self.post_json is not None:
            self.options = self.post_json["options"]
        elif self.post_file is not None:
            self.options = ast.literal_eval(
                self.post_file["options"].read().decode("utf-8")
            )

    def parse_with_options(self):
        self.parse_json_and_file()
        self.parse_options()
        return self.data, self.options, self.is_file

    def parse_without_options(self):
        self.parse_json_and_file()
        return self.data, self.is_file


class Folders:
    def __init__(self, config_file):
        # read config file and asign folder names.
        self.config = configparser.ConfigParser()
        self.config.read(config_file)

    def create_folders(self):
        # create folders
        for f in (
            "temp_folder",
            "static_folder",
            "results_folder",
        ):
            Path(self.config["folders"][f]).mkdir(parents=True, exist_ok=True)

    def get_static_folder(self):
        return self.config["folders"]["static_folder"]


def _error_message(message):
    return {"status": "error", "description": message}


def parse_fasta(text):
    fasta_regex = re.compile(r">([^\n]+)\n([^>]+)")
    return [
        {"id": seq_id, "sequence": seq.replace("\n", "").upper()}
        for seq_id, seq in fasta_regex.findall(text)
    ]


def fasta2df(text):
    fasta_regex = re.compile(r">([^\n]+)\n([^>]+)")
    return pd.DataFrame([
        {"id": seq_id, "sequence": seq.replace("\n", "").upper()}
        for seq_id, seq in fasta_regex.findall(text)
    ])

def df2fasta(data):
    text = ""
    for _, row in data.iterrows():
        text += f">{row.id}\n{row.sequence}\n"
    return text


def fasta2csv(fasta_path, csv_path, needs_target):
    with open(fasta_path, encoding="utf-8", mode="r") as file:
        text = file.read()
    fasta_regex = re.compile(r">([^\n]+)\n([^>]+)")
    if needs_target:
        df = pd.DataFrame([
            {"id": seq_id.split("|")[0], "sequence": seq.replace("\n", "").upper(), "target": seq_id.split("|")[1]}
            for seq_id, seq in fasta_regex.findall(text)
        ])
    else:
        df = pd.DataFrame([
            {"id": seq_id, "sequence": seq.replace("\n", "").upper()}
            for seq_id, seq in fasta_regex.findall(text)
        ])
    df.to_csv(csv_path, index=False)

def csv2fasta(csv_path, fasta_path, needs_target):
    data = pd.read_csv(csv_path)
    text = ""
    for _, row in data.iterrows():
        if needs_target:
            text += f"{row.id}\n{row.sequence}\n"
        else:
            text += f"{row.id}|{row.target}\n{row.sequence}\n"
    with open(fasta_path, mode="w", encoding="utf-8") as file:
        file.write(text)

def save_file_from_text(text, path):
    with open(path, mode="w", encoding="utf-8") as file:
        file.write(text)

def save_file_from_file(file, path):
    file.save(path)

def parse_response(request, config, config_name, needs_target, output_format, task = "clasification"):
    output_file_path = f"""{config["folders"]["temp_folder"]}/{str(round(random() * 10**20))}.{output_format}"""
    input_type = request.form["type"]

    if input_type == "fasta_text":
        save_file_from_text(request.form["data"], output_file_path)
    elif input_type == "fasta_file" or input_type == "csv_file":
        save_file_from_file(request.files["file"], output_file_path)

    if input_type == "fasta_text" or input_type == "fasta_file":
        fasta_obj = FastaFile(output_file_path, config, config_name, needs_target, task)
        check = fasta_obj.verify()
    elif input_type == "csv_file":
        csv_obj = CsvFile(output_file_path, config, config_name, needs_target, task)
        check = csv_obj.verify()
    
    if check["status"] == "error":
        return check
    
    if output_format == "fasta" and input_type == "csv_file":
        csv2fasta(check["path"], check["path"], needs_target)
    elif output_format == "csv" and (input_type == "fasta_file" or input_type == "fasta_text"):
        fasta2csv(check["path"], check["path"], needs_target)

    return {"status": "success", "path": check["path"]}
