import pandas as pd
from peptitools.modules.machine_learning_tools.numerical_representation.encoder import Encoder

class Physicochemical(Encoder):
    def __init__(self, dataset, property_encoder, dataset_encoder_path, name_column_id, name_column_seq, n_cores = None):
        super().__init__(dataset, name_column_id, name_column_seq, n_cores)
        self.dataset_encoder = pd.read_csv(dataset_encoder_path, index_col=0)
        self.property_encoder = property_encoder
        self.vector_size = self.zero_padding

    def __encode_residue(self, residue):
        if self.check_residues(residue):
            return self.dataset_encoder[self.property_encoder][residue]
        return False

    def encode_sequence(self, sequence):
        sequence = sequence.upper()
        sequence_encoding = []
        for residue in sequence:
            response_encoding = self.__encode_residue(residue)
            if response_encoding:
                sequence_encoding.append(response_encoding)
        for _ in range(len(sequence_encoding), self.vector_size):
            sequence_encoding.append(0)
        return sequence_encoding
