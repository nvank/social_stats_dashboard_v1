//sst.config.ts --> Defines the infrastructure resources for all backend & frontend features (which means does the magic).

/// <reference path="./.sst/platform/config.d.ts" />

export default $config({

  //Default configuration.
  app(input) {
    return {
      name: "awsfundamentals-social-stats-v1",
      region: "us-east-1",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },

  async run() {
    
    //Create the DynamoDB table to store the total number of newsletter subscribers (from Kit).
    const table = new sst.aws.Dynamo("NewsletterSubscribersTable", {
      fields: {
        id: "string",
        timeStamp: "number",
        fixedHashKey: "string",
      },
      primaryIndex: { hashKey: "id"}, 
      globalIndexes: {
        TimeStampIndex: { hashKey: "fixedHashKey", rangeKey: "timeStamp"},
      }
    });

    //Create a Secret for the Kit API key.
    const secret = new sst.Secret("KitApiKey");
    
    //Create the Cron job to fetch the total number of newsletter subscribers from the DynamoDB Table every day at midnight UTC.
    const cron = new sst.aws.Cron("SyncTotalSubscribers", {
      schedule: "cron(0/5 * * * ? *)", // The Cron job runs every day at midnight. Actual data: cron(0 0 * * ? *)
      job: { 
        handler: "functions/sync_subscribers.handler",
        // Link the DynamoDB table and Secret to the Cron job to grant permissions.
        link:[table, secret],
      }
    });

    //Create the Function component to fetch the total number of newsletter subscribers from the DynamoDB table.
    const lambda2 = new sst.aws.Function("GetTotalSubscribers", {
      handler: "functions/get_subscribers.handler",
      // Link the DynamoDB table to the function to grant permissions.
      link:[table],
    });

    //Create the Next.js app (frontend).
    const site = new sst.aws.Nextjs("SocialStatsDashboard", {
      link:[lambda2],
    });

    return {
      SiteUrl: site.url,
    };

  },

});
