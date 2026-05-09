# -*- coding: utf-8 -*-
"""
Sosyal Ag Analizi Modulu
Hafta 9 - Veri Madenciligi Dersi
Korelasyon matrisinden benzerlik cizgesi olusturma + NetworkX analizi
"""

import numpy as np
import networkx as nx
from itertools import combinations


def build_similarity_graph(df, feature_cols, threshold=0.4):
    """
    Korelasyon matrisinden benzerlik cizgesi olustur.
    Hafta 9: Korelasyon tabanli ag yaklasimi.
    threshold: Bu degerden buyuk mutlak korelasyon varsa kenar ekle.
    """
    corr_matrix = df[feature_cols].corr()
    G = nx.Graph()

    # Dugumler (ozellikler)
    for col in feature_cols:
        G.add_node(col)

    # Kenarlar (yuksek korelasyonlu ozellikleri bagla)
    for col1, col2 in combinations(feature_cols, 2):
        corr_val = corr_matrix.loc[col1, col2]
        if abs(corr_val) >= threshold:
            G.add_edge(col1, col2, weight=round(float(corr_val), 4))

    return G, corr_matrix


def compute_centrality(G):
    """Merkezilik olcutleri (Hafta 9)."""
    degree_cent     = nx.degree_centrality(G)
    closeness_cent  = nx.closeness_centrality(G)
    betweenness_cent = nx.betweenness_centrality(G, normalized=True)

    # Normalize edilmis degerler
    result = {}
    for node in G.nodes():
        result[node] = {
            "degree_centrality":      round(degree_cent.get(node, 0), 4),
            "closeness_centrality":   round(closeness_cent.get(node, 0), 4),
            "betweenness_centrality": round(betweenness_cent.get(node, 0), 4),
            "degree":                 int(G.degree(node))
        }
    return result


def compute_network_properties(G):
    """Ag ozellikleri (Hafta 9)."""
    props = {
        "num_nodes":   G.number_of_nodes(),
        "num_edges":   G.number_of_edges(),
        "density":     round(nx.density(G), 4),
        "is_connected": nx.is_connected(G),
        "components":  nx.number_connected_components(G)
    }
    if nx.is_connected(G):
        props["avg_shortest_path"] = round(nx.average_shortest_path_length(G), 4)
        props["diameter"] = int(nx.diameter(G))
    else:
        # En buyuk bilesene bak
        largest_cc = max(nx.connected_components(G), key=len)
        H = G.subgraph(largest_cc)
        props["avg_shortest_path"] = round(nx.average_shortest_path_length(H), 4)
        props["diameter"] = int(nx.diameter(H))

    props["avg_clustering"] = round(nx.average_clustering(G), 4)
    return props


def detect_communities(G):
    """Topluluk belirleme — Greedy Modularity (Girvan-Newman alternatifi)."""
    if G.number_of_edges() == 0:
        return {"communities": [], "modularity": 0}

    try:
        communities = list(nx.community.greedy_modularity_communities(G))
        community_list = []
        for i, comm in enumerate(communities):
            community_list.append({
                "id": i,
                "members": list(comm),
                "size": len(comm)
            })
        # Modularity hesapla
        mod = round(nx.community.modularity(G, communities), 4)
        return {
            "communities": community_list,
            "modularity": mod,
            "num_communities": len(communities)
        }
    except Exception as e:
        return {"communities": [], "modularity": 0, "error": str(e)}


def get_graph_json(G):
    """Graph'i JSON formatina donustur (frontend icin)."""
    # Pozisyon hesapla (spring layout)
    pos = nx.spring_layout(G, seed=42, k=2)

    nodes = []
    for node in G.nodes():
        x, y = pos[node]
        nodes.append({
            "id":     node,
            "label":  node.replace("_", " "),
            "x":      round(float(x), 4),
            "y":      round(float(y), 4),
            "degree": int(G.degree(node))
        })

    edges = []
    for u, v, data in G.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "weight": data.get("weight", 1.0),
            "abs_weight": round(abs(data.get("weight", 1.0)), 4)
        })

    return {"nodes": nodes, "edges": edges}


def get_degree_distribution(G):
    """Derece dagilimi (Hafta 9)."""
    degrees = [d for _, d in G.degree()]
    unique_degrees = sorted(set(degrees))
    counts = [degrees.count(d) for d in unique_degrees]
    return {
        "degrees": unique_degrees,
        "counts":  counts,
        "avg_degree": round(sum(degrees) / len(degrees) if degrees else 0, 4)
    }


def run_full_analysis(df, feature_cols, threshold=0.4):
    """Tam sosyal ag analizini calistir."""
    G, corr_matrix = build_similarity_graph(df, feature_cols, threshold)

    centrality   = compute_centrality(G)
    properties   = compute_network_properties(G)
    communities  = detect_communities(G)
    graph_json   = get_graph_json(G)
    degree_dist  = get_degree_distribution(G)

    # En merkezi dugumler
    top_degree    = sorted(centrality.items(), key=lambda x: x[1]["degree_centrality"],      reverse=True)[:5]
    top_between   = sorted(centrality.items(), key=lambda x: x[1]["betweenness_centrality"], reverse=True)[:5]
    top_closeness = sorted(centrality.items(), key=lambda x: x[1]["closeness_centrality"],   reverse=True)[:5]

    return {
        "threshold":     threshold,
        "graph":         graph_json,
        "centrality":    centrality,
        "properties":    properties,
        "communities":   communities,
        "degree_distribution": degree_dist,
        "top_nodes": {
            "by_degree":      [{"node": n, "value": v["degree_centrality"]} for n, v in top_degree],
            "by_betweenness": [{"node": n, "value": v["betweenness_centrality"]} for n, v in top_between],
            "by_closeness":   [{"node": n, "value": v["closeness_centrality"]} for n, v in top_closeness]
        },
        "correlation_matrix": {
            "columns": feature_cols,
            "matrix":  corr_matrix.round(4).values.tolist()
        }
    }
