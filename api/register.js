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
  const existing = await users.findOne({ email })
  if (existing) {
    res.status(400).json({ message: 'Bu email ile kayıtlı kullanıcı var' })
    return
  }
  await users.insertOne({ email, password })
  res.status(200).json({ message: 'Kayıt başarılı' })
} 