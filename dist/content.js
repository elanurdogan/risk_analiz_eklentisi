/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./content/page_parser.js ***!
  \********************************/
// content/page_parser.js

/**
 * Bu dosya eklentimizin "Saha Ajanı"dır.
 * Sayfada sürekli uyanık bekler ve Merkez Üs'ten (Service Worker) emir geldiğinde
 * DOM'u okuyup metni geri gönderir.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_PAGE_TEXT") {
        try {
            const metin = document.body.innerText || "";
            const temizlenmisMetin = metin.replace(/\n\s*\n/g, '\n').trim();

            if (!temizlenmisMetin || temizlenmisMetin.length < 50) {
                console.warn("Sayfada yeterli sözleşme metni bulunamadı.");
                sendResponse({ text: null });
            } else {
                sendResponse({ text: temizlenmisMetin });
            }
        } catch (error) {
            console.error("DOM Okuma Hatası:", error);
            sendResponse({ text: null });
        }
    }
    // Asenkron yanıt verebilmek için true döndürüyoruz (Kritik)
    return true; 
});
/******/ })()
;
//# sourceMappingURL=content.js.map