"""Supervised learning module"""

import numpy as np
import pandas as pd
from joblib import load

from peptitools.modules.machine_learning_tools.numerical_representation.run_encoding import Encoding
from peptitools.modules.machine_learning_tools.transformer.transformation_data import Transformer


class Predict(Encoding):
    """Supervised Learning class"""

    def __init__(self, data, options):
        super().__init__(data, options)
        self.options = options
        self.job_path = self.options["job_path"]
        self.kernel = self.options["kernel"]
        self.preprocessing = self.options["preprocessing"]
        self.transformer = Transformer()
        self.model = None

    def clf_prediction(self, model):
        prediction = model.predict(self.dataset_encoded)
        prediction_proba = model.predict_proba(self.dataset_encoded)
        prediction_proba = np.around(prediction_proba, 3)
        self.dataset_encoded["label"] = prediction
        self.dataset_encoded["id"] = self.ids
        predictions = self.dataset_encoded[["id", "label"]].copy()
        classes = ["label: " + str(a) for a in model.classes_]
        probas = pd.DataFrame(data=prediction_proba, columns=classes)
        probas["id"] = self.ids
        probas = probas[["id"] + classes]
        self.options.update(self.options)
        self.options.update(
            {
                "predictions": {
                    "data": predictions.values.tolist(),
                    "columns": predictions.columns.tolist(),
                }
            }
        )
        self.options.update(
            {"probabilities": {"data": probas.values.tolist(), "columns": probas.columns.tolist()}}
        )

    def regr_prediction(self, model):
        prediction = model.predict(self.dataset_encoded)
        self.dataset_encoded["label"] = prediction
        self.dataset_encoded["id"] = self.ids
        predictions = self.dataset_encoded[["id", "label"]].copy()
        self.options.update(self.options)
        self.options.update(
            {
                "predictions": {
                    "data": predictions.values.tolist(),
                    "columns": predictions.columns.tolist(),
                }
            }
        )

    def run_process(self):
        """Runs encoding, preprocessing and build ML model"""
        self.run_encoding(from_pretrained=True)
        self.dataset_encoded.drop(["id"], axis=1, inplace=True, errors="ignore")
        path = self.job_path
        model = load(path)
        if self.options["task"] == "classification":
            self.clf_prediction(model)
        if self.options["task"] == "regression":
            self.regr_prediction(model)
        return self.options
