# -*- coding: utf-8 -*-
"""
Siniflandirma Modulu - 8 Algoritma
Hafta 4-5 - Veri Madenciligi Dersi
Metrikler: Hata Orani, Kesinlik, Anma, F-Olcutu, ROC/AUC, Accuracy, CV
"""

import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import AdaBoostClassifier, RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import cross_val_score, train_test_split, StratifiedKFold
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_curve, auc
)
from sklearn.preprocessing import label_binarize
import warnings
warnings.filterwarnings('ignore')


ALGORITHMS = {
    "id3": {
        "name": "Karar Ağacı — ID3 (Entropy, Derinlik Sınırsız)",
        "name_tr": "Karar Ağacı ID3",
        "kisa": "ID3",
        "hafta": "Hafta 4",
        "clf": DecisionTreeClassifier(criterion='entropy', random_state=42)
    },
    "c45": {
        "name": "Karar Ağacı — C4.5 (Entropy + Budama)",
        "name_tr": "Karar Ağacı C4.5",
        "kisa": "C4.5",
        "hafta": "Hafta 4",
        "clf": DecisionTreeClassifier(criterion='entropy', max_depth=8, min_samples_leaf=5, random_state=42)
    },
    "cart": {
        "name": "Karar Ağacı — CART (Gini İndeksi)",
        "name_tr": "Karar Ağacı CART",
        "kisa": "CART",
        "hafta": "Hafta 4",
        "clf": DecisionTreeClassifier(criterion='gini', max_depth=8, random_state=42)
    },
    "naive_bayes": {
        "name": "Saf Bayes Sınıflandırıcı (Naive Bayes)",
        "name_tr": "Saf Bayes (Naive Bayes)",
        "kisa": "Naive Bayes",
        "hafta": "Hafta 4",
        "clf": GaussianNB()
    },
    "knn": {
        "name": "k-En Yakın Komşu (kNN, k=7)",
        "name_tr": "k-En Yakın Komşu (kNN)",
        "kisa": "kNN",
        "hafta": "Hafta 5",
        "clf": KNeighborsClassifier(n_neighbors=7, weights='distance')
    },
    "svm": {
        "name": "Destek Vektör Makineleri (SVM, RBF Kernel)",
        "name_tr": "Destek Vektör Makineleri (SVM)",
        "kisa": "SVM",
        "hafta": "Hafta 5",
        "clf": SVC(kernel='rbf', probability=True, random_state=42)
    },
    "ann": {
        "name": "Yapay Sinir Ağı (YSA / MLP)",
        "name_tr": "Yapay Sinir Ağı (YSA)",
        "kisa": "YSA",
        "hafta": "Hafta 4",
        "clf": MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42)
    },
    "adaboost": {
        "name": "Güçlendirme — AdaBoost (Boosting)",
        "name_tr": "Güçlendirme (AdaBoost)",
        "kisa": "AdaBoost",
        "hafta": "Hafta 5",
        "clf": AdaBoostClassifier(n_estimators=100, random_state=42)
    },
    "xgboost": {
        "name": "Aşırı Gradyan Güçlendirme (XGBoost)",
        "name_tr": "Aşırı Gradyan Güçlendirme (XGBoost)",
        "kisa": "XGBoost",
        "hafta": "Hafta 5",
        "clf": XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1,
                             use_label_encoder=False, eval_metric='mlogloss',
                             random_state=42, verbosity=0)
    },
    "random_forest": {
        "name": "Rastgele Orman (Random Forest / Bagging)",
        "name_tr": "Rastgele Orman (Random Forest)",
        "kisa": "Random Forest",
        "hafta": "Hafta 5",
        "clf": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    }
}

CLASS_NAMES = ['Dusuk (30-50)', 'Orta (51-75)', 'Yuksek (76-100)']
ALGO_ORDER  = ['id3', 'c45', 'cart', 'naive_bayes', 'knn', 'svm', 'ann', 'adaboost', 'xgboost', 'random_forest']
COLORS      = ['#6366f1','#8b5cf6','#06b6d4','#f59e0b','#10b981','#ef4444','#f97316','#ec4899','#14b8a6','#84cc16']


def run_single_algorithm(X, y, algo_key):
    """Tek bir algoritma calistir, tum metrikleri dondur."""
    info = ALGORITHMS[algo_key]
    clf  = info["clf"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.30, random_state=42, stratify=y
    )
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    accuracy  = round(accuracy_score(y_test, y_pred) * 100, 2)
    error     = round(100 - accuracy, 2)
    precision = round(precision_score(y_test, y_pred, average='weighted', zero_division=0) * 100, 2)
    recall    = round(recall_score(y_test, y_pred, average='weighted', zero_division=0) * 100, 2)
    f1        = round(f1_score(y_test, y_pred, average='weighted', zero_division=0) * 100, 2)

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(clf, X, y, cv=cv, scoring='accuracy')
    cv_mean   = round(cv_scores.mean() * 100, 2)
    cv_std    = round(cv_scores.std()  * 100, 2)

    # ROC / AUC
    classes = sorted(np.unique(y))
    y_bin   = label_binarize(y_test, classes=classes)
    try:
        y_prob = clf.predict_proba(X_test)
        auc_scores = []
        roc_data   = {}
        for i, cls in enumerate(classes):
            fpr, tpr, _ = roc_curve(y_bin[:, i], y_prob[:, i])
            a = round(auc(fpr, tpr), 4)
            auc_scores.append(a)
            roc_data[CLASS_NAMES[i]] = {
                "fpr": [round(v, 4) for v in fpr.tolist()],
                "tpr": [round(v, 4) for v in tpr.tolist()],
                "auc": a
            }
        mean_auc = round(float(np.mean(auc_scores)), 4)
    except Exception:
        roc_data = {}
        mean_auc = None

    cm = confusion_matrix(y_test, y_pred).tolist()

    return {
        "key":       algo_key,
        "algorithm": info["name"],
        "kisa":      info["kisa"],
        "hafta":     info["hafta"],
        "color":     COLORS[ALGO_ORDER.index(algo_key)] if algo_key in ALGO_ORDER else "#6366f1",
        # Temel metrikler
        "accuracy":  accuracy,
        "error":     error,
        "precision": precision,
        "recall":    recall,
        "f1":        f1,
        "cv_mean":   cv_mean,
        "cv_std":    cv_std,
        "mean_auc":  mean_auc,
        # Detay
        "confusion_matrix": cm,
        "class_names":      CLASS_NAMES,
        "roc_data":         roc_data,
        "cv_scores":        [round(s * 100, 2) for s in cv_scores.tolist()]
    }


def run_all_algorithms(X, y):
    """Tüm 8 algoritmayı çalıştır, karşılaştırma tablosu oluştur."""
    results   = {}
    comparison = []

    for key in ALGO_ORDER:
        r = run_single_algorithm(X, y, key)
        results[key]  = r
        comparison.append({
            "key":       key,
            "algorithm": r["algorithm"],
            "kisa":      r["kisa"],
            "color":     r["color"],
            "accuracy":  r["accuracy"],
            "error":     r["error"],
            "precision": r["precision"],
            "recall":    r["recall"],
            "f1":        r["f1"],
            "cv_mean":   r["cv_mean"],
            "mean_auc":  r["mean_auc"]
        })

    # F1'e göre sırala
    comparison.sort(key=lambda x: x["f1"], reverse=True)

    # Parametre × Algoritma tablosu (hocanın istediği format)
    METRICS = [
        {"key": "accuracy",  "label": "Accuracy (Doğruluk)"},
        {"key": "error",     "label": "Hata Oranı"},
        {"key": "precision", "label": "Kesinlik (Precision)"},
        {"key": "recall",    "label": "Anma (Recall)"},
        {"key": "f1",        "label": "F-Ölçütü (F1)"},
        {"key": "mean_auc",  "label": "ROC / AUC"},
        {"key": "cv_mean",   "label": "CV Ortalaması (5-Fold)"},
    ]

    param_table = {
        "metrics":    METRICS,
        "algorithms": [{"key": c["key"], "kisa": c["kisa"], "color": c["color"]} for c in comparison],
        "rows": []
    }
    for m in METRICS:
        row = {"metric": m["label"], "values": {}}
        for c in comparison:
            v = c[m["key"]]
            row["values"][c["key"]] = v if v is not None else "—"
        param_table["rows"].append(row)

    # En iyi algoritma
    best = comparison[0]

    return {
        "results":      results,
        "comparison":   comparison,
        "param_table":  param_table,
        "best":         best,
        "best_reason":  (
            f"{best['algorithm']} algoritması F1 skoru ({best['f1']}%), "
            f"Accuracy ({best['accuracy']}%) ve AUC ({best['mean_auc']}) "
            f"değerleri bakımından test edilen {len(ALGO_ORDER)} algoritma arasında en yüksek performansı sergilemiştir."
        )
    }


def get_decision_tree_rules(X, y, feature_cols, algo='c45'):
    """Seçilen karar ağacının kurallarını metin olarak dondur."""
    key = algo if algo in ALGORITHMS else 'c45'
    clf = ALGORITHMS[key]["clf"]
    X_tr, _, y_tr, _ = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    clf.fit(X_tr, y_tr)
    rules = export_text(clf, feature_names=feature_cols, max_depth=5)
    return {"rules": rules, "algo": ALGORITHMS[key]["name"]}


def predict_new(X, y, x_input_scaled):
    """Tüm 8 algoritmayla majority voting tahmini."""
    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    label_map  = {0: 'Dusuk',  1: 'Orta',  2: 'Yuksek'}
    desc_map   = {0: 'Gorev basari orani dusuk (30-50)', 1: 'Orta duzey basari (51-75)', 2: 'Yuksek performans (76-100)'}
    color_map  = {0: '#ef4444', 1: '#f59e0b', 2: '#10b981'}

    predictions = []
    votes = {0: 0, 1: 0, 2: 0}
    x_inp = np.array(x_input_scaled).reshape(1, -1)

    for i, key in enumerate(ALGO_ORDER):
        clf = ALGORITHMS[key]["clf"]
        clf.fit(X_train, y_train)
        pred = int(clf.predict(x_inp)[0])

        try:
            probs = clf.predict_proba(x_inp)[0]
            prob_dict = {label_map[j]: round(float(probs[j]) * 100, 1) for j in range(len(probs))}
        except Exception:
            prob_dict = None

        votes[pred] += 1
        predictions.append({
            "key":         key,
            "algorithm":   ALGORITHMS[key]["kisa"],
            "label":       label_map[pred],
            "class":       pred,
            "color":       COLORS[i],
            "probabilities": prob_dict
        })

    # Çoğunluk oyu
    final_class = max(votes, key=votes.get)
    total       = len(ALGO_ORDER)
    confidence  = round(votes[final_class] / total * 100)

    votes_labeled = {label_map[k]: v for k, v in votes.items()}

    return {
        "predictions":   predictions,
        "votes":         votes_labeled,
        "final_class":   final_class,
        "final_label":   label_map[final_class],
        "final_desc":    desc_map[final_class],
        "final_color":   color_map[final_class],
        "confidence":    confidence
    }
