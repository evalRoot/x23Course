import { SERVER_API } from "../const"

export default async function request(requestName, method, body = {}) {
  const requestObj = {
    method: method,
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
    }
  }

  if (method === 'POST') {
    requestObj.body = JSON.stringify(body)
  }

  const response = await fetch(`${SERVER_API}/${requestName}`, requestObj)
  let json = {}

  try {
    if (response) {
      json = await response.json()

      if (response.status === 404) {
        json = {
          ...json,
          status: 404
        }
      }

      return json
    }
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
}
