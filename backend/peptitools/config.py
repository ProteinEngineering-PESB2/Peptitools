import os

host = "0.0.0.0"
port = 8000

static_folder = os.environ.get("STATIC_PATH", "./files")
temp_folder = os.environ.get("TEMP_PATH", "./temp_files")
results_folder = os.environ.get("RESULTS_PATH", f"{temp_folder}/results")
sample_peptipedia = f"{static_folder}/sample_peptipedia.fasta"
encoders_dataset = f"{static_folder}/input_encoders/clustering_encoders.csv"

form_params = {
    "global": {"max_length": 150, "min_length": 2},
    "msa": {"min_sequences": 3, "max_sequences": 100},
    "pfam": {"min_sequences": 1, "max_sequences": 500},
    "gene_ontology": {"min_sequences": 1, "max_sequences": 500},
    "secondary_structure": {"min_sequences": 1, "max_sequences": 500},
    "physicochemical": {"min_sequences": 1, "max_sequences": 2000},
    "frequency": {"min_sequences": 1, "max_sequences": 2000},
    "encoding": {"min_sequences": 1, "max_sequences": 2000},
    "clustering": {"min_sequences": 50, "max_sequences": 2000},
    "supervised_learning": {"min_sequences": 50, "max_sequences": 2000},
    "models": {"min_sequences": 1, "max_sequences": 2000},
}
csv = {"id_column": "id", "sequence_column": "sequence", "target_column": "target"}
