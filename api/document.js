import clientPromise from './_db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  const { evrakNo } = req.query
  const client = await clientPromise
  const db = client.db('evraknet')
  const docs = db.collection('documents')
  const doc = await docs.findOne({ evrakNo })
  if (!doc) {
    res.status(404).json({ message: 'Evrak bulunamadı' })
    return
  }
  res.status(200).json(doc)
} 