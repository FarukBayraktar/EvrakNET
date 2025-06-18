import { documents } from './mock-data'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  const { evrakNo } = req.query
  const doc = documents.find(d => d.evrakNo === evrakNo)
  if (!doc) {
    res.status(404).json({ message: 'Evrak bulunamadı' })
    return
  }
  res.status(200).json(doc)
} 