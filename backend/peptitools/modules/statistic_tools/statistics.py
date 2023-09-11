from scipy.stats import kruskal
from statsmodels.stats.multicomp import pairwise_tukeyhsd
import pandas as pd

aa_one_to_tree = {
    "A":"Ala","R":"Arg","N": "Asn","D": "Asp","C": "Cys",
    "E": "Glu","Q": "Gln","G": "Gly","H": "His","I": "Ile",
    "L": "Leu","K": "Lys","M": "Met","F": "Phe","P": "Pro",
    "S": "Ser","T": "Thr","W": "Trp","Y": "Tyr","V": "Val"
}
def apply_kruskal(df, alpha):
    result = []
    for column in df.drop(columns=["id", "target"]).columns:
        samples = []
        for a in df.target.unique():
            samples.append(df[df.target == a][column].to_list())
        res = kruskal(*samples)
        if res.pvalue < alpha:
            result.append({"columns": column,
                            "p_value": res.pvalue.round(5),
                            "statistic": res.statistic.round(5),
                            "H1": "Accept"})
        else:
            result.append({"columns": column,
                           "p_value": res.pvalue.round(5),
                           "statistic": res.statistic.round(5),
                           "H1": "Reject"})
    df_result = pd.DataFrame(result)
    columns = ["Residue", "P value", "Satistic", "H1"]
    data = df_result.values.tolist()
    return {"columns": columns, "data": data}

def apply_tukey(kruskal, df, alpha):
    accepted_data = [a[0] for a in kruskal["data"] if a[3] == "Accept"]
    result = []
    for column in accepted_data:
        tukey = pairwise_tukeyhsd(endog=df[column],
                        groups=df["target"],
                        alpha=alpha)
        summary = str(tukey.summary())
        summary = [a.split() for a in summary.splitlines()[4:-1]]
        a = pd.DataFrame(data = summary,
                columns=["Group 1", "Group 2", "Mean difference", "P value", "IC Lower", "IC Upper", "H1"])
        a["Target"] = column
        result.append(a)
    result = pd.concat(result)
    result = result[["Target", "Group 1", "Group 2", "Mean difference", "P value", "H1"]]
    result = result.replace("True", "Accept")
    result = result.replace("False", "Reject")
    columns = result.columns.tolist()
    data = result.values.tolist()
    return {"columns": columns, "data": data}

def distribution(df):
    df = df.rename(columns = aa_one_to_tree)
    response = {}
    targets_list = df.drop(columns = ["target", "id"]).columns.tolist()
    for target in targets_list:
        response[target] = {"x": df["target"].tolist(), "y": df[target].values.tolist()}
    response["targets"] = targets_list
    return response