import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'api', 'mock-documents.json')

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    res.status(200).json(data)
    return
  }
  if (req.method === 'POST') {
    // Mock update: just echo back the updated document, no persistence
    const updatedDoc = req.body
    res.status(200).json({ success: true, document: updatedDoc })
    return
  }
  res.status(405).json({ error: 'Method not allowed' })
} 