"""Machine learning routes"""
import configparser

from flask import Blueprint, request

from peptitools.modules.machine_learning_tools.clustering_methods.alignment_clustering import AlignmentClustering
from peptitools.modules.machine_learning_tools.clustering_methods.clustering_process import Clustering
from peptitools.modules.machine_learning_tools.clustering_methods.distance_clustering import DistanceClustering
from peptitools.modules.machine_learning_tools.numerical_representation.run_encoding import Encoding

from peptitools.modules.machine_learning_tools.transformer.tsne_process import TSNE
from peptitools.modules.machine_learning_tools.training_supervised_learning.supervised_learning import SupervisedLearning
from peptitools.modules.utils import parse_response
import json

##Reads config file and asign folder names.
config = configparser.ConfigParser()
config.read("config.ini")


machine_learning_blueprint = Blueprint("machine_learning_blueprint", __name__)


@machine_learning_blueprint.route("/encoding/", methods=["POST"])
def apply_encoding():
    """Encode a fasta file or text"""
    check = parse_response(request, config, "encoding", False, "csv")
    if check["status"] == "error":
        return check
    enc = Encoding(check["path"], config, json.loads(request.form["options"]))
    result = enc.run_encoding()
    return {"result": result, "status": "success"}

@machine_learning_blueprint.route("/clustering/", methods=["POST"])
def api_clustering():
    """It performs clustering from a fasta file or text"""
    check = parse_response(request, config, "clustering", False, "csv")
    if check["status"] == "error":
        return check
    clust = Clustering(check["path"], config, json.loads(request.form["options"]))
    result = clust.run_process()
    return {"result": result, "status": "success"}

@machine_learning_blueprint.route("/alignment_clustering/", methods=["POST"])
def api_alignment_clustering():
    """It performs clustering from a fasta file or text"""
    check = parse_response(request, config, "clustering", False, "fasta")
    if check["status"] == "error":
        return check
    clust = AlignmentClustering(check["path"], config)
    result = clust.run_clustering()
    return {"result": result, "status": "success"}

@machine_learning_blueprint.route("/distance_clustering/", methods=["POST"])
def api_distance_clustering():
    """It performs clustering from a fasta file or text"""
    check = parse_response(request, config, "clustering", False, "csv")
    if check["status"] == "error":
        return check
    clust = DistanceClustering(check["path"], config, json.loads(request.form["options"]))
    result = clust.run_clustering()
    return {"result": result, "status": "success"}

@machine_learning_blueprint.route("/supervised_learning/", methods=["POST"])
def api_supervised_learning():
    """It performs a Supervised learning from a csv file"""
    check = parse_response(request, config, "supervised_learning", True, "csv", task = json.loads(request.form["options"])["task"])
    if check["status"] == "error":
        return check
    sl = SupervisedLearning(check["path"], config, json.loads(request.form["options"]))
    result = sl.run_process()
    return {"result": result, "status": "success"}
