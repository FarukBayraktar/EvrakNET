import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'api', 'mock-documents.json')

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { evrakNo } = req.query
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const doc = data.find(d => d.evrakNo === evrakNo)
  if (!doc) {
    res.status(404).json({ error: 'Document not found' })
    return
  }
  res.status(200).json(doc)
} 