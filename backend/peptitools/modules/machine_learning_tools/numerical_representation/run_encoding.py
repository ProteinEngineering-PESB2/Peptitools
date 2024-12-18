"""Encoding module"""

from random import random

import pandas as pd
from joblib import dump, load

import peptitools.config as config
from peptitools.modules.machine_learning_tools.numerical_representation.descriptors import (
    Descriptor,
)
from peptitools.modules.machine_learning_tools.numerical_representation.fft_encoding import (
    FftEncoding,
)
from peptitools.modules.machine_learning_tools.numerical_representation.one_hot_encoding import (
    OneHotEncoding,
)
from peptitools.modules.machine_learning_tools.numerical_representation.physicochemical_properties import (
    Physicochemical,
)
from peptitools.modules.machine_learning_tools.numerical_representation.protein_language_model import (
    Bioembeddings,
)
from peptitools.modules.machine_learning_tools.transformer.transformation_data import Transformer


class Encoding:
    """Encoding class"""

    def __init__(self, input_path, options):
        self.options = options
        self.data = pd.read_csv(input_path)
        self.results_folder = config.results_folder
        self.encoder_dataset = config.encoders_dataset
        self.output_path = f"{self.results_folder}/{round(random() * 10**20)}.csv"
        self.transformer = Transformer()
        self.dataset_encoded = None
        self.ids = self.data.id

    def run_encoding(self, from_pretrained=False):
        """Encoding process"""
        if self.options["encoding"] == "one_hot_encoding":
            one_hot_encoding = OneHotEncoding(self.data, "id", "sequence")
            self.dataset_encoded = one_hot_encoding.encode_dataset()
        if self.options["encoding"] in ["physicochemical_properties", "digital_signal_processing"]:
            physicochemical = Physicochemical(
                self.data, self.options["selected_property"], self.encoder_dataset, "id", "sequence"
            )
            self.dataset_encoded = physicochemical.encode_dataset()
        if self.options["encoding"] == "digital_signal_processing":
            fft = FftEncoding(self.dataset_encoded, "id")
            self.dataset_encoded = fft.encoding_dataset()
        if self.options["encoding"] == "embedding":
            bio_embeddings = Bioembeddings(self.data, "id", "sequence")
            if self.options["pretrained_model"] == "bepler":
                self.dataset_encoded = bio_embeddings.apply_bepler()
            if self.options["pretrained_model"] == "fasttext":
                self.dataset_encoded = bio_embeddings.apply_fasttext()
            if self.options["pretrained_model"] == "glove":
                self.dataset_encoded = bio_embeddings.apply_glove()
            if self.options["pretrained_model"] == "plus_rnn":
                self.dataset_encoded = bio_embeddings.apply_plus_rnn()
            if self.options["pretrained_model"] == "word2vec":
                self.dataset_encoded = bio_embeddings.apply_word2vec()
            if self.options["pretrained_model"] == "seqvec":
                self.dataset_encoded = bio_embeddings.apply_seqvec()
            if self.options["pretrained_model"] == "unirep":
                self.dataset_encoded = bio_embeddings.apply_seqvec()
        if self.options["encoding"] == "global_descriptor":
            descriptor = Descriptor(self.data, "id", "sequence")
            self.dataset_encoded = descriptor.encode_dataset()
        if from_pretrained:
            self.dataset_encoded = self.dataset_encoded.drop(columns=["id"])
            self.transform_data_from_pretrained()
        else:
            self.dataset_encoded = self.dataset_encoded.drop(columns=["id"])
            self.transform_data()
        header = ["id"] + self.dataset_encoded.columns[:-1].tolist()
        self.dataset_encoded = self.dataset_encoded[header]
        self.dataset_encoded.to_csv(self.output_path, index=False)
        response = {"encoding_path": self.output_path.replace("./", "/")}
        response.update(
            {
                "kernel_model_path": self.output_path.replace("./", "/").replace(
                    ".csv", "_kernel.joblib"
                )
            }
        )
        response.update(
            {
                "preprocessing_model_path": self.output_path.replace("./", "/").replace(
                    ".csv", "_preprocessing.joblib"
                )
            }
        )
        return response

    def transform_data_from_pretrained(self):
        if self.options["kernel"] != "":
            model = load("." + self.options["kernel_model_path"])
            self.dataset_encoded = model.transform(self.dataset_encoded)

        if self.options["preprocessing"] != "":
            model = load("." + self.options["preprocessing_model_path"])
            self.dataset_encoded = model.transform(self.dataset_encoded)

        if self.options["kernel"] != "" or self.options["preprocessing"] != "":
            self.dataset_encoded = pd.DataFrame(
                self.dataset_encoded,
                columns=[f"p_{a}" for a in range(len(self.dataset_encoded[0]))],
            )
        self.dataset_encoded["id"] = self.ids

    def transform_data(self):
        if self.options["kernel"] != "":
            self.dataset_encoded, kernel_model = self.transformer.apply_kernel_pca(
                self.dataset_encoded, self.options["kernel"]
            )
            dump(kernel_model, self.output_path.replace(".csv", "_kernel.joblib"))

        if self.options["preprocessing"] != "":
            self.dataset_encoded, preprocessing_model = self.transformer.apply_scaler(
                self.dataset_encoded, self.options["preprocessing"]
            )
            dump(preprocessing_model, self.output_path.replace(".csv", "_preprocessing.joblib"))

        if self.options["kernel"] != "" or self.options["preprocessing"] != "":
            self.dataset_encoded = pd.DataFrame(
                self.dataset_encoded,
                columns=[f"p_{a}" for a in range(len(self.dataset_encoded[0]))],
            )
        self.dataset_encoded["id"] = self.ids
