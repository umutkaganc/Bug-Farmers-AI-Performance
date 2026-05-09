# YapayZekaProjeDosyası
# 🚀 Bug Farmers: AI-Driven Developer Performance Prediction

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2.2-orange.svg)](https://scikit-learn.org/)
[![HTML/CSS/JS](https://img.shields.io/badge/Frontend-Vanilla_JS-yellow.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

> *"Yazılım projelerindeki başarısızlıkların ana nedeni donanım değil, insan faktörü ve bilişsel yorgunluktur."*

**Bug Farmers**, yazılım geliştiricilerin çalışma saatleri, kahve tüketimleri, deneyim yılları ve uyku süreleri gibi bilişsel yük parametrelerini analiz ederek, performanslarını (**Düşük, Orta, Yüksek**) tahminleyen makine öğrenmesi tabanlı bir Karar Destek Sistemidir.

---

## 🎯 Projenin Amacı ve Motivasyonu
Geleneksel performans ölçümleri (yazılan kod satır sayısı vb.) geliştiricinin psikolojik ve fiziksel durumunu göz ardı eder. Bu proje; uyku eksikliği ve yüksek stres seviyelerinin projelerde "Teknik Borç (Technical Debt)" yaratmasını önlemek amacıyla, yapay zeka destekli proaktif bir sınıflandırma sistemi sunmaktadır.

## 🧠 10 Algoritmalı Öğrenme Ekosistemi
Tek bir modele bağımlı kalmanın getirdiği önyargı (bias) riskini ortadan kaldırmak için sistemde 10 farklı makine öğrenmesi algoritması eğitilmiştir:

1. **Ağaç Bazlı Modeller:** Random Forest, XGBoost, AdaBoost, Decision Tree
2. **Matematiksel/Olasılıksal Modeller:** Destek Vektör Makineleri (SVM), k-NN, Naive Bayes, Logistic Regression
3. **Derin Öğrenme:** MLPClassifier (Çok Katmanlı Algılayıcı - YSA)
4. **Çoğunluk Oylaması (Majority Voting):** Tüm algoritmaların tahminlerini alıp en çok oy alanı nihai karar olarak sunan meta-algoritma (Hard Voting).

## 🏆 Şampiyon Model ve Performans (5-Fold CV)
Aşırı öğrenmeyi (Overfitting) engellemek amacıyla uygulanan **5-Fold Cross Validation** testleri sonucunda sistemin en başarılı algoritması:

* **Şampiyon:** Destek Vektör Makineleri (SVM)
* **Kernel:** RBF (Radyal Tabanlı Fonksiyon)
* **F1-Skoru:** %87.47
* **Accuracy (Doğruluk):** %87.33

*(Doğrusal algoritmalar düşük skor verirken, SVM'in RBF çekirdeği ile verileri yüksek boyutlu uzaya taşıması veri setinin doğrusal olmayan (non-linear) yapısını kanıtlamıştır.)*

## 🔍 Gözetimsiz Öğrenme ve Ağ Analizi
* **K-Means Demetleme:** Geliştiriciler; uzaklık metriklerine göre otomatik olarak 3 farklı profile (Tükenmiş, Verimli, Standart) ayrıştırılmıştır.
* **Sosyal Ağ Analizi (SNA):** Değişkenler birer düğüm (node) olarak modellenmiş; uyku ve stresin ağın akışını kontrol eden en kritik merkezler olduğu *Betweenness Centrality* hesaplamalarıyla kanıtlanmıştır.

## 💻 Kurulum ve Çalıştırma

Proje klasörünü bilgisayarınıza indirdikten sonra, dinamik web arayüzünü (Dashboard) çalıştırmak için:

1. Bilgisayarınızda `frontend/index.html` dosyasına çift tıklayarak tarayıcıda açın.
2. Açılan arayüzde bir geliştiricinin çalışma, uyku ve kahve bilgilerini girin.
3. Arka planda 10 algoritmanın anlık ürettiği tahminleri ve **Majority Voting** sonucunu yeşil panelden inceleyin.
4. Alt kısımdaki "Haftalık Modüller" sekmesinden K-Means, Veri Ön İşleme ve Makine Öğrenmesi raporlarını detaylıca okuyabilirsiniz.

## 👨‍💻 Proje Ekibi (Grup I - İşbirlikli Öğrenme Alanı)
* **Hakan Yavuz** (23010708050)
* **Ali Güngör** (23010708021)
* **Umut Kağan Ceylan** (23010708011)

---
*Bu proje, üniversite "Veri Madenciliği ve Yapay Zeka" dersi kapsamında akademik araştırma ve uygulama projesi olarak geliştirilmiştir.*

