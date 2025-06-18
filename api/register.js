import dbConnect from '../lib/dbConnect.js'
import User from '../models/User.js'

export default async function handler(req, res) {
  await dbConnect()

  const { email, password } = req.body
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: 'Kullanıcı zaten kayıtlı' })

  const user = await User.create({ email, password, isAdmin: false })
  res.status(201).json({ message: 'Kayıt başarılı', user })
}
