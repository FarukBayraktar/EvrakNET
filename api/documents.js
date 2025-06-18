import dbConnect from '../lib/dbConnect.js'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    const docs = await Document.find()
    return res.status(200).json(docs)
  }

  if (req.method === 'POST') {
    const yeniDoc = await Document.create(req.body)
    return res.status(201).json(yeniDoc)
  }

  res.status(405).json({ message: 'Method not allowed' })
}
