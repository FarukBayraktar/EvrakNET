export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' })
    return
  }
  const isAdmin = email === 'admin@evraknet.com'
  const token = 'mock-token-' + Math.random().toString(36).substr(2)
  res.status(200).json({ token, isAdmin })
} 