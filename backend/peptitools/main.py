"""main module"""

import os

from flask import Flask
from flask_cors import CORS

import peptitools.config as config
from peptitools.blueprint import api_blueprint
from peptitools.modules.utils import create_config_folders

create_config_folders()

app = Flask(__name__, static_folder=os.path.realpath(config.static_folder))
# Cors
CORS(app)

app.register_blueprint(api_blueprint, url_prefix="/api")
if __name__ == "__main__":
    app.run(debug=True, host=config.host, port=config.port)
