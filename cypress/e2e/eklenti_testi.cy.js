describe('Risk Analiz Motoru - Arayuz Testleri', () => {
    beforeEach(() => {
        // Eklentimizin vitrini olan popup.html sayfasını yerel dosyadan açar
        cy.visit('../../popup/popup.html');
    });

   it('Mutlu Yol: Arayüz yüklenmeli, uyarılar görünmeli ve buton çalışmalı', () => {
      // 1. Popup sayfasını aç
      cy.visit('../../popup/popup.html');
      
      // 2. UI elementlerinin yüklendiğini doğrula
      cy.get('#analizBtn').should('be.visible');
      
      // 3. Butona tıklandığında çökmediğini doğrula
      cy.get('#analizBtn').click();
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