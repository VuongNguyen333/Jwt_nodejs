
const reponse = (object, statusCode, message) => {
  return {
    object: object,
    statusCode: statusCode,
    message: message
  }
}

export const resp = {
  reponse
}