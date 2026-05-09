# -*- coding: utf-8 -*-
"""
Demetleme (Clustering) Modulu
Hafta 6-7 - Veri Madenciligi Dersi
Algoritmalar: K-Means, Hiyerarsik (AGNES), DBSCAN
"""

import numpy as np
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score, silhouette_samples
from sklearn.preprocessing import MinMaxScaler
from scipy.cluster.hierarchy import dendrogram, linkage
import warnings
warnings.filterwarnings('ignore')


def run_kmeans_elbow(X, k_range=range(2, 11)):
    """K-Means Elbow Yontemi — SSE hesaplama (Hafta 6)."""
    sse_values = []
    silhouette_values = []

    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(X)
        sse_values.append(round(float(km.inertia_), 2))
        if k >= 2:
            sil = round(float(silhouette_score(X, labels)), 4)
            silhouette_values.append(sil)
        else:
            silhouette_values.append(None)

    return {
        "k_values":          list(k_range),
        "sse_values":        sse_values,
        "silhouette_values": silhouette_values,
        "optimal_k_silhouette": int(list(k_range)[silhouette_values.index(max(silhouette_values))])
    }


def run_kmeans(X, k=3):
    """K-Means demetleme (Hafta 6)."""
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X)
    sil_score = round(float(silhouette_score(X, labels)), 4)
    sil_samples = silhouette_samples(X, labels)

    # Demet istatistikleri
    cluster_stats = []
    for c in range(k):
        mask = labels == c
        cluster_stats.append({
            "cluster": int(c),
            "size": int(mask.sum()),
            "silhouette_avg": round(float(sil_samples[mask].mean()), 4)
        })

    # 2D icin PCA projeksiyonu
    from sklearn.decomposition import PCA
    pca = PCA(n_components=2, random_state=42)
    X_2d = pca.fit_transform(X)

    scatter_data = []
    for i in range(len(X_2d)):
        scatter_data.append({
            "x": round(float(X_2d[i, 0]), 4),
            "y": round(float(X_2d[i, 1]), 4),
            "cluster": int(labels[i])
        })

    return {
        "k": k,
        "sse": round(float(km.inertia_), 2),
        "silhouette_score": sil_score,
        "cluster_stats": cluster_stats,
        "scatter_pca": scatter_data[:500],  # Performans icin 500 nokta
        "inertia": round(float(km.inertia_), 2)
    }


def run_hierarchical(X, n_clusters=3, linkage_method='ward'):
    """Hiyerarsik (AGNES) demetleme (Hafta 6)."""
    agg = AgglomerativeClustering(n_clusters=n_clusters, linkage=linkage_method)
    labels = agg.fit_predict(X)

    sil_score = round(float(silhouette_score(X, labels)), 4)

    # Demet boyutlari
    unique, counts = np.unique(labels, return_counts=True)
    cluster_sizes = [{"cluster": int(u), "size": int(c)} for u, c in zip(unique, counts)]

    # Dendogram verisi (scipy ile kucuk ornek uzerinde)
    sample_size = min(100, len(X))
    idx = np.random.choice(len(X), sample_size, replace=False)
    X_sample = X[idx]
    Z = linkage(X_sample, method=linkage_method)

    # Dendogram veri yapisi
    dendro_data = []
    for row in Z[:30]:  # Ilk 30 birlestirme
        dendro_data.append({
            "cluster1": int(row[0]),
            "cluster2": int(row[1]),
            "distance": round(float(row[2]), 4),
            "count":    int(row[3])
        })

    return {
        "n_clusters":      n_clusters,
        "linkage_method":  linkage_method,
        "silhouette_score": sil_score,
        "cluster_sizes":   cluster_sizes,
        "dendrogram_data": dendro_data
    }


def run_dbscan(X, eps=0.3, min_samples=5):
    """DBSCAN yogunluk tabanli demetleme (Hafta 6)."""
    db = DBSCAN(eps=eps, min_samples=min_samples)
    labels = db.fit_predict(X)

    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise    = int((labels == -1).sum())

    sil_score = None
    if n_clusters >= 2:
        mask = labels != -1
        if mask.sum() > 0:
            sil_score = round(float(silhouette_score(X[mask], labels[mask])), 4)

    unique, counts = np.unique(labels, return_counts=True)
    cluster_sizes = []
    for u, c in zip(unique, counts):
        name = f"Cluster {int(u)}" if u != -1 else "Gurultu (Noise)"
        cluster_sizes.append({"cluster": name, "size": int(c)})

    # PCA projeksiyonu
    from sklearn.decomposition import PCA
    pca = PCA(n_components=2, random_state=42)
    X_2d = pca.fit_transform(X)
    scatter_data = []
    for i in range(min(500, len(X_2d))):
        scatter_data.append({
            "x": round(float(X_2d[i, 0]), 4),
            "y": round(float(X_2d[i, 1]), 4),
            "cluster": int(labels[i])
        })

    return {
        "eps": eps,
        "min_samples": min_samples,
        "n_clusters": n_clusters,
        "n_noise": n_noise,
        "silhouette_score": sil_score,
        "cluster_sizes": cluster_sizes,
        "scatter_pca": scatter_data
    }


def run_all_clustering(X):
    """Tum demetleme algoritmalarini calistir."""
    elbow = run_kmeans_elbow(X)
    optimal_k = elbow["optimal_k_silhouette"]

    kmeans   = run_kmeans(X, k=optimal_k)
    agnes    = run_hierarchical(X, n_clusters=optimal_k)
    db       = run_dbscan(X, eps=0.35, min_samples=5)

    return {
        "elbow":       elbow,
        "kmeans":      kmeans,
        "hierarchical": agnes,
        "dbscan":      db,
        "optimal_k":   optimal_k
    }
