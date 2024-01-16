"""Machine learning routes"""
from flask import Blueprint, request
from peptitools.modules.machine_learning_tools.clustering_methods.alignment_clustering import AlignmentClustering
from peptitools.modules.machine_learning_tools.clustering_methods.clustering_process import Clustering
from peptitools.modules.machine_learning_tools.clustering_methods.distance_clustering import DistanceClustering
from peptitools.modules.machine_learning_tools.numerical_representation.run_encoding import Encoding
from peptitools.modules.machine_learning_tools.training_supervised_learning.supervised_learning import SupervisedLearning
from peptitools.modules.utils import parse_request, parse_response
import json

machine_learning_blueprint = Blueprint("machine_learning_blueprint", __name__)


@machine_learning_blueprint.route("/encoding/", methods=["POST"])
def apply_encoding():
    """Encode a fasta file or text"""
    check = parse_request(request, "encoding", False, "csv")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    enc = Encoding(check["path"], json.loads(request.form["options"]))
    result = enc.run_encoding()
    return parse_response({"result": result}, status_code=200)

@machine_learning_blueprint.route("/clustering/", methods=["POST"])
def api_clustering():
    """It performs clustering from a fasta file or text"""
    check = parse_request(request, "clustering", False, "csv")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    clust = Clustering(check["path"], json.loads(request.form["options"]))
    result = clust.run_process()
    return parse_response({"result": result}, status_code=200)

@machine_learning_blueprint.route("/alignment_clustering/", methods=["POST"])
def api_alignment_clustering():
    """It performs clustering from a fasta file or text"""
    check = parse_request(request, "clustering", False, "fasta")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    clust = AlignmentClustering(check["path"])
    result = clust.run_clustering()
    return parse_response({"result": result}, status_code=200)

@machine_learning_blueprint.route("/distance_clustering/", methods=["POST"])
def api_distance_clustering():
    """It performs clustering from a fasta file or text"""
    check = parse_request(request, "clustering", False, "csv")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    clust = DistanceClustering(check["path"], json.loads(request.form["options"]))
    result = clust.run_clustering()
    return parse_response({"result": result}, status_code=200)

@machine_learning_blueprint.route("/supervised_learning/", methods=["POST"])
def api_supervised_learning():
    """It performs a Supervised learning from a csv file"""
    check = parse_request(request, "supervised_learning", True, "csv", task = json.loads(request.form["options"])["task"])
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    sl = SupervisedLearning(check["path"], json.loads(request.form["options"]))
    result = sl.run_process()
    return parse_response({"result": result}, status_code=200)