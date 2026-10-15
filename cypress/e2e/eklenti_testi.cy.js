describe('Risk Analiz Motoru - Arayuz Testleri', () => {
    beforeEach(() => {
        // Eklentimizin vitrini olan popup.html sayfasını yerel dosyadan açar
        cy.visit('../../popup/popup.html');
    });

    it('Mutlu Yol: Arayüz yüklenmeli, uyarılar görünmeli ve buton çalışmalı', () => {
        // 1. Ödev kuralı: Hukuki tavsiye vermez uyarısı ekranda mı?
        cy.get('body').should('contain.text', 'hukuki tavsiye vermez');

        // 2. Buton var mı ve tıklanabilir mi?
        cy.get('#analizBtn').should('be.visible').and('not.be.disabled');

        // 3. Butona basıldığında durumu "Analiz Ediyor" vs. gibi değişiyor mu?
        cy.get('#analizBtn').click();
        cy.get('#analizBtn').should('contain.text', 'Analiz Ediyor').or('contain.text', 'Sayfa Okunuyor');
    });

    it('Dürüstlük Anı: İletişim koptuğunda sessizce çökmek yerine hata mesajı vermeli', () => {
        // Butona tıkla
        cy.get('#analizBtn').click();

        // Arka plan (service_worker) şu an Cypress ortamında olmadığı için doğal olarak bağlantı kopacak.
        // Sistem donup kalmak yerine "İletişim Hatası" (veya yazdığımız hata mesajını) basmalı.
        cy.get('#sonuc', { timeout: 4000 })
          .should('be.visible')
          .and('contain.text', 'Hata');
    });
});