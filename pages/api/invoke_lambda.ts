import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from "aws-sdk";
import { Resource } from "sst";

//Create an instance of the AWS Lambda service client. This instance allows you to interact with AWS Lambda to perform operations such as invoking Lambda functions.
const lambdaService = new AWS.Lambda({
    region: "us-east-1"
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    const params = {
        FunctionName: Resource.GetTotalSubscribers.name,
        InvocationType: 'RequestResponse', 
    }

    //Send a request to invoke the get_subscribers function. '.promise()' converts the AWS SDK request into a promise, allowing you to use 'await' for asynchronous handling.
    const result = await lambdaService.invoke(params).promise();
    console.log("Response from Lambda service:", result);
    //'result.Payload' is the JSON string that is returned by the get_subscribers function. 'JSON.parse()' converts the JSON string into a JavaScript object, allowing you to access the data returned by the lambda function.
    const payload = JSON.parse(result.Payload as string);
    console.log("Return value of lambda function:", payload);

    res.status(200).json(payload);
    
}