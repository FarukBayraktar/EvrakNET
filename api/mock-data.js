export const users = [
  { email: 'admin@evraknet.com', password: '123456' },
  { email: 'farukbayraktar@evraknet.com', password: 'faruk123' },
  { email: 'cihankement@evraknet.com', password: 'cihan123' },
  { email: 'fatma@evraknet.com', password: 'fatma123' },
  { email: 'ali@evraknet.com', password: 'ali123' }
]

export const documents = [
  {
    evrakNo: '2025001',
    baslik: 'Fatura Onayı',
    aciklama: '2025 yılı Ocak ayı fatura onayı.',
    olusturulmaTarihi: '2025-06-10',
    durum: 'Beklemede',
    birim: 'Muhasebe',
    personel: 'Ahmet Y.',
    gecmis: [
      { tarih: '2025-06-10', personel: 'Ahmet Y.', aciklama: 'Evrak oluşturuldu.' }
    ]
  },
  {
    evrakNo: '2025002',
    baslik: 'Teknik Rapor',
    aciklama: 'Makine bakım teknik raporu.',
    olusturulmaTarihi: '2025-06-12',
    durum: 'İşlemde',
    birim: 'Teknik',
    personel: 'Mehmet K.',
    gecmis: [
      { tarih: '2025-06-12', personel: 'Mehmet K.', aciklama: 'Rapor oluşturuldu.' },
      { tarih: '2025-06-13', personel: 'Mehmet K.', aciklama: 'İnceleme başlatıldı.' }
    ]
  },
  {
    evrakNo: '2025003',
    baslik: 'Personel İzin Talebi',
    aciklama: 'Ayşe A. 10 günlük izin talep etti.',
    olusturulmaTarihi: '2025-06-15',
    durum: 'Tamamlandı',
    birim: 'İnsan Kaynakları',
    personel: 'Ayşe A.',
    gecmis: [
      { tarih: '2025-06-15', personel: 'Ayşe A.', aciklama: 'İzin talebi oluşturuldu.' },
      { tarih: '2025-06-16', personel: 'Fatma K.', aciklama: 'Onaylandı.' }
    ]
  },
  {
    evrakNo: '2025004',
    baslik: 'Satın Alma Talebi',
    aciklama: 'Ofis için yeni bilgisayar alımı.',
    olusturulmaTarihi: '2025-06-18',
    durum: 'İşlemde',
    birim: 'Satın Alma',
    personel: 'Ali V.',
    gecmis: [
      { tarih: '2025-06-18', personel: 'Ali V.', aciklama: 'Talep oluşturuldu.' },
      { tarih: '2025-06-19', personel: 'Mehmet K.', aciklama: 'Teklifler toplanıyor.' }
    ]
  },
  {
    evrakNo: '2025005',
    baslik: 'Bakım Planı',
    aciklama: 'Yazıcıların yıllık bakımı.',
    olusturulmaTarihi: '2025-06-20',
    durum: 'İptal',
    birim: 'Teknik',
    personel: 'Fatma K.',
    gecmis: [
      { tarih: '2025-06-20', personel: 'Fatma K.', aciklama: 'Bakım planı oluşturuldu.' },
      { tarih: '2025-06-21', personel: 'Fatma K.', aciklama: 'Plan iptal edildi.' }
    ]
  },
  {
    evrakNo: '2025006',
    baslik: 'Gider Raporu',
    aciklama: '2025 yılı ilk yarı gider raporu.',
    olusturulmaTarihi: '2025-06-22',
    durum: 'Beklemede',
    birim: 'Muhasebe',
    personel: 'Mehmet K.',
    gecmis: [
      { tarih: '2025-06-22', personel: 'Mehmet K.', aciklama: 'Rapor oluşturuldu.' }
    ]
  }
] 