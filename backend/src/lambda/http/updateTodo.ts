import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const ddbClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const updateTodo = {
    TableName: todosTable,
    Key: { todoId: todoId },
    UpdateExpression: 'set #n = :a, dueDate = :b, done = :c',
    ExpressionAttributeValues: {
      ':a': updatedTodo['name'],
      ':b': updatedTodo.dueDate,
      ':c': updatedTodo.done
    },
    ExpressionAttributeNames: {
      '#n': 'name'
    },
    ReturnValues: 'UPDATED_NEW'
  }

  await ddbClient.update(updateTodo).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
