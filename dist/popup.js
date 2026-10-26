/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./popup/popup.js ***!
  \************************/
// Sayfadan ve modelden gelen metin HTML olarak yorumlanmasın diye kaçışlanır (XSS / injection koruması)
const kacis = (metin) => String(metin ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

document.getElementById('analizBtn').addEventListener('click', async () => {
    const btn = document.getElementById('analizBtn');
    const sonucDiv = document.getElementById('sonuc');

    btn.disabled = true;
    btn.innerText = "⏳ Yapay Zeka Analiz Ediyor...";
    sonucDiv.innerHTML = "";

    try {
        const response = await chrome.runtime.sendMessage({ action: "ANALYZE_PAGE" });

        if (response.error) {
            sonucDiv.innerHTML = `<span style="color:red; font-weight:bold;">❌ Hata:</span> ${kacis(response.error)}`;
        } else {
            // Gelen JSON verisini UI'da estetik bir şekilde oluşturma
            const rapor = response.data;
            let htmlKodu = `
                <div style="background-color: ${rapor.risk_skoru > 70 ? '#ffebee' : '#e8f5e9'}; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 15px;">
                    <h2 style="margin: 0; color: ${rapor.risk_skoru > 70 ? '#c62828' : '#2e7d32'};">Risk Skoru: ${rapor.risk_skoru}/100</h2>
                </div>
                <h4 style="margin-bottom: 5px;">Tespit Edilen Riskler:</h4>
            `;

            if (rapor.riskli_maddeler.length === 0) {
                htmlKodu += `<p>✅ Herhangi bir riskli madde bulunamadı.</p>`;
            } else {
                rapor.riskli_maddeler.forEach((madde, index) => {
                    htmlKodu += `
                        <div style="border-left: 4px solid #ff9800; background-color: #fff8e1; padding: 10px; margin-bottom: 10px; border-radius: 3px;">
                            <strong>${index + 1}. Kategori:</strong> ${kacis(madde.kategori)} <br>
                            <hr style="border: 0; border-top: 1px solid #ffe082; margin: 8px 0;">
                            <span style="font-size: 12px; color: #555;"><i>"${kacis(madde.orijinal_metin)}"</i></span> <br>
                            <hr style="border: 0; border-top: 1px solid #ffe082; margin: 8px 0;">
                            <strong>Sade Açıklama:</strong> ${kacis(madde.sade_aciklama)}
                        </div>
                    `;
                });
            }

            // Belirsizlik: alıntısı sayfada bulunamayan iddialar risk sayılmaz ama gizlenmez de
            if (rapor.dogrulanamayan && rapor.dogrulanamayan.length > 0) {
                htmlKodu += `<h4 style="margin-bottom: 5px; color: #6c757d;">❔ Doğrulanamayan iddialar (${rapor.dogrulanamayan.length})</h4>
                    <p style="font-size: 12px; color: #6c757d; margin-top: 0;">Model bu maddeleri öne sürdü ancak alıntıları sayfada birebir bulunamadı. Bu yüzden geçersiz sayıldı.</p>`;
                rapor.dogrulanamayan.forEach((madde) => {
                    htmlKodu += `
                        <div style="border-left: 4px solid #adb5bd; background-color: #f1f3f5; padding: 8px; margin-bottom: 8px; border-radius: 3px; font-size: 12px; color: #495057;">
                            <strong>${kacis(madde.kategori || 'Kategorisiz')}</strong>: <i>"${kacis(madde.orijinal_metin)}"</i><br>
                            <span style="color: #868e96;">Sebep: ${kacis(madde.sebep)}</span>
                        </div>
                    `;
                });
            }
            sonucDiv.innerHTML = htmlKodu;
        }
    } catch (err) {
        sonucDiv.innerHTML = `<span style="color:red">❌ İletişim Hatası: Eklenti arka planı yanıt vermedi.</span>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "Riski Analiz Et";
    }
});
/******/ })()
;
//# sourceMappingURL=popup.js.map