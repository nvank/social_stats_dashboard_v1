//functions/sync_subscribers.ts --> Backend (Lamda function)
//Create the function to fetch the current number of subscribers from the Kit API and store it into a DynamoDB table.

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import axios from "axios";
import { Resource } from "sst";
import { v4 as uuidv4 } from "uuid";


const apiUrl = "https://api.convertkit.com/v3/subscribers";

export const handler = async() => {

  try {

    //Fetch the number of subscribers from the Kit API.
    console.log("Fetching data from Kit API...");
    const response = await axios.get(apiUrl, {
      params: {
        api_secret: Resource.KitApiKey.value,
      },
    });

    const totalSubscribers = response.data.total_subscribers;
    console.log("Total subscribers fetched:", totalSubscribers);

    // Store the fetched data in a DynamoDB table.
    const uniqueId = uuidv4(); //Create a unique random number.
    const timestamp = Date.now(); //Create a timestamp. Timestamps are often represented as Unix timestamps, which are the number of milliseconds that have elapsed since January 1, 1970. These timestamps can be stored as numbers in a DynamoDB table.
    
    console.log("Generated unique ID:", uniqueId);
    console.log("Current timestamp:", timestamp);

    //Initialize a new DynamoDB client and define the PutItemCommand to store the number of subscribers as a new item in the DynamoDB table.
    const client = new DynamoDBClient({});
    const command = new PutItemCommand({
      TableName: Resource.NewsletterSubscribersTable.name,
      Item: {
        id: { S: uniqueId },
        timeStamp: { N: timestamp.toString() },
        subscribers: { N: totalSubscribers.toString() },
        fixedHashKey: {S: "ALL_ITEMS"},
      },
    });

    //Send the PutItemCommand to the DynamoDB table.
    console.log("Sending PutItemCommand to DynamoDB...");
    const result = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data stored successfully." }),
    };

  } catch (error) {
    //Error handling
    console.error("Error occurred:", error);

    if (error instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };

    } else {
      //Handle the case where the error is not an instance of Error.
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "An unknown error occurred." }),
      };
    }

  }

};