//functions/get_subscribers.ts --> Backend (lamda function)
//Create the function that retrieves the latest number of subscribers from the DynamoDB table.

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Resource} from "sst";

export const handler = async() => {
  
  try {

    //Define the time window for the number of subscribers.
    const currentTime = Date.now(); //Timestamps are often represented as Unix timestamps, which are the number of milliseconds that have elapsed since January 1, 1970. These timestamps can be stored as numbers in a DynamoDB table.
    const twentyFourHoursAgo = currentTime - 5 * 60 * 1000; // Actual data: 24 * 60 * 60 * 1000
    console.log("Current time:", currentTime);
    console.log("Twenty-four hours ago:", twentyFourHoursAgo);

    //Initialize a new DynamoDB client and define the QueryCommand to query the number of subscribers regarding your time window.
    console.log("Fetching data from DynamoDB table...");
    const client = new DynamoDBClient({});
    const command = new QueryCommand({
      TableName: Resource.NewsletterSubscribersTable.name,
      IndexName: "TimeStampIndex",
      KeyConditionExpression: "#GSIhashKey = :allitems AND #timestamp BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#GSIhashKey": "fixedHashKey",
        "#timestamp": "timeStamp",
      },
      ExpressionAttributeValues: {
        ":allitems": {S: "ALL_ITEMS"},
        ":start": { N: twentyFourHoursAgo.toString() },
        ":end": { N: currentTime.toString() }
      },
      ProjectionExpression: "subscribers",
      Select: "SPECIFIC_ATTRIBUTES",
    });
    
    //Send the QueryCommand to the DynamoDB table.
    const response = await client.send(command);
    console.log("Total subscribers fetched:", response.Items);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "Query succeeded",
        data: response.Items,
      }),
    };

  } catch (error) {
    //Error handling

    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: "error",
          message: error.message,
        }),
      };

    } else {
      // Handle the case where the error is not an instance of Error.
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: "error",
          message: "An unknown error occurred.",
        }),
        };
      }

    }

};