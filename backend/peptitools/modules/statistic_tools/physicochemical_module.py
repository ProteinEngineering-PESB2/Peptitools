"""Physicochemical module"""
import pandas as pd
from modlamp.descriptors import GlobalDescriptor
from peptitools.modules.statistic_tools.statistics import apply_kruskal, distribution, apply_tukey
import peptitools.config as config
class PhysicochemicalProperties:
    """Physicochemical Class"""

    def __init__(self, input_file, options):
        self.temp_file_path = input_file
        self.results_folder = config.results_folder
        self.options = options
        self.pvalue = float(options["pvalue"])
        
    def run_process(self):
        """Execute all selected properties"""
        records = pd.read_csv(self.temp_file_path)
        response = []
        for _, record in records.iterrows():
            sequence = str(record.sequence)
            dict_response = {}
            dict_response["id"] = record.id
            dict_response["target"] = record.target
            dict_response["length"] = len(sequence)
            dict_response["molecular_weight"] = self.get_mw(sequence)
            dict_response["isoelectric_point"] = self.get_isoelectric_point(sequence)
            dict_response["charge_density"] = self.get_charge_density(sequence)
            dict_response["charge"] = self.get_charge(sequence)
            dict_response["instability_index"] = self.get_instability_index(sequence)
            dict_response["aromaticity"] = self.get_aromaticity(sequence)
            dict_response["aliphatic_index"] = self.get_aliphatic_index(sequence)
            dict_response["boman_index"] = self.get_boman_index(sequence)
            dict_response["hydrophobic_ratio"] = self.get_hydrophobic_ratio(sequence)
            response.append(dict_response)
        df = pd.json_normalize(response)
        distribution_result = distribution(df)
        kruskal_result = apply_kruskal(df, self.pvalue)
        tukey_result = apply_tukey(kruskal_result, df, self.pvalue)
        if tukey_result is not None:
            return {"distribution": distribution_result, "kruskal": kruskal_result, "tukey": tukey_result}
        return {"distribution": distribution_result, "kruskal": kruskal_result}

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
