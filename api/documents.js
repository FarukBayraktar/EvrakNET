import clientPromise from './_db'

export default async function handler(req, res) {
  const client = await clientPromise
  const db = client.db('evraknet')
  const docs = db.collection('documents')

  if (req.method === 'GET') {
    const allDocs = await docs.find({}).toArray()
    res.status(200).json(allDocs)
    return
  }
  if (req.method === 'POST') {
    const doc = req.body
    if (!doc.evrakNo) {
      res.status(400).json({ message: 'Evrak No zorunlu' })
      return
    }
    const existing = await docs.findOne({ evrakNo: doc.evrakNo })
    if (existing) {
      await docs.updateOne({ evrakNo: doc.evrakNo }, { $set: doc })
      res.status(200).json({ message: 'Güncellendi', document: doc })
    } else {
      await docs.insertOne(doc)
      res.status(200).json({ message: 'Eklendi', document: doc })
    }
    return
  }
  res.status(405).json({ message: 'Method not allowed' })
} 