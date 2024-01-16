"""Transforms data module"""
from sklearn.decomposition import PCA, KernelPCA
from sklearn.preprocessing import (
    MaxAbsScaler,
    MinMaxScaler,
    QuantileTransformer,
    RobustScaler,
    StandardScaler,
)
from sklearn.manifold import TSNE
from joblib import dump
class Transformer:
    """Transformer class"""

    def apply_tsne_data(self, dataset, n_components = 2):
        """Apply tsne"""
        pca_transformer = TSNE(n_components=n_components)
        return pca_transformer.fit_transform(dataset)
    
    def apply_pca_data(self, dataset, n_components = None):
        """Apply PCA"""
        if n_components == None:
            pca_transformer = PCA()
        else:
            pca_transformer = PCA(n_components=n_components)
        pca_transformer.fit(dataset)
        return pca_transformer.transform(dataset), pca_transformer

    def apply_kernel_pca(self, dataset, kernel, n_components = None):
        """Apply kernel PCA"""
        if n_components == None:
            pca_transformer = KernelPCA(kernel=kernel)
        else:
            pca_transformer = KernelPCA(kernel=kernel, n_components=n_components)
        pca_transformer.fit(dataset)
        return pca_transformer.transform(dataset), pca_transformer

    def apply_scaler(self, dataset, scaler):
        if scaler == "min_max":
            scaler = MinMaxScaler()
        elif scaler == "standard":
            scaler = StandardScaler()
        elif scaler == "max_absolute":
            scaler = MaxAbsScaler()
        elif scaler == "robust":
            scaler = RobustScaler()
        elif scaler == "quantile":
            scaler = QuantileTransformer()
        scaler.fit(dataset)
        return scaler.transform(dataset), scaler