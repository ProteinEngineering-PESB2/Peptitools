from peptitools.modules.database_models.table_models import Activity, PredictiveModel
from peptitools.modules.database_models.database import Database
from peptitools.modules.database_models.materialized_views import *
from peptitools.modules.machine_learning_tools.numerical_representation.protein_language_model import Bioembeddings
from sqlalchemy import select
import json
from flask import jsonify
import pandas as pd
import numpy as np
from peptitools.modules.utils import fasta2df
from peptitools import config
from random import random
import joblib


class PredictiveModels:
    def __init__(self):
        self.db = Database()
        stmt = select(MVPredictedActivities)
        self.df = self.db.get_table_query(stmt)
        self.list_predictions = []
        self.encoded_dfs = {}
        self.joblib_models = {}

    def get_activities_list(self):
        activities = self.df.name.tolist()
        ids = self.df.id_activity.tolist()
        return {"activities": activities, "ids" : ids}

    def encode(self, data, request):
        data = data.replace("\r", "")
        dataset = fasta2df(data)
        self.ids = dataset.id
        self.bioembeddings = Bioembeddings(dataset, "id", "sequence")
        activities = request["activities"]
        for activity in activities:
            self.list_predictions.append(activity)
            if request["predict_parent"]:
                self.get_parents(activity)
        self.list_predictions = list(set(self.list_predictions))
        self.to_predict = self.df[self.df.name.isin(self.list_predictions)].reset_index(drop=True)
        for encoder in self.to_predict.encoder.unique():
            self.encoded_dfs[encoder] = self.encode_row(encoder)
        for model in self.to_predict.name:
            self.joblib_models[model] = joblib.load(f"./files/selected_models/{model}/{model}_model.joblib")

    def predict(self, data, request):
        self.encode(data, request)
        predictions_dict = {}
        predicted_activities = []
        for _, row in self.to_predict.iterrows():
            model = self.joblib_models[row["name"]]
            encoded = self.encoded_dfs[row.encoder]
            prediction = model.predict(encoded)
            prediction_proba = model.predict_proba(encoded)
            dataset_response = pd.DataFrame()
            dataset_response["Label"] = prediction
            dataset_response["Id"] = self.ids
            predictions = dataset_response[["Id", "Label"]].copy()
            classes = ["Label: " +  str(a) for a in model.classes_]
            probas = pd.DataFrame(data = prediction_proba, columns=classes)
            probas = probas.round(3)
            probas["Id"] = self.ids
            probas = probas[["Id"] + classes]
            predictions_dict[row["name"]] = {"predictions": {"data": predictions.values.tolist(),
                            "columns": predictions.columns.tolist()},
                        "probabilities": {"data": probas.values.tolist(),
                            "columns": probas.columns.tolist()}}
            predicted_activities.append({"value": row["name"], "title": row["name"]})
        
        response = {"data": predictions_dict, "predicted_activities": predicted_activities}
        return response


    def get_parents(self, activity):
        try:
            id_parent = self.df[self.df.name == activity].id_parent.values[0]
            name_parent = self.df[self.df.id_activity == id_parent].name.values[0]
            self.list_predictions.append(name_parent)
            self.get_parents(name_parent)
        except:
            return None

    def encode_row(self, encoder):d
        if encoder == "prottrans_t5_uniref":
            encoded_df = self.bioembeddings.apply_prottrans_t5_uniref()

        if encoder == "prottrans_t5_xlu50":
            encoded_df = self.bioembeddings.apply_prottrans_t5_xlu50()

        if encoder == "esm1b":
            encoded_df = self.bioembeddings.apply_esm1b()

        if encoder == "prottrans_albert":
            encoded_df = self.bioembeddings.apply_albert()

        if encoder == "prottrans_bert":
            encoded_df = self.bioembeddings.apply_bert()

        if encoder == "prottrans_xlnet":
            encoded_df = self.bioembeddings.apply_xlnet()

        if encoder == "prottrans_t5bdf":
            encoded_df = self.bioembeddings.apply_t5bdf()
        
        encoded_df = encoded_df[encoded_df.columns[1:]].values
        return encoded_df
