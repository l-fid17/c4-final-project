import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { parseUserId } from '../../auth/utils'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

const ddbClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  const authHeader = event.headers.Authorization
  const splitted = authHeader.split(' ')
  const userId = parseUserId(splitted[1])

  const result = await ddbClient
    .query({
      TableName: todosTable,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },

      ScanIndexForward: false
    })
    .promise()

  const todos = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      todos
    })
  }
}
