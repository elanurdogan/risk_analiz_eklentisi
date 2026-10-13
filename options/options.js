// Sayfa yüklendiğinde, kasada (storage) kayıtlı bir şifre varsa onu ekrana getir (yıldızlı olarak)
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['llmApiKey'], (result) => {
        if (result.llmApiKey) {
            document.getElementById('apiKey').value = result.llmApiKey;
        }
    });
});

// Kaydet butonuna basıldığında çalışacak fonksiyon
document.getElementById('kaydetBtn').addEventListener('click', () => {
    const key = document.getElementById('apiKey').value.trim();
    const statusDiv = document.getElementById('status');

    // Basit Girdi Doğrulaması (Kullanıcı verilerini doğrulasın kuralı)
    if (!key) {
        statusDiv.innerHTML = '<span style="color: red;">❌ API anahtarı boş olamaz!</span>';
        return;
    }

    // Şifreyi Chrome'un yerel hafızasına güvenli bir şekilde kaydet
    chrome.storage.local.set({ llmApiKey: key }, () => {
        statusDiv.innerHTML = '<span style="color: green;">✅ API Anahtarı başarıyla kaydedildi!</span>';
        
        // 2 saniye sonra mesajı temizle
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 2000);
    });
});