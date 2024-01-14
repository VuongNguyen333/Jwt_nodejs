/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from '~/routes/v1'
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

var cookieParser = require('cookie-parser')
const START_SERVER = () => {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use('/v1', APIs_V1)
  //Middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware)
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log('Hello Vuong, Sever is running')
  })

  exitHook(() => {
    CLOSE_DB()
  })
}

CONNECT_DB()
  .then(() => console.log('Connected to MongoDb Cloud Atlas!'))
  .then(() => START_SERVER())
  .catch(error => {
    console.error(error)
    process.exit(0)
  })


