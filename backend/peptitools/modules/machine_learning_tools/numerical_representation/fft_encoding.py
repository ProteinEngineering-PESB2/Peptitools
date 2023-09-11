from math import ceil, pow, log2
from scipy.fft import fft
import numpy as np
import pandas as pd
from joblib import Parallel, delayed
import multiprocessing as mp

class FftEncoding:
    def __init__(self, dataset, name_column_id, n_cores = None, vector_size = None):
        self.dataset = dataset
        self.size_data = self.dataset.shape[1] - 1
        self.name_column_id = name_column_id

        self.n_cores = mp.cpu_count()
        if n_cores is not None:
            self.n_cores = n_cores
        if vector_size is None:
            self.vector_size = int(pow(2, ceil(log2(self.size_data))))
        else:
            self.vector_size = vector_size
        self.__init_process()

    def __init_process(self):
        self.column_id = self.dataset[self.name_column_id]
        self.dataset = self.dataset.drop(columns=[self.name_column_id])
        for i in range(self.size_data, self.vector_size):
            column_name = f"p_{i}"
            new_df = pd.DataFrame(columns=[column_name])
            new_df[column_name] = np.zeros(self.dataset.shape[0])
            self.dataset = pd.concat([self.dataset, new_df], axis = 1)

    def __apply_FFT(self, row):
        yf = fft(row.to_numpy())
        yf = np.abs(yf[0:self.vector_size // 2])
        return yf.tolist()

    def encoding_dataset(self):
        data_process_FFT = Parallel(n_jobs=self.n_cores, require='sharedmem')(
            delayed(self.__apply_FFT)(row) for _, row in self.dataset.iterrows())
        matrix_data = [element for element in data_process_FFT]
        header = [f'p_{i}' for i in range(self.vector_size//2)]
        df_encoded = pd.DataFrame(matrix_data, columns=header)
        df_encoded[self.name_column_id] = self.column_id
        df_encoded = df_encoded[[self.name_column_id] + header]
        return df_encoded