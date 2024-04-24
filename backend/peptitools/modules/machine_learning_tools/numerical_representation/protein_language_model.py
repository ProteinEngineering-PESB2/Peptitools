import pandas as pd
import numpy as np

class Bioembeddings(object):

    def __init__(
            self,
            dataset=None,
            column_id=None,
            column_seq=None,
            is_reduced=True,
            device = None
            ):
        
        self.dataset = dataset
        self.column_id = column_id
        self.column_seq = column_seq
        self.is_reduced=is_reduced
        self.device = device

        # to save the results
        self.embedder = None
        self.embeddings = None
        self.np_data = None

    def __apply_embedding(self, model):
        if self.device != None:
            self.embedder = model(device=self.device)
        else:
            self.embedder = model()
        
        self.embeddings = self.embedder.embed_many(
            self.dataset[self.column_seq].to_list())
        
        if self.is_reduced == True:
            self.__reducing()
        return self.parse_output()

    def __reducing(self):
        self.np_data = np.zeros(shape=(len(self.dataset), self.embedder.embedding_dimension))
        for idx, embed in enumerate(self.embeddings):
            self.np_data[idx] = self.embedder.reduce_per_protein(embed)

    def apply_bepler(self):
        from bio_embeddings.embed import BeplerEmbedder
        return self.__apply_embedding(BeplerEmbedder)

    def apply_fasttext(self):
        from bio_embeddings.embed import FastTextEmbedder
        return self.__apply_embedding(FastTextEmbedder)

    def apply_glove(self):
        from bio_embeddings.embed import GloveEmbedder
        return self.__apply_embedding(GloveEmbedder)

    def apply_plus_rnn(self):
        from bio_embeddings.embed import PLUSRNNEmbedder
        return self.__apply_embedding(PLUSRNNEmbedder)

    def apply_word2vec(self):
        from bio_embeddings.embed import Word2VecEmbedder
        return self.__apply_embedding(Word2VecEmbedder)
    
    def apply_seqvec(self):
        from bio_embeddings.embed import SeqVecEmbedder
        return self.__apply_embedding(SeqVecEmbedder)
    
    def apply_seqvec(self):
        from bio_embeddings.embed import UniRepEmbedder
        return self.__apply_embedding(UniRepEmbedder)
        


    def apply_prottrans_t5_uniref(self):
        from bio_embeddings.embed import ProtTransT5UniRef50Embedder
        return self.__apply_embedding(ProtTransT5UniRef50Embedder)

    def apply_prottrans_t5_xlu(self):
        from bio_embeddings.embed import ProtTransT5XLU50Embedder
        return self.__apply_embedding(ProtTransT5XLU50Embedder)

    def apply_esm1b(self):
        from bio_embeddings.embed import ESM1bEmbedder
        return self.__apply_embedding(ESM1bEmbedder)

    def apply_prottrans_albert(self):
        from bio_embeddings.embed import ProtTransAlbertBFDEmbedder
        return self.__apply_embedding(ProtTransAlbertBFDEmbedder)

    def apply_prottrans_bert(self):
        from bio_embeddings.embed import ProtTransBertBFDEmbedder
        return self.__apply_embedding(ProtTransBertBFDEmbedder)

    def apply_prottrans_xlnet(self):
        from bio_embeddings.embed import ProtTransXLNetUniRef100Embedder
        return self.__apply_embedding(ProtTransXLNetUniRef100Embedder)

    def apply_prottrans_xlu50(self):
        from bio_embeddings.embed import ProtTransT5XLU50Embedder
        return self.__apply_embedding(ProtTransT5XLU50Embedder)


    def parse_output(self):
        header = ["p_{}".format(i) for i in range(len(self.np_data[0]))]
        df_data_encode = pd.DataFrame(self.np_data, columns=header)
        df_data_encode[self.column_id] = self.dataset[self.column_id]
        df_data_encode = df_data_encode[[self.column_id] + header]
        return df_data_encode