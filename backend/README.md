# Pepti-tools backend
## Install


### Install apt requirements

```
sudo apt install metastudent gzip make gcc g++ git
```

### Create conda environment
```
conda create -n peptitools_backend python=3.9
conda activate peptitools_backend
```

### Install python requirements
```
pip install -r requirements.txt
```
### Install conda requirements
```
conda install bioconda/label/cf201901::pfam_scan
```
### Download databases
```
mkdir install_requisites
cd ./install_requisites
wget https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz
wget https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.dat.gz
wget https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/active_site.dat.gz
gzip -d Pfam-A.hmm.gz
gzip -d Pfam-A.hmm.dat.gz
gzip -d active_site.dat.gz
hmmpress Pfam-A.hmm
```
### Download predict property
```
git clone https://github.com/realbigws/Predict_Property
```
### Set paths
```
export PATH="${pwd}/install_requisites/Predict_Property:${PATH}"
export PFAM_DB="${pwd}/files/pfam_db"
export PYTHONPATH=.
```
## Usage
```
python peptipedia/main.py
```
