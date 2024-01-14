import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().required().min(6).max(50).trim().strict(),
    email: Joi.string().required().min(6).max(256).trim().strict(),
    password: Joi.string().required().min(6).trim().strict()
  })
  try {
    //aboardEarly tra? ve` nhieu` loi~
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //validate hop le thi` chuyen tiep sang tang` controller
    next()
  } catch (error) {
    // eslint-disable-next-line no-console
    // console.log(error)
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  createNew
}