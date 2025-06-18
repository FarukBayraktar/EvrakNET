import { users } from './mock-data'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }
  const { email, password } = req.body
  if (users.find(u => u.email === email)) {
    res.status(400).json({ message: 'Bu email ile kayıtlı kullanıcı var' })
    return
  }
  users.push({ email, password })
  res.status(200).json({ message: 'Kayıt başarılı' })
} 