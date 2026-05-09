# -*- coding: utf-8 -*-
"""
Veri Onisleme Modulu
Hafta 3 - Veri Madenciligi Dersi
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler, LabelEncoder

# Veri dosyasinin yolu (ASCII-safe path)
DATA_PATH = r"C:\YZProje\AI_Developer_Performance_Extended_1000.xlsx"


def load_data():
    """Veri setini yukle ve hedef degiskeni olustur."""
    df = pd.read_excel(DATA_PATH, header=1)

    # Hedef degisken: Task_Success_Rate -> 3 sinif
    def categorize(val):
        if val <= 50:
            return 0   # Dusuk
        elif val <= 75:
            return 1   # Orta
        else:
            return 2   # Yuksek

    df['Performance_Class'] = df['Task_Success_Rate'].apply(categorize)
    df['Performance_Label'] = df['Performance_Class'].map({0: 'Dusuk', 1: 'Orta', 2: 'Yuksek'})
    return df


def get_basic_info(df):
    """Veri seti hakkinda temel bilgileri dondur."""
    return {
        "rows": int(df.shape[0]),
        "cols": int(df.shape[1]),
        "columns": list(df.columns),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "missing_values": df.isnull().sum().to_dict()
    }


def get_descriptive_stats(df):
    """Merkezi egilim ve dagilim olcutleri (Hafta 3)."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    # Sinif sutunlarini cikar
    numeric_cols = [c for c in numeric_cols if c not in ['Performance_Class']]

    stats = {}
    for col in numeric_cols:
        series = df[col].dropna()
        q1 = float(series.quantile(0.25))
        q3 = float(series.quantile(0.75))
        stats[col] = {
            "mean":   round(float(series.mean()), 3),
            "median": round(float(series.median()), 3),
            "mode":   round(float(series.mode()[0]), 3),
            "std":    round(float(series.std()), 3),
            "min":    round(float(series.min()), 3),
            "max":    round(float(series.max()), 3),
            "q1":     round(q1, 3),
            "q3":     round(q3, 3),
            "iqr":    round(q3 - q1, 3),
            "variance": round(float(series.var()), 3)
        }
    return stats


def get_correlation_matrix(df):
    """Korelasyon matrisi (Hafta 3)."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    numeric_cols = [c for c in numeric_cols if c not in ['Performance_Class']]
    corr = df[numeric_cols].corr().round(3)
    return {
        "columns": numeric_cols,
        "matrix": corr.values.tolist()
    }


def get_class_distribution(df):
    """Sinif dagilimi."""
    dist = df['Performance_Label'].value_counts()
    return {
        "labels": dist.index.tolist(),
        "values": dist.values.tolist()
    }


def get_histogram_data(df, column):
    """Belirli bir sutun icin histogram verisi."""
    series = df[column].dropna()
    counts, bin_edges = np.histogram(series, bins=20)
    bin_centers = [(bin_edges[i] + bin_edges[i+1]) / 2 for i in range(len(counts))]
    return {
        "bins": [round(b, 2) for b in bin_centers],
        "counts": counts.tolist()
    }


def get_outlier_info(df):
    """IQR yontemiyle aykiri deger analizi (Hafta 3)."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    numeric_cols = [c for c in numeric_cols if c not in ['Performance_Class']]
    outliers = {}
    for col in numeric_cols:
        series = df[col].dropna()
        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        outlier_count = int(((series < lower) | (series > upper)).sum())
        outliers[col] = {
            "count": outlier_count,
            "lower_bound": round(float(lower), 3),
            "upper_bound": round(float(upper), 3)
        }
    return outliers


def get_normalized_data(df, method='minmax'):
    """Normalizasyon (Hafta 3): minmax veya zscore."""
    feature_cols = ['Hours_Coding', 'Lines_of_Code', 'Bugs_Found', 'Bugs_Fixed',
                    'AI_Usage_Hours', 'Sleep_Hours', 'Cognitive_Load',
                    'Coffee_Intake', 'Stress_Level', 'Task_Duration_Hours', 'Commits', 'Errors']
    X = df[feature_cols].copy()

    if method == 'minmax':
        scaler = MinMaxScaler()
        label = "Min-Max Normalizasyonu [0,1]"
    else:
        scaler = StandardScaler()
        label = "Z-Score Normalizasyonu (ort=0, std=1)"

    X_scaled = scaler.fit_transform(X)
    df_scaled = pd.DataFrame(X_scaled, columns=feature_cols)

    # Ilk 5 satirin karsilastirmasi
    return {
        "method": label,
        "columns": feature_cols,
        "original_sample": df[feature_cols].head(5).round(3).values.tolist(),
        "normalized_sample": df_scaled.head(5).round(4).values.tolist()
    }


def get_feature_columns():
    """Model icin kullanilacak ozellik sutunlari."""
    return ['Hours_Coding', 'Lines_of_Code', 'Bugs_Found', 'Bugs_Fixed',
            'AI_Usage_Hours', 'Sleep_Hours', 'Cognitive_Load',
            'Coffee_Intake', 'Stress_Level', 'Task_Duration_Hours', 'Commits', 'Errors']


def prepare_features(df):
    """X ve y matrislerini hazirla."""
    feature_cols = get_feature_columns()
    X = df[feature_cols].values
    y = df['Performance_Class'].values
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    return X_scaled, y, feature_cols
