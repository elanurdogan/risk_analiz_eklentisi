document.getElementById('analizBtn').addEventListener('click', async () => {
    const btn = document.getElementById('analizBtn');
    const sonucDiv = document.getElementById('sonuc');

    // 1. Butonu devre dışı bırak ve kullanıcıya işlem başladığını bildir
    btn.disabled = true;
    btn.innerText = "⏳ Sayfa Okunuyor...";
    sonucDiv.innerHTML = "";

    try {
        // 2. Merkez Üsse (Service Worker) mesaj gönder ve cevabı bekle
        const response = await chrome.runtime.sendMessage({ action: "ANALYZE_PAGE" });

        // 3. Gelen cevaba göre UI'ı güncelle (Hata yönetimi)
        if (response.error) {
            sonucDiv.innerHTML = `<span style="color:red">❌ Hata: ${response.error}</span>`;
        } else {
            sonucDiv.innerHTML = `<span style="color:green">✅ Sayfa metni başarıyla okundu! (LLM entegrasyonu bekleniyor)</span>`;
            // İleride LLM'den dönen JSON'u burada tablo halinde ekrana basacağız.
        }
    } catch (err) {
        // Hata Yönetimi: Eğer arka plan çökerse veya internet koparsa
        sonucDiv.innerHTML = `<span style="color:red">❌ İletişim Hatası: Eklenti arka planı yanıt vermedi.</span>`;
    } finally {
        // İşlem bitince butonu eski haline getir
        btn.disabled = false;
        btn.innerText = "Riski Analiz Et";
    }
});