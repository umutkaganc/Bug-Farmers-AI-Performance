# 🚀 Bug Farmers: Yapay Zeka Tabanlı Geliştirici Performans Kestirim Sistemi

Bu proje, yazılım projelerindeki zaman ve bütçe aşımlarının temel nedeni olan "insan faktörünü" ve "bilişsel yorgunluğu" analiz etmek amacıyla geliştirilmiş kapsamlı bir makine öğrenmesi aracıdır. Modern ve kullanıcı dostu bir web arayüzü üzerinden, geliştiricilerin bilişsel yüklerini (stres, uyku, çalışma saati) hesaplayarak performanslarını tahmin etme imkanı sunar.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2.2-orange.svg)
![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla_JS-yellow.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Özellikler
* **Çoklu Algoritma Desteği:** 10 farklı makine öğrenmesi algoritması (SVM, Random Forest, XGBoost vb.) ile eşzamanlı performans sınıflandırması.
* **Gelişmiş Görselleştirme:** K-Means kümelerinin ve NetworkX tabanlı Sosyal Ağ (SNA) değişken ilişkilerinin interaktif görselleştirilmesi.
* **Bilişsel Yük Analizi:** Uyku süresi, stres seviyesi ve kahve tüketimi gibi metriklerin kod kalitesine olan etkisinin matematiksel analizi.
* **Modern Arayüz:** Vanilla JS, CSS Glassmorphism ve Cyberpunk teması ile geliştirilmiş, kullanımı kolay interaktif Web Dashboard.
* **Çoğunluk Oylaması (Majority Voting):** Tüm algoritmaların anlık olarak eğitilip oylama yaptığı ve en çok oy alan sonucun nihai karar olarak sunulduğu otonom karar destek mekanizması.
* **Aşırı Öğrenme Kontrolü:** K=5 Fold Cross Validation (Çapraz Doğrulama) ile %100 tekrarlanabilir ve ezberden uzak model doğrulaması.

## 🧠 Algoritmalar ve Katkıda Bulunanlar
Proje kapsamında aşağıdaki algoritmalar implemente edilmiştir:

* **Topluluk (Ensemble) Algoritmaları:** Random Forest, XGBoost, AdaBoost, Karar Ağaçları
* **Matematiksel Modeller:** Destek Vektör Makineleri (SVM), k-NN, Naive Bayes
* **Derin Öğrenme:** Çok Katmanlı Algılayıcı (MLPClassifier - YSA)
* **Gözetimsiz Öğrenme:** K-Means Kümeleme ve Sosyal Ağ Analizi (SNA)

**Grup I - İşbirlikli Öğrenme Alanı Ekibi:**
* **Hakan Yavuz** (Backend & Veri Madenciliği)
* **Ali Güngör** (Makine Öğrenmesi & Veri Ön İşleme)
* **Umut Kağan Ceylan** (Arayüz & Entegrasyon & Analiz)

## 🛠️ Kurulum
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

**1. Repoyu Klonlayın:**
```bash
git clone https://github.com/kullaniciadi/Bug-Farmers-AI-Performance.git
cd Bug-Farmers-AI-Performance
```

**2. Gerekli Kütüphaneleri Yükleyin:**
```bash
pip install -r requirements.txt
```

## ▶️ Kullanım
Uygulamayı başlatmak için projeyi yerel ortamınızda çalıştırın:

**Arayüz Sekmeleri**
🔍 **Canlı Tahmin (Live Prediction):**
* Geliştiriciye ait Çalışma Saati, Uyku, Stres ve Kahve tüketim değerlerini girin.
* `TAHMİN ET` butonuna tıklayın.
* Sistem arka planda 10 algoritmayı tetikleyecek ve her birinin tahmin sonucunu ekrana yansıtacaktır.
* Sonuçlar, "Majority Voting" mantığı ile birleştirilip en yüksek oyu alan performans sınıfı (DÜŞÜK, ORTA, YÜKSEK) büyük yeşil ekranda gösterilir.

📊 **Algoritma Karşılaştırma Tablosu:**
* Bu sekmede, 10 farklı algoritmanın (SVM, XGBoost, Naive Bayes vb.) Accuracy (Doğruluk) ve F1 Skorlarını kıyaslayabilirsiniz.
* Tablo, algoritmaların doğrusallık analizlerini ve hiperparametre başarılarını raporlar.

🔮 **Gözetimsiz Öğrenme Analizleri:**
* K-Means modülü ile geliştiricilerin uzaklık metriklerine göre hangi profillere ayrıldığını (Tükenmiş, Verimli, Standart) inceleyebilirsiniz.
* Ağ Analizi (SNA) grafiğinde, "Uyku" ve "Stres" düğümlerinin projedeki "Hata (Bug)" oranını nasıl kontrol ettiğini görselleştirebilirsiniz.

## 📂 Dosya Yapısı
* `frontend/index.html`: Ana uygulama ve GUI kodu (Glassmorphism tasarımı).
* `backend/classification.py`: 10 algoritmalı sınıflandırma ve Majority Voting implementasyonu.
* `backend/clustering.py`: K-Means ve Hiyerarşik demetleme algoritması.
* `backend/social_network.py`: Değişkenler arası NetworkX (SNA) bağlantı implementasyonu.
* `backend/preprocessing.py`: Eksik veri doldurma, Min-Max Normalizasyon ve Label Encoding süreçleri.
* `dataset/AI_Developer_Performance_Extended_1000.csv`: Kaggle kaynaklı 963 satırlık geliştirici veri seti.

## 🔬 Tekrarlanabilirlik ve Majority Voting (Çoğunluk Oylaması)
Proje, bilimsel araştırma ve akademik çalışmalar için kritik öneme sahip %100 tekrarlanabilir sonuçlar sunmaktadır. Veriler rastgele değil, matematiksel kanıtlara dayalı algoritmalarla işlenir.

**Sistem Mimarisi**
Arayüzde tetiklenen "Çoğunluk Oylaması", karar ağaçlarının zayıflıklarını gidermek için tasarlanmıştır:
1. **Veri Girişi:** Sistem 0.0 - 1.0 aralığında ölçeklenmiş anlık veriyi alır.
2. **Paralel İşleme:** 10 algoritma, kendi hiperdüzlemlerini kullanarak bağımsız tahminler üretir.
3. **Hard Voting:** Hangi sınıf (Örn: Yüksek Performans) en çok algoritma tarafından tahmin edildiyse, o karar nihai sonuç olarak belirlenir. Bu, tek bir algoritmanın (Örn: Naive Bayes) yapabileceği varyans hatasını sıfıra indirir.

## 🆕 Son Güncellemeler
**Versiyon 2.0 - Mayıs 2026**
* ✅ **Genişletilmiş Algoritma Desteği:** Sistem 8 algoritmalı regresyon yapısından, 10 algoritmalı sınıflandırma (Classification) görevine dönüştürüldü.
* ✅ **Çoklu Metrik Analizi:** Modellerin başarısı sadece Accuracy ile değil, dengesiz veriler için daha stabil olan F1-Score ve AUC metrikleriyle güçlendirildi.
* ✅ **Min-Max Normalizasyon:** k-NN ve K-Means algoritmalarındaki uzaklık önyargısını (bias) gidermek için tüm değişkenler standardize edildi.
* ✅ **Kapsamlı Dokümantasyon:** Proje BİTED makale yazım kurallarına uygun teknik raporlarla donatıldı.
* ✅ **Gelişmiş UI/UX:** Neon/Cyberpunk temalı, cam efektine (Glassmorphism) sahip modern arayüz tasarımı eklendi.

## 📈 Performans
Ağaç bazlı ve doğrusal modellerin K-Fold doğrulama (K=5) testleri sonrasında alınan performans kıyaslamaları:

| Algoritma | F1 Skoru | Accuracy | Durum |
| :--- | :---: | :---: | :--- |
| **SVM (RBF Kernel)** | **%87.47** | **%87.33** | 🏆 Şampiyon Model (Non-Linear) |
| Random Forest | %85.12 | %85.00 | Başarılı |
| XGBoost | %84.90 | %84.85 | Başarılı |
| Logistic Regression | %45.20 | %46.10 | Başarısız (Veri Doğrusal Değil) |

*(Testler standart donanım üzerinde gerçekleştirilmiş olup, 5-Fold iterasyonları ortalama 4 saniye sürmektedir.)*


