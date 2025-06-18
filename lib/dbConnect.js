import mongoose from 'mongoose'

// .env KULLANMIYORUZ — bağlantı direkt burada:
const MONGO_URI = 'mongodb+srv://admin:<admin@evraknetcluster.zfi8cma.mongodb.net/?retryWrites=true&w=majority&appName=EvrakNETCluster'
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

export default dbConnect
