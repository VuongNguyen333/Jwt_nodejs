import express from 'express'
import { userController } from '~/controllers/userController'
import { middlewareController } from '~/middlewares/middlewareController'
const Router = express.Router()

Router.route('/')
  .get(middlewareController.verifyToken, userController.getAllUser)
Router.route('/delete/:id')
  .delete(middlewareController.verifyTokenAndAdminAuth, userController.deleteById)
export const userRoute = Router