// 1. Popup'tan gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "ANALYZE_PAGE") {
        // İşlemi başlat ve Chrome'a "Ben sana asenkron cevap vereceğim, bekle" demek için true döndür
        handleAnalysis(sendResponse);
        return true; 
    }
});

async function handleAnalysis(sendResponse) {
    try {
        // 2. Kullanıcının o an aktif olarak baktığı sekmeyi (tab) bul
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Hata Yönetimi: Kullanıcı boş bir sekmede (chrome://) butona bastıysa engelle
       if (!tab || !tab.url || !tab.url.startsWith("http")) {
            return sendResponse({ error: "Lütfen geçerli bir web sayfasında çalıştırın." });
        }

        // 3. Açık olan sekmeye Saha Ajanını (page_parser.js) enjekte et ve çalıştır
        const injectionResult = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content/page_parser.js"]
        });

        // 4. (GELECEK ADIM): Burada ajan sayfayı okuyacak ve LLM API'ye gönderecek.
        // Şimdilik bağlantının çalıştığını kanıtlamak için başarılı mesajı dönüyoruz.
        sendResponse({ success: true, message: "Bağlantı başarılı" });

    } catch (error) {
        console.error("Service Worker Hatası:", error);
        sendResponse({ error: error.message });
    }
}