"""Machine learning routes"""
from flask import Blueprint, request
from peptitools.modules.machine_learning_tools.training_supervised_learning.predict import Predict
from peptitools.modules.utils import parse_request, parse_response
import json

predictive_models_blueprint = Blueprint("predictive_models_blueprint", __name__, url_prefix="/predict/")


@predictive_models_blueprint.route("/activity/", methods=["POST"])
def api_evaluate_model():
    """It performs a Supervised learning from a csv file"""
    check = parse_request(request, "models", False, "csv")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    return parse_response({"result": "hola"}, status_code=200)