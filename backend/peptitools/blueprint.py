"""Api Blueprints"""
from flask import Blueprint

from peptitools.routes.bioinformatic_tools import bioinfo_tools_blueprint
from peptitools.routes.machine_learning_tools import machine_learning_blueprint
from peptitools.routes.statistic_tools import statistic_tools_blueprint
from peptitools.routes.tools import tools_blueprint

api_blueprint = Blueprint("api", __name__)

api_blueprint.register_blueprint(bioinfo_tools_blueprint)
api_blueprint.register_blueprint(statistic_tools_blueprint)
api_blueprint.register_blueprint(machine_learning_blueprint)
api_blueprint.register_blueprint(tools_blueprint)
