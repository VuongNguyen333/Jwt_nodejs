import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'Users'
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().min(6).max(50).trim().strict(),
  email: Joi.string().required().min(6).max(256).trim().strict(),
  password: Joi.string().required().min(6).trim().strict(),
  _admin: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (userId) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
  } catch (error) { throw new Error(error) }
}

const findOneByUsername = async (data) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ username: data })
  } catch (error) { throw new Error(error) }
}

const getAllUser = async () => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).find({ _destroy: false }).toArray()
  } catch (error) { throw new Error(error) }
}

const deleteUserById = async (userId) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) })
  } catch (error) { throw new Error(error) }
}

const noDeleteById = async (userId, updateData) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
  } catch (error) { throw new Error(error) }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByUsername,
  getAllUser,
  deleteUserById,
  noDeleteById
}