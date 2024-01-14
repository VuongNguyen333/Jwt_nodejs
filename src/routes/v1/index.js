import express from 'express'
import { auth } from './authRoute'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from './userRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ 'message': 'API_V1 ready to use' })
})

Router.use('/auth', auth)
Router.use('/users', userRoute)

export const APIs_V1 = Router