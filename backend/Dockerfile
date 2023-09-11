FROM continuumio/miniconda3

#Instalación de programas y librerías necesarias
RUN apt-get update && \
    apt-get -y install --no-install-recommends\
    metastudent \
    wget gzip make gcc g++ python-dev\
    git && rm -rf /var/lib/apt/lists/*

#Conda
RUN conda create --name peptitools python=3.7
RUN echo "conda activate peptitools" >> ~/.bashrc
SHELL ["/bin/bash", "--login", "-c"]
RUN conda install -c bioconda pfam_scan
RUN conda install -c bioconda clustalo
#bioembeddings
RUN conda install -c conda-forge bio-embeddings
RUN conda install -c conda-forge bio-embeddings-plus
RUN conda install -c conda-forge bio-embeddings-bepler

WORKDIR /
# Instalación de dependencia
COPY requirements.txt .
RUN pip install -r requirements.txt
WORKDIR /app/install_requisites
RUN git clone https://github.com/realbigws/Predict_Property
ENV PATH="/app/install_requisites/Predict_Property:${PATH}"
WORKDIR /
COPY files ../files
WORKDIR /files/pfam_db

#PFAM database
RUN wget https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz
RUN wget https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.dat.gz
RUN wget https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/active_site.dat.gz
RUN gzip -d Pfam-A.hmm.gz
RUN gzip -d Pfam-A.hmm.dat.gz
RUN gzip -d active_site.dat.gz
RUN hmmpress Pfam-A.hmm

WORKDIR /app
ENV PYTHONPATH=.
ENV PFAM_DB=/files/pfam_db

# Auto remove trash files (1 day)
WORKDIR /temp_files
RUN find /temp_files -mtime +1 -delete
WORKDIR /files/results
RUN find /files/results/ -mtime +1 -delete


WORKDIR /app
#Ejecución de la api
ENTRYPOINT ["conda", "run", "--no-capture-output", "-n", "peptitools", "python", "/app/peptitools/main.py"]
