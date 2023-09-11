"""Statistic tools routes"""
import configparser

from flask import Blueprint, request

from peptitools.modules.statistic_tools.frequency_analysis import FrequencyAnalysis
from peptitools.modules.statistic_tools.physicochemical_module import PhysicochemicalProperties
from peptitools.modules.utils import Interface
from peptitools.modules.utils import parse_response
import json
##Reads config file and asign folder names.
config = configparser.ConfigParser()
config.read("config.ini")

statistic_tools_blueprint = Blueprint("statistic_tools_blueprint", __name__)


@statistic_tools_blueprint.route("/frequency/", methods=["POST"])
def apply_frequency():
    """Frequency module api"""
    check = parse_response(request, config, "frequency", True, "csv")
    if check["status"] == "error":
        return check
    phy = FrequencyAnalysis(check["path"], json.loads(request.form["options"]))
    result = phy.run_process()
    return {"status": "success", "result": result}
    

@statistic_tools_blueprint.route("/physicochemical/", methods=["POST"])
def apply_physicochemical():
    """Physicochemical characterization module api"""
    check = parse_response(request, config, "physicochemical", True, "csv")
    if check["status"] == "error":
        return check
    phy = PhysicochemicalProperties(check["path"], config, json.loads(request.form["options"]))
    result = phy.run_process()
    return {"status": "success", "result": result}
    