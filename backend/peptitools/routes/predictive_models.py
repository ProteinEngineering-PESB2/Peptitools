"""Machine learning routes"""
from flask import Blueprint, request
from peptitools.modules.machine_learning_tools.training_supervised_learning.predict import Predict
from peptitools.modules.utils import parse_request, parse_response
import json
from peptitools.modules.predictive_models.predictive_models import PredictiveModels

predictive_models_blueprint = Blueprint("predictive_models_blueprint", __name__, url_prefix="/predict/")

@predictive_models_blueprint.route("/activity/", methods=["POST"])
def api_evaluate_model():
    """It performs a Supervised learning from a csv file"""
    pm = PredictiveModels()
    check = parse_request(request, "models", False, "csv")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    response = pm.predict(request.form["data"], json.loads(request.form["options"]))
    pm.cleanup()
    return parse_response(response, status_code=200)


@predictive_models_blueprint.route("/get_activities/", methods=["GET"])
def api_get_activities():
    """It performs a Supervised learning from a csv file"""
    pm = PredictiveModels()
    pm.get_activities_list()
    return parse_response(pm.get_activities_list(), status_code=200)
