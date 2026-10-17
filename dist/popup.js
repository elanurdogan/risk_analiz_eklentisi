/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./popup/popup.js ***!
  \************************/
document.getElementById('analizBtn').addEventListener('click', async () => {
    const btn = document.getElementById('analizBtn');
    const sonucDiv = document.getElementById('sonuc');

    btn.disabled = true;
    btn.innerText = "⏳ Yapay Zeka Analiz Ediyor...";
    sonucDiv.innerHTML = "";

    try {
        const response = await chrome.runtime.sendMessage({ action: "ANALYZE_PAGE" });

        if (response.error) {
            sonucDiv.innerHTML = `<span style="color:red; font-weight:bold;">❌ Hata:</span> ${response.error}`;
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
                            <strong>${index + 1}. Kategori:</strong> ${madde.kategori} <br>
                            <hr style="border: 0; border-top: 1px solid #ffe082; margin: 8px 0;">
                            <span style="font-size: 12px; color: #555;"><i>"${madde.orijinal_metin}"</i></span> <br>
                            <hr style="border: 0; border-top: 1px solid #ffe082; margin: 8px 0;">
                            <strong>Sade Açıklama:</strong> ${madde.sade_aciklama}
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