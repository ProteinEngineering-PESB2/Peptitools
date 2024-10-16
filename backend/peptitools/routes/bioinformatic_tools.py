"""Bioinformatic tools routes"""
from flask import Blueprint, request
from peptitools.modules.bioinformatic_tools.gene_ontology import GeneOntology
from peptitools.modules.bioinformatic_tools.msa import MultipleSequenceAlignment
from peptitools.modules.bioinformatic_tools.structural_characterization import StructuralCharacterization
from peptitools.modules.bioinformatic_tools.pfam_domain import Pfam
from peptitools.modules.utils import parse_request, parse_response

bioinfo_tools_blueprint = Blueprint("bioinfo_tools_blueprint", __name__)

@bioinfo_tools_blueprint.route("/msa/", methods=["POST"])
def apply_msa():
    """Multiple sequence alignment route"""
    check = parse_request(request, "msa", False, "fasta")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    msa = MultipleSequenceAlignment(check["path"])
    result = msa.run_process()
    return parse_response({"result": result}, status_code=200)

@bioinfo_tools_blueprint.route("/pfam/", methods=["POST"])
def apply_pfam():
    """Pfam route"""
    check = parse_request(request, "pfam", False, "fasta")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    pfam = Pfam(check["path"])
    result = pfam.run_process()
    if result["status"] == "warning":
        return parse_response(result, status_code=404)
    return parse_response(result, status_code=200)

@bioinfo_tools_blueprint.route("/gene_ontology/", methods=["POST"])
def apply_gene_ontology():
    """Gene ontology route"""
    print("hola")
    check = parse_request(request, "gene_ontology", False, "fasta")
    if check["status"] == "error":
        print(check)
        return parse_response(check, status_code=400)
    go = GeneOntology(check["path"])
    result = go.run_process()
    if result["status"] == "warning":
        return parse_response(result, status_code=404)
    return parse_response(result, status_code=200)

@bioinfo_tools_blueprint.route("/structural_prediction/", methods=["POST"])
def apply_structural_analysis():
    """Structural analysis route"""
    check = parse_request(request, "secondary_structure", False, "fasta")
    if check["status"] == "error":
        return parse_response(check, status_code=400)
    struct = StructuralCharacterization(check["path"])
    result = struct.run_process()
    if result["status"] == "warning":
        return parse_response(result, status_code=404)
    return parse_response( result, status_code=200)