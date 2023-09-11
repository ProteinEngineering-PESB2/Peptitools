from peptitools.modules.machine_learning_tools.numerical_representation.encoder import Encoder
class OneHotEncoding(Encoder):

    def __init__(self, dataset=None, name_column_id=None, name_column_seq=None, n_cores = None):
        super().__init__(dataset, name_column_id, name_column_seq, n_cores)
        self.vector_size = self.zero_padding * 20

    def __encode_residue(self, residue):
        vector = [0 for _ in range(20)]
        if self.check_residues(residue):
            position = self.dict_pos[residue]
            vector[position] = 1
        return vector
        
    def encode_sequence(self, sequence):
        sequence = sequence.upper()
        sequence_encoding = []
        for residue in sequence:
            sequence_encoding = sequence_encoding + self.__encode_residue(residue)
        for _ in range(len(sequence_encoding), self.vector_size):
            sequence_encoding.append(0)
        return sequence_encoding
    