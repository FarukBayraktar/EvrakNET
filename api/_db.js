import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://admin:admin@evraknetcluster.zfi8cma.mongodb.net/?retryWrites=true&w=majority&appName=EvrakNETCluster'
const options = {}

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default clientPromise 