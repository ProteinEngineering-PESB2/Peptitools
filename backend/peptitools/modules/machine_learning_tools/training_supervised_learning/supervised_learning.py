"""Supervised learning module"""
from joblib import dump
from peptitools.modules.machine_learning_tools.transformer.transformation_data import Transformer
from peptitools.modules.machine_learning_tools.numerical_representation.run_encoding import Encoding
from peptitools.modules.machine_learning_tools.training_supervised_learning.run_algorithm import RunAlgorithm
import pandas as pd
class SupervisedLearning(Encoding):
    """Supervised Learning class"""

    def __init__(self, data, config, options):
        super().__init__(data, config, options)
        self.options = options
        self.task = self.options["task"]
        self.algorithm = self.options["algorithm"]
        self.validation = self.options["validation"]
        self.test_size = self.options["test_size"]
        self.kernel = self.options["kernel"]
        self.preprocessing = self.options["preprocessing"]
        self.transformer = Transformer()

        self.target = self.data.target
        self.data.drop("target", inplace=True, axis=1)
        
        self.model = None

    def run_process(self):
        """Runs encoding, preprocessing and build ML model"""
        self.run_encoding()
        self.dataset_encoded.drop(["id"], axis=1, inplace=True)
        run_instance = RunAlgorithm(
            self.dataset_encoded,
            self.target,
            self.task,
            self.algorithm,
            self.validation,
            self.test_size,
        )
        response_training = run_instance.training_model()

        performances = pd.DataFrame([response_training["performance"]])
        performances["set"] = ["Training"]
        if self.task == "regression":
            corr = pd.DataFrame([response_training["corr"]])
            corr["set"] = ["Training"]

        if self.test_size != 0:
            response_testing = run_instance.testing_model()
            if self.task == "regression":
                temp = response_testing["performance"]
                response_testing["performance_testing"] = temp
                del response_testing["performance"]

                temp = response_testing["corr"]
                response_testing["corr_testing"] = temp
                del response_testing["corr"]

                temp = response_testing["scatter"]
                response_testing["scatter_testing"] = temp
                del response_testing["scatter"]

                temp = response_testing["error_values"]
                response_testing["error_values_testing"] = temp
                del response_testing["error_values"]

            elif self.task == "classification":
                temp = response_testing["performance"]
                response_testing["performance_testing"] = temp
                del response_testing["performance"]

                temp = response_testing["confusion_matrix"]
                response_testing["confusion_matrix_testing"] = temp
                del response_testing["confusion_matrix"]

                temp = response_testing["analysis"]
                response_testing["analysis_testing"] = temp
                del response_testing["analysis"]

            response_training.update(response_testing)

            performances = pd.DataFrame([response_training["performance"], response_training["performance_testing"]])
            performances["set"] = ["Training", "Testing"]

            if self.task == "regression":
                corr = pd.DataFrame([response_training["corr"], response_training["corr_testing"]])
                corr["set"] = ["Training", "Testing"]


        response_training["metrics"] = {
            "data": performances.values.tolist(),
            "columns": performances.columns.to_list()
        }
        if self.task == "regression":
            response_training["corr_metrics"] = {
                "data": corr.values.tolist(),
                "columns": corr.columns.to_list()
            }
        self.model = run_instance.get_model()
        self.job_path = self.output_path.replace(".csv", ".joblib")
        self.dump_joblib()
        response_training["job_path"] = self.job_path
        return response_training

    def dump_joblib(self):
        """Save model"""
        dump(self.model, self.job_path)
