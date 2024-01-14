import Jwt from 'jsonwebtoken'
import ApiError from '~/utils/ApiError'
import { env } from '~/config/environment'
import { StatusCodes } from 'http-status-codes'

const verifyToken = (req, res, next) => {
  const token = req.headers.token
  if (token) {
    const accessToken = token.split(' ')[1]
    Jwt.verify(accessToken, env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        next(new ApiError(StatusCodes.FORBIDDEN, 'Token is not valid'))
      }
      req.user = user
      next()
    })
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json('Token is missing or invalid')
  }
}

const verifyTokenAndAdminAuth = (req, res, next) => {
  middlewareController.verifyToken(req, res, () => {
    if (req.user._id === req.params.id || req.user._admin) {
      next()
    } else {
      res.status(StatusCodes.FORBIDDEN).json('You are not allowed to delete other')
    }
  })
}

export const middlewareController = {
  verifyToken,
  verifyTokenAndAdminAuth
}