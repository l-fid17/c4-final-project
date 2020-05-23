import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
// import { parseUserId } from '../../auth/utils'
import { getUserId } from '../utils'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const ddbClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const todoId = uuid.v4()

  // const authHeader = event.headers.Authorization
  // const splitted = authHeader.split(" ")
  // const token = splitted[1]

  const todo = {
    todoId,
    userId: getUserId(event),
    ...newTodo
  }

  await ddbClient
    .put({
      TableName: todosTable,
      Item: todo
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      todo
    })
  }
}
