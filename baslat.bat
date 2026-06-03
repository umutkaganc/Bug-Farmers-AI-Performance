@echo off
title Yapay Zeka Projesi - Calistirma Ekrani
color 0A

echo =====================================================
echo YAPAY ZEKA DERSI PROJESI BASLATILIYOR...
echo Lutfen bekleyin, kutuphaneler kontrol ediliyor...
echo =====================================================
echo.

:: Gerekli kütüphaneleri kur
pip install -r requirements.txt

echo.
echo =====================================================
echo SUNUCU BASLATILIYOR...
echo Proje tarayicinizda otomatik olarak acilacaktir.
echo DIKKAT: Projeyi incelediginiz sure boyunca bu SİYAH PENCEREYİ KAPATMAYIN!
echo =====================================================
echo.

:: Arka planda 5 saniye sayıp sonra tarayıcıyı açacak bir komut (Sunucunun verileri yüklemesi için zaman tanır)
start /B cmd /c "timeout /t 5 /nobreak > NUL & start http://127.0.0.1:5000"

:: Sunucuyu başlat
python backend\app.py

pause
