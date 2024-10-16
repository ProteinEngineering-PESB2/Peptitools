import numpy as np
from peptitools.modules.utils import fasta2df, df2fasta
from peptitools.modules.database_models.database import Database

class SampleSequences:
    def __init__(self, sample_path, limit):
        self.sample_path = sample_path
        self.limit = int(limit)
    def get_sample(self):
        db = Database()
        df = db.get_peptipedia_sample(self.limit)
        df = df.rename(columns={"id_peptide": "id"})
        return  {"data": df2fasta(df)}
        