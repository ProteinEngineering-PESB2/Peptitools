"""Supervised learning module"""
from joblib import load
from peptitools.modules.machine_learning_tools.transformer.transformation_data import Transformer
from peptitools.modules.machine_learning_tools.numerical_representation.run_encoding import Encoding
import pandas as pd
import numpy as np
class Activity(Encoding):
    """Supervised Learning class"""
    def __init__(self, data, options):
        super().__init__(data, options)
        self.options = options
        self.job_folder = "./files/models/activity/"
        self.kernel = None
        self.preprocessing = None
        self.model = None
        self.transformer = Transformer()

    def clf_prediction(self, model, model_name):
        prediction = model.predict(self.dataset_encoded)
        prediction_proba = model.predict_proba(self.dataset_encoded)
        prediction_proba = np.around(prediction_proba, 3)
        self.dataset_encoded["label"] = prediction
        self.dataset_encoded["id"] = self.ids
        predictions = self.dataset_encoded[["id", "label"]].copy()
        classes = ["label: " +  str(a) for a in model.classes_]
        probas = pd.DataFrame(data = prediction_proba, columns=classes)
        probas["id"] = self.ids
        probas = probas[["id"] + classes]
        self.options.update(self.options)
        self.options.update({model_name: {"predictions": {"data": predictions.values.tolist(),
                                            "columns": predictions.columns.tolist()}}})
        self.options.update({model_name: {"probabilities": {"data": probas.values.tolist(),
                                            "columns": probas.columns.tolist()}}})

    def run_process(self):
        """Runs encoding, preprocessing and build ML model"""
        self.run_encoding(from_pretrained=True)
        self.dataset_encoded.drop(["id"], axis=1, inplace=True, errors="ignore")
        for model_name in self.options["models"]:
            model = load(self.job_folder + model_name)
            self.clf_prediction(model, model_name)
        return self.options