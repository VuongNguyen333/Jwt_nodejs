/* eslint-disable no-useless-catch */
import bcrypt from 'bcrypt'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/User'
import { authController } from '~/controllers/authController'
const createNew = async (reqBody) => {
  try {
    const isExistedUsername = await userModel.findOneByUsername(reqBody.username)
    if (isExistedUsername) {
      throw new ApiError(StatusCodes.CONFLICT, 'Username already exist!')
    }
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(reqBody.password, salt)
    const newUser = {
      ...reqBody,
      password: hashed
    }
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    return getNewUser
  } catch (error) { throw error }
}

const checkLogin = async (reqBody) => {
  try {
    const checkLogin = await userModel.findOneByUsername(reqBody.username)
    if (!checkLogin) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    // console.log(checkLogin)
    const validPassword = await bcrypt.compare(reqBody.password, checkLogin.password)
    if (!validPassword) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Wrong password!')
    }
    const accessToken = authController.generateAccessToken(checkLogin)
    const refreshToken = authController.generateRefreshToken(checkLogin)
    delete checkLogin.password
    return {
      ...checkLogin,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  } catch (error) { throw error }
}

const getAllUser = async () => {
  try {
    const listUsers = await userModel.getAllUser()
    return listUsers
  } catch (error) { throw error }
}

const deleteUserById = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist!')
    }
    await userModel.deleteUserById(userId)
  } catch (error) { throw error }
}

const noDeleteById = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist!')
    }
    const updateData = {
      ...user,
      _destroy: true
    }
    await userModel.deleteUserById(userId, updateData)
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  checkLogin,
  getAllUser,
  deleteUserById,
  noDeleteById
}