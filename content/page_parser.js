// content/page_parser.js

/**
 * Bu dosya, eklentinin "Saha Ajanı"dır.
 * Sayfanın DOM'unu page-agent ile okuyup, temizlenmiş metni Merkez Üsse (Service Worker) gönderecek mantığı içerir.
 */

import { PageAgent } from '@alibaba/page-agent';

export async function sayfayiAnalizEt() {
    try {
        // 1. Page-Agent'ı başlat
        const agent = new PageAgent();
        
        // 2. O anki sayfanın DOM yapısını okumasını ve temizlemesini iste
        const temizlenmisMetin = await agent.getDOMText(document);

        // 3. Eğer sayfa boşsa veya okunamadıysa hata fırlat (Hata Yönetimi)
        if (!temizlenmisMetin || temizlenmisMetin.length < 50) {
            throw new Error("Sayfada yeterli sözleşme metni bulunamadı.");
        }

        // 4. Temiz metni geri döndür (Bu metin daha sonra LLM'e gidecek)
        return temizlenmisMetin;

    } catch (error) {
        // Beklenmeyen bir hata olursa sessizce çökme, raporla!
        console.error("DOM Okuma Hatası:", error.message);
        return null;
    }
}