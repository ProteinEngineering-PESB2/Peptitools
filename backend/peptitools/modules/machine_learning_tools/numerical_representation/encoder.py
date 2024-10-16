import multiprocessing as mp

import pandas as pd
from joblib import Parallel, delayed


class Encoder:
    def __init__(self, dataset=None, name_column_id=None, name_column_seq=None, n_cores=None):
        self.dataset = dataset
        self.name_column_id = name_column_id
        self.name_column_seq = name_column_seq
        self.column_id = self.dataset[self.name_column_id]
        self.column_seq = self.dataset[self.name_column_seq]
        self.zero_padding = 150
        self.possible_residues = "ACDEFGHINKLMPQRSTVWY"
        self.dict_pos = {res: i for i, res in enumerate(self.possible_residues)}
        if n_cores is None:
            self.n_cores = mp.cpu_count()
        else:
            self.n_cores = n_cores

    def check_max_size(self):
        size_serie = self.column_seq.str.len()
        return size_serie.max()

    def check_residues(self, residue):
        if residue in self.possible_residues:
            return True
        return False

    def encode_dataset(self):
        data_encoding = Parallel(n_jobs=self.n_cores, require="sharedmem")(
            delayed(self.encode_sequence)(sequence) for sequence in self.column_seq
        )
        matrix_data = [element for element in data_encoding]
        header = [f"p_{i}" for i in range(self.vector_size)]
        df_encoded = pd.DataFrame(matrix_data, columns=header)
        df_encoded[self.name_column_id] = self.column_id
        return df_encoded[[self.name_column_id] + header]
