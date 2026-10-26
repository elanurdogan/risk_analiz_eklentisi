// background/dogrulama.js

/**
 * Deterministik doğrulama katmanı.
 * LLM'den gelen JSON'a körü körüne güvenilmez: şema kuralları kodla kontrol edilir ve
 * her riskli maddenin 'orijinal_metin' alıntısı gerçekten sayfa metninde geçiyor mu diye bakılır.
 * Alıntısı sayfada bulunamayan iddia geçersiz sayılır ve ayrı bir listede kullanıcıya gösterilir.
 */

// Karşılaştırma öncesi metni sadeleştirir: büyük/küçük harf, tırnak çeşitleri ve boşluklar eşitlenir.
export function normalizeEt(metin) {
    return String(metin)
        .toLocaleLowerCase('tr-TR')
        .replace(/[“”„«»″]/g, '"')
        .replace(/[‘’‚′`]/g, "'")
        .replace(/[–—]/g, '-')
        .replace(/…/g, '...')
        .replace(/\s+/g, ' ')
        .trim();
}

const MIN_ALINTI_UZUNLUGU = 15;

export function dogrula(llmCiktisi, sayfaMetni) {
    if (!llmCiktisi || typeof llmCiktisi !== 'object' || Array.isArray(llmCiktisi)) {
        throw new Error("Model geçerli bir JSON nesnesi döndürmedi.");
    }

    const skor = llmCiktisi.risk_skoru;
    if (!Number.isInteger(skor) || skor < 0 || skor > 100) {
        throw new Error(`Geçersiz risk skoru: ${JSON.stringify(skor)} (0-100 arası tam sayı olmalı).`);
    }
    if (!Array.isArray(llmCiktisi.riskli_maddeler)) {
        throw new Error("Modelin çıktısında 'riskli_maddeler' listesi yok.");
    }

    const kaynak = normalizeEt(sayfaMetni);
    const dogrulanan = [];
    const dogrulanamayan = [];

    for (const madde of llmCiktisi.riskli_maddeler) {
        const alanlarTamam = madde && ['kategori', 'orijinal_metin', 'sade_aciklama']
            .every((alan) => typeof madde[alan] === 'string' && madde[alan].trim() !== '');
        if (!alanlarTamam) {
            dogrulanamayan.push({ ...madde, sebep: "Zorunlu alanlar eksik." });
            continue;
        }

        const alinti = normalizeEt(madde.orijinal_metin).replace(/^["']+|["']+$/g, '').trim();
        if (alinti.length < MIN_ALINTI_UZUNLUGU) {
            dogrulanamayan.push({ ...madde, sebep: "Alıntı doğrulanamayacak kadar kısa." });
        } else if (!kaynak.includes(alinti)) {
            dogrulanamayan.push({ ...madde, sebep: "Alıntı sayfa metninde birebir bulunamadı." });
        } else {
            dogrulanan.push(madde);
        }
    }

    return { risk_skoru: skor, riskli_maddeler: dogrulanan, dogrulanamayan };
}
