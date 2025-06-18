import dbConnect from '../lib/dbConnect.js'

export default async function handler(req, res) {
  await dbConnect()

  const { evrakNo } = req.query
  const doc = await Document.findOne({ evrakNo })
  if (!doc) return res.status(404).json({ message: 'Evrak bulunamadı' })
  res.status(200).json(doc)
}
