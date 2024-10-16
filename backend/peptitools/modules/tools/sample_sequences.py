from peptitools.modules.database_models.database import Database
from peptitools.modules.utils import df2fasta


class SampleSequences:
    def __init__(self, sample_path, limit):
        self.sample_path = sample_path
        self.limit = int(limit)

    def get_sample(self):
        db = Database()
        df = db.get_peptipedia_sample(self.limit)
        df = df.rename(columns={"id_peptide": "id"})
        return {"data": df2fasta(df)}
