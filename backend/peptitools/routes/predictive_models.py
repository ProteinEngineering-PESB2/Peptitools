"""Model using routes"""
import configparser

from flask import Blueprint, request
import json
from peptitools.modules.predictive_models.activity_prediction import ActivityPrediction
from peptitools.modules.predictive_models.activity_list import ActivityList
from peptitools.modules.utils import parse_response

config = configparser.ConfigParser()
config.read("config.ini")
models_blueprint = Blueprint("models_blueprint", __name__)

@models_blueprint.route("/activity_prediction/", methods=["POST"])
def apply_activity_prediction():
    """Encode a fasta file or text"""
    check = parse_response(request, config, "activity_prediction", False, "csv")
    if check["status"] == "error":
        return check
    pred = ActivityPrediction(check["path"], config, json.loads(request.form["options"]))
    result = pred.run_process()
    return {"result": result, "status": "success"}


@models_blueprint.route("/activity_models_list/", methods=["GET"])
def apply_activity_models_list():
    """List all activities with predictive model"""
    act_list = ActivityList()
    return act_list.get_activity_list(config)
