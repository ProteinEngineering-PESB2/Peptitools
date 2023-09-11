import pandas as pd
import json
import os
class ActivityList:

    def get_activity_list(self, config):
        activities = pd.read_csv(config["folders"]["activity_table"])
        folder_models = config["folders"]["activity_prediction_models"]
        list_models = [int(a) for a in os.listdir(folder_models)]
        all_models = pd.Series(list_models)
        df_models = pd.DataFrame(columns=["idactivity"])
        df_models["idactivity"] = all_models
        merged = activities.merge(df_models, on="idactivity")[["idactivity", "name"]]
        merged.rename(columns={"idactivity": "value", "name": "label"}, inplace=True)
        merged = merged.sort_values(by=["label"])
        return json.loads(merged.to_json(orient="records"))