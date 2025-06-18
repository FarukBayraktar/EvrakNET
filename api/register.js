import { users } from './mock-data'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Email ve şifre zorunlu' })
    return
  }
  if (!users.find(u => u.email === email)) {
    users.push({ email, password })
  }
  res.status(200).json({ message: 'Kayıt başarılı' })
} 