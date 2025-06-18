import clientPromise from './_db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Email ve şifre zorunlu' })
    return
  }
  const client = await clientPromise
  const db = client.db('evraknet')
  const users = db.collection('users')
  const user = await users.findOne({ email, password })
  if (!user) {
    res.status(401).json({ message: 'Geçersiz email veya şifre' })
    return
  }
  const isAdmin = email === 'admin@evraknet.com'
  const token = 'mock-token-' + Math.random().toString(36).substr(2)
  res.status(200).json({ token, isAdmin })
} 