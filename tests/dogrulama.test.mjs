// Deterministik doğrulama katmanının birim testleri. Çalıştırma: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dogrula } from '../background/dogrulama.js';

const SAYFA = `Kullanım Koşulları
İçeriğiniz üzerinde münhasır olmayan, telifsiz, alt lisanslanabilir ve dünya çapında bir lisans verirsiniz.
Hesabınızı kapatmanız halinde   satın aldığınız içerikler iade edilmez.`;

const madde = (orijinal_metin) => ({ kategori: 'Fikri Mülkiyet', orijinal_metin, sade_aciklama: 'Açıklama' });

test('sayfada birebir geçen alıntı doğrulanır', () => {
    const s = dogrula({ risk_skoru: 70, riskli_maddeler: [madde('telifsiz, alt lisanslanabilir ve dünya çapında bir lisans')] }, SAYFA);
    assert.equal(s.riskli_maddeler.length, 1);
    assert.equal(s.dogrulanamayan.length, 0);
});

test('boşluk, büyük harf ve tırnak farkları alıntıyı geçersiz kılmaz', () => {
    const s = dogrula({ risk_skoru: 70, riskli_maddeler: [madde('“HESABINIZI KAPATMANIZ HALİNDE satın aldığınız içerikler iade edilmez.”')] }, SAYFA);
    assert.equal(s.riskli_maddeler.length, 1);
});

test('sayfada olmayan (uydurma) alıntı ayrılır', () => {
    const s = dogrula({ risk_skoru: 90, riskli_maddeler: [madde('Verileriniz üçüncü taraflara satılabilir.')] }, SAYFA);
    assert.equal(s.riskli_maddeler.length, 0);
    assert.equal(s.dogrulanamayan.length, 1);
    assert.match(s.dogrulanamayan[0].sebep, /bulunamadı/);
});

test('çok kısa alıntı doğrulanmış sayılmaz', () => {
    const s = dogrula({ risk_skoru: 50, riskli_maddeler: [madde('lisans')] }, SAYFA);
    assert.equal(s.dogrulanamayan.length, 1);
});

test('eksik alanlı madde ayrılır', () => {
    const s = dogrula({ risk_skoru: 50, riskli_maddeler: [{ kategori: 'X', sade_aciklama: 'Y' }] }, SAYFA);
    assert.equal(s.dogrulanamayan.length, 1);
});

test('aralık dışı veya tam sayı olmayan skor reddedilir', () => {
    assert.throws(() => dogrula({ risk_skoru: 140, riskli_maddeler: [] }, SAYFA));
    assert.throws(() => dogrula({ risk_skoru: '80', riskli_maddeler: [] }, SAYFA));
});

test('nesne olmayan çıktı reddedilir', () => {
    assert.throws(() => dogrula(null, SAYFA));
    assert.throws(() => dogrula([], SAYFA));
});
