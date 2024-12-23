This repo is related with the article “How We Built a Social Stats Dashboard Using SST and Next.js”, published on [AWS Fundamentals](https://blog.awsfundamentals.com/social-stats-dashboard-sst-nextjs).

## Project Goal
The goal of this little project is to set up a crawler that retrieves the total number of our AWS Fundamentals Newsletter subscribers on a daily basis and display the current number on a dashboard.

## Technologies & Frameworks
We use [Serverless Stack (SST v3)](https://sst.dev/docs) as the basic framework for our application and AWS Lambda to set up our backend features. This means that we highly build upon the Serverless Computing approach. SST is a framework based on the concept of Serverless and IaC. It abstracts the configuration of your infrastructure away from you even more than the AWS CDK does. To create the user interface for our Social Stats Dashboard, we use a Next.js frontend. 

## Architecture
The user accesses the Social Stats Dashboard with the current number of the AWS Fundamentals Newsletter subscribers via a simple, non-interactive Next.js site. The source of information for the number of newsletter subscribers is Kit - a third party application. So our first Lambda function, triggered every day at midnight, is responsible for fetching the current number of subscribers from the Kit API and store it in a DynmoDB table. The DynamoDB table serves our application as a database to store the number of subscribers with a timestamp. To finally display the current number of newsletter subscribers on the Next.js site, a second Lambda function retrieves the latest entry from the DynamoDB table every time the site is (re)loaded.

## Getting Started
The [SST CLI](https://sst.dev/docs/reference/cli/) helps us to build, test and deploy our application. 
1. Create a Next.js project, give it a name and go with all default configurations: `npx create-next-app@latest enter-your-name-here`
2. Direct to the project directory and initialize SST for the project: `npx sst@latest init` (❗️Make sure to properly install your dependencies.)
3. Develop and test the application locally by deploying it in a development (dev) stage: `npx sst dev`

As long as `npx sst dev` is running in our terminal, all changes to the code are immediately transferred to the infrastructure, the frontend and the backend. Each proces (deployment, backend functions, frontend) runs in a separate window in our terminal, selectable via the side bar. We can access our frontend locally in a browser on http://localhost:3000 now.

## Infrastructure: SST components
At first, we work on the code in the `sst.config.ts` file. This is where we define the [SST components](https://sst.dev/docs/components/). You can add a component to your application by using the corresponding constructor: `new sst.aws.*(name, args, opts?)`

For our Social Stats Dashboard, we work with five components: a DynamoDB table, a Cron job, a Function, a Next.js Site and a Secret. All of them need to be defined by a constructor within the executing function (`run()`) in our `sst.config.ts` file.

## Backend: Lambda Functions
The Social Stats Dashboard has two features and both of them are realized with a lambda function:
- Fetch the total number of newsletter subscribers from the Kit API and store them in the Newsletter Subscribers Table. → `functions/sync_subscribers.ts`
- Retrieve the latest number of newsletter subscriber from the Newsletter Subscribers Table to display it on our dashboard. → `functions/get_subscribers.ts`

A Lambda function (in Node.js) is defined by a Lambda handler, an event object and a context object:
```
export const handler = async (event, context) => {
  // Add the stuff that the function is supposed to do here.
};
```

## Frontend: Next.js Site
We have already created a Nextjs SST component which deploys a Next.js application rooted in the `app` directory to AWS. In our `page.tsx` file (in the `app` directory), we work with the `“use client”` directive and create a `SocialMediaCrawler()` function which is executed every time our Next.js site is (re)loaded. The Social Media Crawler mainly consist of two parts:
- Retrieve the current number of subscribers by invoking the get_subscribers lambda function.
- Display the current number of subscribers on a web interface.

## Learn More
To learn more about this project and SST, check out the following resources:

- [How We Built a Social Stats Dashboard Using SST and Next.js](https://blog.awsfundamentals.com/social-stats-dashboard-sst-nextjs) - Find out all the details in the blog post related to this repo.
- [SST Docs](https://nextjs.org/learn) - Take a look into the official SST documentation.

Feel free to dive into some other exciting topics on [AWS Fundamentals](awsfundamentals.com) to learn AWS for the real world.
