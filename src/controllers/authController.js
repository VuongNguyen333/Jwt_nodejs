/* eslint-disable no-undef */
import { userService } from '~/services/userService'
import { StatusCodes } from 'http-status-codes'
import { resp } from '~/utils/reponse'
import { status } from '~/utils/constants'
import Jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

let refreshTokens = []
const generateAccessToken = (checkLogin) => {
  return Jwt.sign(
    {
      _id: checkLogin._id.toString(),
      _admin: checkLogin._admin
    },
    env.JWT_ACCESS_KEY,
    { expiresIn: '10s' }
  )
}

const generateRefreshToken = (checkLogin) => {
  return Jwt.sign(
    {
      _id: checkLogin._id.toString(),
      _admin: checkLogin._admin
    },
    env.JWT_REFRESH_TOKEN,
    { expiresIn: '365d' }
  )
}

const checkLogin = async (req, res, next) => {
  try {
    const checkLogin = await userService.checkLogin(req.body)
    res.cookie('refreshToken', checkLogin.refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    refreshTokens.push(checkLogin.refreshToken)
    delete checkLogin.refreshToken
    res.status(StatusCodes.OK).json(resp.reponse(checkLogin, status.RESP_SUCC, 'OK'))
  } catch (error) { next(error) }
}

const requestRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    res.status(StatusCodes.UNAUTHORIZED).json('You are not authenticated!')
  }
  if (!refreshTokens.includes(refreshToken)) {
    res.status(StatusCodes.FORBIDDEN).json('Refresh token is not valid')
  }
  Jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN, (err, user) => {
    if (err) { next(err) }
    else {
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
      const newAccessToken = authController.generateAccessToken(user)
      const newRefreshToken = authController.generateRefreshToken(user)
      refreshTokens.push(newRefreshToken)
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })
      res.status(StatusCodes.OK).json({ accessToken: newAccessToken })
    }
  })
}

const userLogout = async (req, res) => {
  res.clearCookie('refreshToken')
  refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
  res.status(StatusCodes.OK).json('Logged out')
}

export const authController = {
  checkLogin,
  requestRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  userLogout
}