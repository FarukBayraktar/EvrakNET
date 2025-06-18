import { documents } from './mock-data'

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(documents)
    return
  }
  if (req.method === 'POST') {
    const doc = req.body
    if (!doc.evrakNo) {
      res.status(400).json({ message: 'Evrak No zorunlu' })
      return
    }
    const idx = documents.findIndex(d => d.evrakNo === doc.evrakNo)
    if (idx !== -1) {
      documents[idx] = doc
      res.status(200).json({ message: 'Güncellendi', document: doc })
    } else {
      documents.push(doc)
      res.status(200).json({ message: 'Eklendi', document: doc })
    }
    return
  }
  if (req.method === 'DELETE') {
    const { evrakNo } = req.body
    const idx = documents.findIndex(d => d.evrakNo === evrakNo)
    if (idx !== -1) {
      documents.splice(idx, 1)
      res.status(200).json({ message: 'Silindi' })
    } else {
      res.status(404).json({ message: 'Evrak bulunamadı' })
    }
    return
  }
  res.status(405).json({ message: 'Method not allowed' })
} 