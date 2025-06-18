import dbConnect from '../lib/dbConnect.js'
import User from '../models/User.js'

export default async function handler(req, res) {
  await dbConnect()

  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Email veya şifre hatalı' })
  }

  res.status(200).json({
    token: 'fake-token', // Gerçek uygulamada JWT eklenir
    isAdmin: user.isAdmin
  })
}
