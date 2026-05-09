# -*- coding: utf-8 -*-
"""
Flask API Sunucusu
Yapay Zeka Dersi - Veri Madenciligi Projesi
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify, request, send_from_directory
import json

from preprocessing import (
    load_data, get_basic_info, get_descriptive_stats,
    get_correlation_matrix, get_class_distribution,
    get_histogram_data, get_outlier_info, get_normalized_data,
    prepare_features, get_feature_columns
)
from classification import run_all_algorithms, run_single_algorithm, get_decision_tree_rules, predict_new
from clustering import run_all_clustering
from social_network import run_full_analysis

app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Veri setini sunucu baslarken yukle
print("[*] Veri seti yukleniyor...")
df = load_data()
X, y, feature_cols = prepare_features(df)
print(f"[+] Veri seti yuklendi: {df.shape[0]} satir, {df.shape[1]} sutun")

# Analiz cache
_cache = {}


def cached(key, fn):
    if key not in _cache:
        _cache[key] = fn()
    return _cache[key]


# ===================== STATIK DOSYALAR =====================
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')


# ===================== VERI ON ISLEME =====================
@app.route('/api/info')
def api_info():
    data = get_basic_info(df)
    dist = get_class_distribution(df)
    data['class_distribution'] = dist
    return jsonify(data)


@app.route('/api/stats')
def api_stats():
    stats = cached('stats', lambda: get_descriptive_stats(df))
    return jsonify(stats)


@app.route('/api/correlation')
def api_correlation():
    corr = cached('corr', lambda: get_correlation_matrix(df))
    return jsonify(corr)


@app.route('/api/histogram/<column>')
def api_histogram(column):
    if column not in df.columns:
        return jsonify({"error": "Sutun bulunamadi"}), 404
    data = get_histogram_data(df, column)
    return jsonify(data)


@app.route('/api/outliers')
def api_outliers():
    outliers = cached('outliers', lambda: get_outlier_info(df))
    return jsonify(outliers)


@app.route('/api/normalization')
def api_normalization():
    method = request.args.get('method', 'minmax')
    data = get_normalized_data(df, method)
    return jsonify(data)


@app.route('/api/columns')
def api_columns():
    feature_cols_list = get_feature_columns()
    return jsonify({
        "features": feature_cols_list,
        "target": "Performance_Class",
        "target_label": "Performance_Label",
        "all_columns": list(df.columns)
    })


# ===================== SINIFLANDIRMA =====================
@app.route('/api/classification/all')
def api_classification_all():
    results = cached('classification_all', lambda: run_all_algorithms(X, y))
    return jsonify(results)


@app.route('/api/classification/<algo>')
def api_classification_single(algo):
    valid = ['decision_tree', 'naive_bayes', 'knn', 'svm', 'ann']
    if algo not in valid:
        return jsonify({"error": f"Gecersiz algoritma. Gecerli: {valid}"}), 400
    result = run_single_algorithm(X, y, algo)
    return jsonify(result)


@app.route('/api/classification/tree/rules')
def api_tree_rules():
    result = get_decision_tree_rules(X, y, feature_cols)
    return jsonify(result)


# ===================== DEMETLEME =====================
@app.route('/api/clustering/all')
def api_clustering_all():
    results = cached('clustering_all', lambda: run_all_clustering(X))
    return jsonify(results)


@app.route('/api/clustering/elbow')
def api_elbow():
    from clustering import run_kmeans_elbow
    result = cached('elbow', lambda: run_kmeans_elbow(X))
    return jsonify(result)


@app.route('/api/clustering/kmeans')
def api_kmeans():
    k = int(request.args.get('k', 3))
    from clustering import run_kmeans
    result = run_kmeans(X, k=k)
    return jsonify(result)


@app.route('/api/clustering/hierarchical')
def api_hierarchical():
    k = int(request.args.get('k', 3))
    linkage = request.args.get('linkage', 'ward')
    from clustering import run_hierarchical
    result = run_hierarchical(X, n_clusters=k, linkage_method=linkage)
    return jsonify(result)


@app.route('/api/clustering/dbscan')
def api_dbscan():
    eps = float(request.args.get('eps', 0.35))
    min_samples = int(request.args.get('min_samples', 5))
    from clustering import run_dbscan
    result = run_dbscan(X, eps=eps, min_samples=min_samples)
    return jsonify(result)


# ===================== SOSYAL AG =====================
@app.route('/api/network')
def api_network():
    threshold = float(request.args.get('threshold', 0.4))
    cache_key = f'network_{threshold}'
    result = cached(cache_key, lambda: run_full_analysis(df, feature_cols, threshold))
    return jsonify(result)


@app.route('/api/predict', methods=['POST'])
def api_predict():
    """Kullanicinin girdigi degerlerle canli tahmin."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON verisi bekleniyor"}), 400

    feature_cols = get_feature_columns()
    try:
        raw_values = [float(data.get(col, 0)) for col in feature_cols]
    except Exception as e:
        return jsonify({"error": f"Gecersiz deger: {e}"}), 400

    # Min-max normalize et (training data ile ayni scaler)
    from sklearn.preprocessing import MinMaxScaler
    import numpy as np
    X_full = df[feature_cols].values
    scaler = MinMaxScaler()
    scaler.fit(X_full)
    X_input_scaled = scaler.transform([raw_values])[0]

    result = predict_new(X, y, X_input_scaled)
    return jsonify(result)


@app.route('/api/feature_ranges')
def api_feature_ranges():
    """Her ozelligin min/max/ortalama degerlerini dondur (form icin)."""
    feature_cols = get_feature_columns()
    ranges = {}
    for col in feature_cols:
        ranges[col] = {
            "min":  round(float(df[col].min()), 2),
            "max":  round(float(df[col].max()), 2),
            "mean": round(float(df[col].mean()), 2),
            "step": 0.1 if df[col].dtype == float else 1
        }
    return jsonify(ranges)


@app.route('/api/feature_importance')
def api_feature_importance():
    """Karar Agaci ve Random Forest ile ozellik onemi."""
    def compute():
        from sklearn.tree import DecisionTreeClassifier
        from sklearn.ensemble import RandomForestClassifier
        import numpy as np

        feat_cols = get_feature_columns()

        # Karar Agaci
        dt = DecisionTreeClassifier(criterion='entropy', max_depth=8, random_state=42)
        dt.fit(X, y)
        dt_imp = dt.feature_importances_

        # Random Forest (daha saglikli onem tahmini)
        rf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
        rf.fit(X, y)
        rf_imp = rf.feature_importances_

        # Sirala (RF'e gore)
        order = np.argsort(rf_imp)[::-1]

        return {
            "features": [feat_cols[i].replace('_', ' ') for i in order],
            "features_raw": [feat_cols[i] for i in order],
            "decision_tree": [round(float(dt_imp[i]) * 100, 2) for i in order],
            "random_forest": [round(float(rf_imp[i]) * 100, 2) for i in order],
            "top_feature": feat_cols[order[0]].replace('_', ' '),
            "top_feature_pct": round(float(rf_imp[order[0]]) * 100, 1)
        }

    result = cached('feature_importance', compute)
    return jsonify(result)


@app.route('/api/cluster_profiles')
def api_cluster_profiles():
    """Her kume icin ozellik ortalamalarini dondur (radar chart icin)."""
    def compute():
        from sklearn.cluster import KMeans
        from sklearn.preprocessing import MinMaxScaler
        import numpy as np
        feat_cols = get_feature_columns()
        scaler = MinMaxScaler()
        X_scaled = scaler.fit_transform(df[feat_cols].values)
        km = KMeans(n_clusters=3, random_state=42, n_init=10)
        labels = km.fit_predict(X_scaled)
        profiles = []
        for k in range(3):
            mask = labels == k
            means = X_scaled[mask].mean(axis=0)
            raw_means = df[feat_cols].values[mask].mean(axis=0)
            profiles.append({
                "cluster": int(k),
                "size": int(mask.sum()),
                "normalized": [round(float(v), 3) for v in means],
                "raw": {feat_cols[i]: round(float(raw_means[i]), 2) for i in range(len(feat_cols))}
            })
        return {"features": feat_cols, "profiles": profiles}
    return jsonify(cached('cluster_profiles', compute))


@app.route('/api/summary')
def api_summary():
    """Tum analizlerin ozet bulgulari."""
    def compute():
        from sklearn.ensemble import RandomForestClassifier
        import numpy as np
        feat_cols = get_feature_columns()

        # En iyi algoritma
        cls_all = run_all_algorithms(X, y)
        best = cls_all['comparison'][0]

        # Ozellik onemi
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(X, y)
        fi = rf.feature_importances_
        top_idx = int(np.argmax(fi))

        # Sinif dagilimi
        dist = get_class_distribution(df)

        return {
            "best_algorithm": best['algorithm'],
            "best_accuracy": best['accuracy'],
            "best_f1": best['f1'],
            "best_cv": best['cv_mean'],
            "top_feature": feat_cols[top_idx].replace('_', ' '),
            "top_feature_raw": feat_cols[top_idx],
            "top_feature_pct": round(float(fi[top_idx]) * 100, 1),
            "total_rows": int(len(df)),
            "total_features": int(len(feat_cols)),
            "class_distribution": dist,
            "missing_values": 0,
            "algorithm_ranking": cls_all['comparison']
        }
    return jsonify(cached('summary', compute))


@app.route('/api/data')
def api_data():
    """Ham veriyi sayfali dondur, filtre destegi ile."""
    page     = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    col      = request.args.get('col', '')
    min_v    = request.args.get('min', None)
    max_v    = request.args.get('max', None)
    search   = request.args.get('search', '').strip()

    filtered = df.copy()
    if col and col in df.columns:
        if min_v: filtered = filtered[filtered[col] >= float(min_v)]
        if max_v: filtered = filtered[filtered[col] <= float(max_v)]

    total = len(filtered)
    start = (page - 1) * per_page
    end   = start + per_page
    page_df = filtered.iloc[start:end]

    return jsonify({
        "columns": list(df.columns),
        "rows": page_df.values.tolist(),
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page
    })


if __name__ == '__main__':
    print("[*] Flask sunucusu baslatiliyor: http://127.0.0.1:5000")
    app.run(debug=True, port=5000, use_reloader=False)

