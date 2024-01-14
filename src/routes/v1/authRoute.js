import express from 'express'
import { authController } from '~/controllers/authController'
import { userController } from '~/controllers/userController'
import { middlewareController } from '~/middlewares/middlewareController'
import { userValidation } from '~/validations/userValidation'
const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)
Router.route('/login')
  .get(authController.checkLogin)
Router.route('/refresh')
  .post(authController.requestRefreshToken)
Router.route('/logout')
  .post(middlewareController.verifyToken, authController.userLogout)
export const auth = Router