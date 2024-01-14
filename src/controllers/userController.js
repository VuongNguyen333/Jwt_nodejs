import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import { resp } from '~/utils/reponse'
import { status } from '~/utils/constants'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    return res.status(StatusCodes.CREATED).json(resp.reponse(createdUser, status.RESP_SUCC, 'OK'))
  } catch (error) { next(error) }
}

const getAllUser = async (req, res, next) => {
  try {
    const listUsers = await userService.getAllUser()
    res.status(StatusCodes.OK).json(resp.reponse(listUsers, status.RESP_SUCC, 'OK'))
  } catch (error) { next(error) }
}

const deleteById = async (req, res, next) => {
  try {
    await userService.deleteUserById(req.params.id)
    res.status(StatusCodes.OK).json(resp.reponse(null, status.RESP_SUCC, 'OK'))
  } catch (error) { next(error) }
}

const noDeleteById = async (req, res, next) => {
  try {
    await userService.deleteUserById(req.params.id)
    delete req.user
    res.status(StatusCodes.OK).json(resp.reponse(null, status.RESP_SUCC, 'OK'))
  } catch (error) { next(error) }
}

export const userController = {
  createNew,
  getAllUser,
  deleteById,
  noDeleteById
}