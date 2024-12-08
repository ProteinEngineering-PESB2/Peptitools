"""Config utilities"""

import os
import re
from random import random

import pandas as pd
from Bio import SeqIO
from flask import make_response
from sklearn.utils.multiclass import type_of_target

import peptitools.config as config

AMINOACID_ALPHABET = "ARNDCEQGHILKMFPSTWYVX*"


class CsvFile:
    """Parse a csv file"""

    def __init__(self, path, config_name, needs_target, task):
        self.path = path
        self.max_number_sequences = config.form_params[config_name]["max_sequences"]
        self.min_number_sequences = config.form_params[config_name]["min_sequences"]
        self.max_length = config.form_params["global"]["max_length"]
        self.min_length = config.form_params["global"]["min_length"]
        self.id_column = config.csv["id_column"]
        self.sequence_column = config.csv["sequence_column"]
        self.target_column = config.csv["target_column"]
        self.task = task

        try:
            self.data = pd.read_csv(self.path)
        except:
            self.data = None
        self.needs_target = needs_target

    def verify(self):
        new_line = "\n"
        message = ""

        if not self.__is_csv():
            message = "Not a csv file / ASCII error"
            return _error_message(message)

        incorrect_columns = self.__has_correct_columns()
        if len(incorrect_columns) != 0:
            message = f"This csv file doesn't have the required columns:\nColumns not found:{', '.join(incorrect_columns)}"
            return _error_message(message)

        if not self.__null_values():
            message = "Data has null values"
            return _error_message(message)

        duplicated_id = self.__unique_ids()
        if len(duplicated_id) > 0:
            message = f"Duplicated ids.{new_line}{new_line.join(duplicated_id)}"
            return _error_message(message)

        if not self.__less_than_n():
            message = f"Too many sequences.{new_line}Use {self.max_number_sequences} or less."
            return _error_message(message)

        if not self.__more_than_n():
            message = f"Too few sequences.{new_line}Use {self.min_number_sequences} or more."
            return _error_message(message)

        invalid_protein_ids = self.__invalid_proteins()
        if len(invalid_protein_ids) > 0:
            message = f"There are some invalid sequences, just use aminoacids.{new_line}{new_line.join(invalid_protein_ids)}"
            return _error_message(message)

        invalid_lengths = self.__invalid_lengths()
        if len(invalid_lengths) > 0:
            message = f"There are some invalid sequences, use peptides with a length between {self.min_length} and {self.max_length}.{new_line}{new_line.join(invalid_lengths)}"
            return _error_message(message)
        if not self.__correct_target():
            message = f"Please verify target column. Needs a {self.task} column."
            return _error_message(message)
        if not self.verify_target_type():
            message = "Please verify target column. Must be in tune with task."
            return _error_message(message)
        return {"status": "success", "path": self.path}

    def __unique_ids(self):
        return self.data.id[self.data.id.duplicated()]

    def __is_csv(self):
        return self.data is not None

    def __less_than_n(self):
        return self.data.shape[0] <= self.max_number_sequences

    def __more_than_n(self):
        return self.data.shape[0] >= self.min_number_sequences

    def __invalid_proteins(self):
        invalid_ids = []
        aa_regex = re.compile(f"[{AMINOACID_ALPHABET}]+")
        for row in self.data.itertuples():
            if not aa_regex.fullmatch(row.sequence.upper()):
                invalid_ids.append(row.id)
        return invalid_ids

    def __invalid_lengths(self):
        invalid_ids = []
        for row in self.data.itertuples():
            sequence = row.sequence
            if len(sequence) > self.max_length or len(sequence) < 2:
                invalid_ids.append(row.id)
        return invalid_ids

    def __null_values(self):
        return self.data.isnull().any(axis=1).sum() == 0

    def __has_correct_columns(self):
        incorrect_columns = []
        if self.id_column not in self.data.columns:
            incorrect_columns.append(self.id_column)
        if self.sequence_column not in self.data.columns:
            incorrect_columns.append(self.sequence_column)
        if self.target_column not in self.data.columns and self.needs_target:
            incorrect_columns.append(self.target_column)
        return incorrect_columns

    def __correct_target(self):
        if self.task == "regression":
            try:
                self.data.target.astype(float)
                return True
            except:
                return False
        return True

    def verify_target_type(self):
        if self.needs_target:
            real_target_type = type_of_target(self.data.target)
            if self.task == "classification":
                if real_target_type in ["multiclass", "binary"]:
                    return True
                return False
            if self.task == "regression":
                if real_target_type in ["continuous"]:
                    return True
                return False
        return True


class FastaFile:
    """Parse a fasta file"""

    def __init__(self, path, config_name, needs_target, task):
        self.path = path
        self.max_number_sequences = config.form_params[config_name]["max_sequences"]
        self.min_number_sequences = config.form_params[config_name]["min_sequences"]
        self.max_length = config.form_params["global"]["max_length"]
        self.min_length = config.form_params["global"]["min_length"]
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
        if not self.__target_verification():
            message = f"Please verify target column. Needs a {self.task} column."
        if not self.verify_target_type():
            message = "Please verify target column. Must be in tune with task."
        if message != "":
            return _error_message(message)
        print("Pasa control")
        return {"status": "success", "path": self.path}

    def __unique_ids(self):
        ids = pd.Series([sequence.id for sequence in self.fasta])
        return ids[ids.duplicated()]

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

    def __target_verification(self):
        if self.needs_target:
            for a in self.fasta:
                try:
                    target = a.description.split("|")[1]
                    if target is None and target.strip() != "":
                        return False
                    return self.__correct_target(target)
                except:
                    return False
        return True

    def __correct_target(self, target):
        if self.task == "regression":
            try:
                float(target)
                return True
            except:
                return False
        return True

    def verify_target_type(self):
        if self.needs_target:
            with open(self.path, encoding="utf-8", mode="r") as file:
                text = file.read()
            fasta_regex = re.compile(r">([^\n]+)\n([^>]+)")
            df = pd.DataFrame(
                [
                    {
                        "id": seq_id.split("|")[0],
                        "sequence": seq.replace("\n", "").upper(),
                        "target": seq_id.split("|")[1],
                    }
                    for seq_id, seq in fasta_regex.findall(text)
                ]
            )
            real_target_type = type_of_target(df.target)
            if self.task == "classification":
                if real_target_type in ["multiclass", "binary"]:
                    return True
                return False
            if self.task == "regression":
                if real_target_type in ["continuous"]:
                    return True
                return False
        return True


def create_config_folders():
    for folder in [config.static_folder, config.temp_folder, config.results_folder]:
        if not os.path.exists(folder):
            os.makedirs(folder)


def _error_message(message):
    return {"status": "error", "description": message}


def fasta2df(text):
    """Converts a fasta text to dataframe"""
    fasta_regex = re.compile(r">([^\n]+)\n([^>]+)")
    return pd.DataFrame(
        [
            {"id": seq_id, "sequence": seq.replace("\n", "").upper()}
            for seq_id, seq in fasta_regex.findall(text)
        ]
    )


def df2fasta(data):
    """Converts a dataframe to fasta text"""
    text = ""
    for _, row in data.iterrows():
        text += f">{row.id}\n{row.sequence}\n"
    return text


def fasta2csv(fasta_path, csv_path, needs_target):
    """Converts a fasta text to dataframe and stores it"""
    with open(fasta_path, encoding="utf-8", mode="r") as file:
        text = file.read()
    fasta_regex = re.compile(r">([^\n]+)\n([^>]+)")
    if needs_target:
        df = pd.DataFrame(
            [
                {
                    "id": seq_id.split("|")[0],
                    "sequence": seq.replace("\n", "").upper(),
                    "target": seq_id.split("|")[1],
                }
                for seq_id, seq in fasta_regex.findall(text)
            ]
        )
    else:
        df = pd.DataFrame(
            [
                {"id": seq_id, "sequence": seq.replace("\n", "").upper()}
                for seq_id, seq in fasta_regex.findall(text)
            ]
        )
    df.to_csv(csv_path, index=False)


def csv2fasta(csv_path, fasta_path, needs_target):
    """Converts a csv file to fasta text and saves it"""
    data = pd.read_csv(csv_path)
    text = ""
    for _, row in data.iterrows():
        if needs_target:
            text += f">{row.id}|{row.target}\n{row.sequence}\n"
        else:
            text += f">{row.id}\n{row.sequence}\n"
    with open(fasta_path, mode="w", encoding="utf-8") as file:
        file.write(text)


def save_file_from_text(text, path):
    """Just creates a file from text"""
    with open(path, mode="w", encoding="utf-8") as file:
        file.write(text)


def save_file_from_file(file, path):
    """Just save a file"""
    file.save(path)


def parse_request(request, config_name, needs_target, output_format, task="clasification"):
    """Parse request from post data"""
    output_file_path = f"""{config.temp_folder}/{str(round(random() * 10**20))}.{output_format}"""
    input_type = request.form["type"]
    if input_type == "fasta_text":
        save_file_from_text(request.form["data"], output_file_path)
    elif input_type == "fasta_file" or input_type == "csv_file":
        save_file_from_file(request.files["file"], output_file_path)
    if input_type == "fasta_text" or input_type == "fasta_file":
        fasta_obj = FastaFile(output_file_path, config_name, needs_target, task)
        check = fasta_obj.verify()
    elif input_type == "csv_file":
        csv_obj = CsvFile(output_file_path, config_name, needs_target, task)
        check = csv_obj.verify()
    if check["status"] == "error":
        return check
    if output_format == "fasta" and input_type == "csv_file":
        csv2fasta(check["path"], check["path"], needs_target)
    elif output_format == "csv" and (input_type == "fasta_file" or input_type == "fasta_text"):
        fasta2csv(check["path"], check["path"], needs_target)
    return {"status": "success", "path": check["path"]}


def check_pvalue(pvalue):
    """Check if pvalue is a float number between 0 - 0.5"""
    try:
        pvalue = float(pvalue)
        if pvalue <= 0.5:
            if pvalue > 0:
                return {"status": "success"}
            return {"status": "error", "description": "P-value must be greater than 0"}
        return {"status": "error", "description": "P-value must be less than 0.5"}
    except ValueError:
        return {"status": "error", "description": "P-value isn't a numeric value."}


def parse_response(res, status_code=None):
    """Parse response and return results"""
    if status_code is not None:
        return make_response(res, status_code)
    if isinstance(res, (list, dict)):
        if len(res) != 0:
            return make_response({"results": res}, 200)
        return make_response({"description": "Not Found"}, 404)
    return make_response({"description": res}, 500)
