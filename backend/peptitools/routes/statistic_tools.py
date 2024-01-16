"""Statistic tools routes"""
from flask import Blueprint, request
from peptitools.modules.statistic_tools.frequency_analysis import FrequencyAnalysis
from peptitools.modules.statistic_tools.physicochemical_module import PhysicochemicalProperties
from peptitools.modules.utils import parse_request, parse_response, check_pvalue
import json
statistic_tools_blueprint = Blueprint("statistic_tools_blueprint", __name__)


@statistic_tools_blueprint.route("/frequency/", methods=["POST"])
def apply_frequency():
    """Frequency module api"""
    check = check_pvalue(json.loads(request.form["options"])["pvalue"])
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    
    check = parse_request(request, "frequency", True, "csv")
    if check["status"] == "error":
        return parse_response(check, status_code=400)

    phy = FrequencyAnalysis(check["path"], json.loads(request.form["options"]))
    result = phy.run_process()
    return parse_response({"result": result}, status_code=200)
    

@statistic_tools_blueprint.route("/physicochemical/", methods=["POST"])
def apply_physicochemical():
    """Physicochemical characterization module api"""

    check = check_pvalue(json.loads(request.form["options"])["pvalue"])
    if check["status"] == "error":
        return parse_response(check, status_code=400)

    check = parse_request(request, "physicochemical", True, "csv")
    if check["status"] == "error":
        return parse_response(check, status_code=400)

    phy = PhysicochemicalProperties(check["path"], json.loads(request.form["options"]))
    result = phy.run_process()
    return parse_response({"result": result}, status_code=200)
    