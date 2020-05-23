import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

const ddbClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const mediaBucket = process.env.S3_BUCKET
  const expiration = process.env.SIGNED_URL_EXPIRATION
  const todosTable = process.env.TODOS_TABLE

  const imageId = uuid.v4()

  const s3 = new AWS.S3({ signatureVersion: 'v4' })

  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: mediaBucket,
    Key: imageId,
    Expires: expiration
  })

  const imageUrl = `https://${bucket}.s3.amazonaws.com/${imageId}`

  const updatedTodoURL = {
    TableName: todosTable,
    Key: { todoId: todoId },
    UpdateExpression: 'set attachmentUrl = :a',
    ExpressionAttributeValues: {
      ':a': imageUrl
    },
    ReturnValues: 'UPDATED_NEW'
  }

  await ddbClient.update(updatedTodoURL).promise()
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      iamgeUrl: imageUrl,
      uploadUrl: signedUrl
    })
  }
}
