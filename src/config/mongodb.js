import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'
//khoi tao null vi chua connect db
let trelloDatabaseInstance = null

//khoi tao doi tuong ket noi mongodb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  //Ket noi toi MongoDB atlas co URI da khai bao
  await mongoClientInstance.connect()
  //Ket noi thanh cong thi lay ra Db theo ten va gan nguoc lai bien trelloDbInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Connect to DB first!')
  return trelloDatabaseInstance
}