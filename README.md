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

> **Ön Gereksinim:** Devam etmeden önce aşağıdaki yazılımın sisteminizde kurulu olduğundan emin olun.
> * **Python 3.9+** → [python.org](https://www.python.org/downloads/) adresinden indirin. Kurulum sırasında **"Add Python to PATH"** seçeneğini işaretlemeyi unutmayın.
> * Kurulumu doğrulamak için terminalde `python --version` komutunu çalıştırın.

---

### Adım 1 — Projeyi Edinin

Projeyi iki farklı yöntemle edinebilirsiniz:

#### 🗜️ Yöntem A — ZIP Dosyasından Kurulum (Önerilen)

1. Teslim edilen **`Bug-Farmers-AI-Performance.zip`** dosyasını bilgisayarınızda uygun bir konuma (örn: Masaüstü veya `C:\Projeler\`) çıkartın.
2. Çıkarma işlemi tamamlandıktan sonra klasör yapısının şu şekilde göründüğünü doğrulayın:

```
Bug-Farmers-AI-Performance/
├── backend/
│   ├── app.py
│   ├── classification.py
│   ├── clustering.py
│   ├── preprocessing.py
│   └── social_network.py
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── AI_Developer_Performance_Extended_1000.csv
└── requirements.txt
```

3. Terminali (CMD veya PowerShell) açın ve **ZIP'in çıkarıldığı klasörün içine** girin:

```bash
# Örnek: Masaüstüne çıkardıysanız
cd C:\Users\KullaniciAdi\Desktop\Bug-Farmers-AI-Performance
```

> 💡 **İpucu:** Dosya Gezgini'nde klasörü açıp adres çubuğuna `cmd` yazıp Enter'a basarsanız terminal otomatik olarak o dizinde açılır.

#### 🔗 Yöntem B — Git ile Klonlama (İsteğe Bağlı)

Git kuruluysa doğrudan GitHub'dan klonlayabilirsiniz:

```bash
git clone https://github.com/umutkaganc/Bug-Farmers-AI-Performance.git
cd Bug-Farmers-AI-Performance
```

---

### Adım 2 — Sanal Ortam Oluşturun (Önerilen)

Bağımlılık çakışmalarını önlemek için projeye özel bir Python sanal ortamı oluşturmanız **şiddetle tavsiye edilir**:

**Windows (CMD / PowerShell):**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

> Sanal ortam başarıyla etkinleştirildiğinde terminal satırınızın başında `(venv)` ifadesi görünür.

---

### Adım 3 — Bağımlılıkları Yükleyin

Sanal ortam aktifken aşağıdaki komutu çalıştırın. Bu komut `requirements.txt` dosyasındaki tüm Python kütüphanelerini (Flask, scikit-learn, XGBoost, NetworkX vb.) otomatik olarak yükler:

```bash
pip install -r requirements.txt
```

Yüklenen başlıca kütüphaneler:

| Kütüphane | Sürüm | Kullanım Amacı |
| :--- | :---: | :--- |
| `flask` | ≥2.3.0 | REST API Sunucusu |
| `scikit-learn` | ≥1.2.2 | ML Algoritmaları & Ön İşleme |
| `xgboost` | ≥1.7.0 | XGBoost Sınıflandırıcı |
| `pandas` | ≥1.5.0 | Veri Yükleme & İşleme |
| `numpy` | ≥1.23.0 | Sayısal Hesaplamalar |
| `networkx` | ≥3.0 | Sosyal Ağ Analizi (SNA) |
| `scipy` | ≥1.10.0 | İstatistiksel Hesaplamalar |

---

### Adım 4 — Uygulamayı Başlatın

Kurulum tamamlandıktan sonra Flask API sunucusunu başlatın:

```bash
python backend/app.py
```

Terminalde aşağıdaki çıktıyı görüyorsanız sunucu başarıyla çalışıyor demektir:

```
[*] Veri seti yukleniyor...
[+] Veri seti yuklendi: 963 satir, 15 sutun
[*] Flask sunucusu baslatiliyor: http://127.0.0.1:5000
```

Ardından tarayıcınızı açın ve şu adrese gidin:

```
http://127.0.0.1:5000
```

---

### 💻 VS Code ile Çalıştırma (Alternatif)

Visual Studio Code kullanıyorsanız aşağıdaki adımları izleyerek projeyi VS Code üzerinden de çalıştırabilirsiniz:

**1. Klasörü VS Code'da Açın:**

- VS Code'u başlatın.
- Üst menüden **File → Open Folder** seçin.
- ZIP'i çıkardığınız `Bug-Farmers-AI-Performance` klasörünü seçip **"Klasörü Seç"** butonuna tıklayın.

**2. Önerilen Uzantıları Yükleyin:**

VS Code, Python projeleri için aşağıdaki uzantıları önerir — yükleyin:

| Uzantı | Yayıncı | Açıklama |
| :--- | :--- | :--- |
| **Python** | Microsoft | Sözdizimi vurgulama, hata ayıklama |
| **Pylance** | Microsoft | Gelişmiş kod tamamlama |

**3. Python Yorumlayıcısını Seçin:**

- `Ctrl + Shift + P` tuşlarına basın ve **"Python: Select Interpreter"** yazın.
- Listede `venv` etiketli yorumlayıcıyı seçin: `.\venv\Scripts\python.exe`
- Eğer `venv` listede görünmüyorsa önce **Adım 2**'deki sanal ortam kurulumunu tamamlayın.

**4. Entegre Terminali Açın ve Uygulamayı Başlatın:**

- `` Ctrl + ` `` tuşlarına basarak VS Code'un entegre terminalini açın.
- Terminal otomatik olarak proje kök dizininde açılır. Sırasıyla şu komutları çalıştırın:

```bash
# Sanal ortamı aktifleştir (henüz aktif değilse)
venv\Scripts\activate

# Flask sunucusunu başlat
python backend/app.py
```

- Terminal çıktısında `http://127.0.0.1:5000` adresini görünce **Ctrl tuşuna basılı tutarak** linke tıklayın — tarayıcı otomatik açılır.

> 💡 **İpucu:** `backend/app.py` dosyasını açıkken sağ üstteki ▶️ **"Run Python File"** butonuna tıklamak da sunucuyu başlatır. Ancak bu durumda terminalde sanal ortamın aktif olduğundan emin olun.

---

### ⚠️ Sık Karşılaşılan Hatalar ve Çözümleri


<details>
<summary><b>❌ <code>ModuleNotFoundError: No module named 'flask'</code></b></summary>

Sanal ortamın aktif olmadığını veya bağımlılıkların yüklenmediğini gösterir.

```bash
# Sanal ortamı aktifleştirin (Windows)
venv\Scripts\activate

# Ardından yeniden yükleyin
pip install -r requirements.txt
```
</details>

<details>
<summary><b>❌ <code>Address already in use</code> / Port 5000 meşgul</b></summary>

5000 portu başka bir uygulama tarafından kullanılıyor. Farklı bir port ile başlatın:

```bash
python backend/app.py --port 5001
```

Ya da `backend/app.py` dosyasının son satırındaki `port=5000` değerini değiştirin.
</details>

<details>
<summary><b>❌ <code>FileNotFoundError: dataset/... .csv</code></b></summary>

Komut `Bug-Farmers-AI-Performance/` kök dizininden değil, farklı bir dizinden çalıştırılıyor olabilir. Doğru dizinde olduğunuzdan emin olun:

```bash
# Proje kök dizinine gidin
cd Bug-Farmers-AI-Performance

# Ardından başlatın
python backend/app.py
```
</details>

<details>
<summary><b>❌ macOS'ta <code>pip</code> yerine <code>pip3</code> / <code>python3</code> kullanımı</b></summary>

macOS sistemlerde Python 3 için `python3` ve `pip3` komutlarını kullanın:

```bash
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 backend/app.py
```
</details>

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


