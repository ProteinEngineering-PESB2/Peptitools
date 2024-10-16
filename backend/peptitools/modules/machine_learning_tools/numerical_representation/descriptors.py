import os

import pandas as pd
from joblib import Parallel, delayed
from modlamp.descriptors import GlobalDescriptor

from peptitools.modules.machine_learning_tools.numerical_representation.encoder import Encoder


class Descriptor(Encoder):
    def __init__(self, dataset=None, name_column_id=None, name_column_seq=None, n_cores=None):
        super().__init__(dataset, name_column_id, name_column_seq, n_cores)

    def encode_sequence(self, sequence):
        sequence = sequence.upper()
        return self.execute_modlamp(sequence)

    def execute_modlamp(self, sequence):
        """Execute all selected properties"""
        sequence = str(sequence)

        dict_response = {}
        dict_response["p_0"] = len(sequence)
        dict_response["p_1"] = self.get_mw(sequence)
        dict_response["p_2"] = self.get_isoelectric_point(sequence)
        dict_response["p_3"] = self.get_charge_density(sequence)
        dict_response["p_4"] = self.get_charge(sequence)
        dict_response["p_5"] = self.get_instability_index(sequence)
        dict_response["p_6"] = self.get_aromaticity(sequence)
        dict_response["p_7"] = self.get_aliphatic_index(sequence)
        dict_response["p_8"] = self.get_boman_index(sequence)
        dict_response["p_9"] = self.get_hydrophobic_ratio(sequence)
        return dict_response

    def encode_dataset(self):
        data_encoding = Parallel(n_jobs=self.n_cores, require="sharedmem")(
            delayed(self.encode_sequence)(sequence) for sequence in self.column_seq
        )
        df_encoded = pd.DataFrame(data_encoding)
        df_encoded[self.name_column_id] = self.column_id
        header = [self.name_column_id] + df_encoded.columns[:-1].tolist()
        return df_encoded[header]

    def get_mw(self, sequence):
        """Molecular Weight"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.calculate_MW(amide=True)
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def get_isoelectric_point(self, sequence):
        """Isoelectric point"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.isoelectric_point(amide=True)
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def get_charge_density(self, sequence):
        """Charge density"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.charge_density(ph=7, amide=True)
            return round(desc.descriptor[0][0], 5)
        except:
            return "-"

    def get_charge(self, sequence):
        """Charge"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.calculate_charge(ph=7, amide=True)
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def get_instability_index(self, sequence):
        """Instability index"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.instability_index()
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def get_aromaticity(self, sequence):
        """Aromaticity"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.aromaticity()
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def get_aliphatic_index(self, sequence):
        """Aliphatic index"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.aliphatic_index()
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def get_boman_index(self, sequence):
        """Boman index"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.boman_index()
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def get_hydrophobic_ratio(self, sequence):
        """Hydrophobic ratio"""
        try:
            desc = GlobalDescriptor([sequence])
            desc.hydrophobic_ratio()
            return round(desc.descriptor[0][0], 4)
        except:
            return "-"

    def delete_file(self):
        """Delete temp file"""
        try:
            os.remove(self.temp_file_path)
        except:
            pass
