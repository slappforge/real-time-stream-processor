# Real-Time Stream Processor

This sample demonstrates the use of AWS Lambda with AWS Kinesis and AWS DynamoDB to process real-time streaming data for clickstream analysis.

## Prerequisites

All the deployments of this application are based on Amazon AWS. To open the project, you will need the Sigma IDE which can be found at [Sigma IDE](https://sigma.slappforge.com). You will need to create an account and provide your AWS credentials to open the project (Your AWS credentials will not be acquired by SLAppForge under any circumstances).

## Usecase Description

Today, more than ever, e-commerce applications leverage web-traffic data to boost their conversion rates. Click-stream analytics play a huge role in deducing crucial marketing decisions. This sample demonstrates the use of related AWS services to create a basic real-time streaming data processor for clickstream analysis.

In this sample, activity records reported to a Kinesis Stream (click-stream) are fetched and validates if they are eligible to be used in click-stream analytics. An eligible sample record with the following JSON format is then inserted into a DynamoDB table (click-stream-table) for further processing.

```json
{
  "ip": "0.0.0.0",
  "timestamp": "2018-02-04T23:18:32.866Z",
  "browser": "Chrome",
  "url": "http://adroitlogic.com/products/ultraesb-x",
  "referrer": "http://adroitlogic.com",
  "os": "Windows",
  "country": "Sri Lanka",
  "language": "en-us"
}
```

To test this sample, another Lambda function is bundled, which exposes an API Gateway endpoint to put records to the Kinesis Stream used earlier.

## Getting Started

In order to get started, you just have to open the sample project from the Sigma IDE and deploy it in your AWS account. Then, the IDE will get a clone of this repository and commit it to your own GitHub account to allow you to keep playing with the source code.

## Deployment

Click on the deployment button and it should deploy all the resources that are required to run the application.

## Testing

After the deployment, you can test this sample application by sending an HTTP request to the created API Gateway (activity-stream-proxy). To find the endpoint URL, please follow these steps.

1. Sign in to the AWS Management Console, and then open the API Gateway console at [https://console.aws.amazon.com/apigateway/](https://console.aws.amazon.com/apigateway/ "Amazon API Gateway").
2. Make sure that you are signed in to the AWS region where you selected when creating the Sigma project.
3. On the API Gateway page, in the APIs list, select "activity-stream-proxy" API.
4. In the Stages navigation pane, expand the Prod stage, select POST on /report, and then copy the Invoke URL value in the format of https://{api-id}.execute-api.{region}.amazonaws.com/Prod/report.
5. Now, send an HTTP POST request to the endpoint you found in the earlier step with a sample JSON payload as follows.
```json
{
    "ip": "0.0.0.0",
    "timestamp": "2018-02-04T23:18:32.866Z",
    "browser": "Chrome",
    "url": "http://adroitlogic.com/products/ultraesb-x",
    "referrer": "http://adroitlogic.com",
    "os": "Windows",
    "country": "Sri Lanka",
    "language": "en-us"
}
```
6. If you were successful in putting a record to the Kinesis Stream, you'll get a response payload as follows.
```json
{
    "Code": "PutRecordSuccessful",
    "Message": "Record was successfully put to click-stream",
    "Data": {
        "ShardId": "<some-shard-id>",
        "SequenceNumber": "<some-sequence-number>"
    }
}
```
7. Then, to check if the processing was executed successfully, in the AWS Management Console, open the DynamoDB console at [https://console.aws.amazon.com/dynamodb/](https://console.aws.amazon.com/dynamodb/ "DynamoDB").
8. In the Tables navigation pane under DynamoDB, select "click-stream-table" and go to items tab.
9. Voila! There's the item with the values you sent inside the POST request body.

## Authors

* **Chamath Kirinde**

## License

```
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in 
compliance with the License. You may obtain a copy of the License at 

http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software distributed under the License is 
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and limitations under the License. 
```

## Acknowledgments

* Awesome SLAppForge team
