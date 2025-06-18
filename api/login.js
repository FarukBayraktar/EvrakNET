import { users } from './mock-data'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  const { email, password } = req.body
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
    res.status(401).json({ message: 'Geçersiz email veya şifre' })
    return
  }
  const isAdmin = email === 'admin@evraknet.com'
  const token = 'mock-token-' + Math.random().toString(36).substr(2)
  res.status(200).json({ token, isAdmin })
} 