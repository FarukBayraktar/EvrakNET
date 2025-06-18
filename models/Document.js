import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  evrakNo: String,
  baslik: String,
  aciklama: String,
  olusturulmaTarihi: String,
  durum: String,
  birim: String,
  personel: String,
  drive: String,
  gecmis: [
    {
      tarih: String,
      personel: String,
      aciklama: String
    }
  ]
})

export default mongoose.models.Document || mongoose.model('Document', documentSchema)
