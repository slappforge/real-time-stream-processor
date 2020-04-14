console.log('Loading function: Publish Activity Stream...');

const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // activity reported through API proxy
    let activity = JSON.stringify(event.body);
    console.log('Activity:', activity);

    try {
        let data = await kinesis.putRecord({
            Data: activity,
            PartitionKey: '0',
            StreamName: 'click-stream'
        }).promise();

        console.log('Response -> data:', data);
        let response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'Code': 'PutRecordSuccessful',
                'Message': 'Record was successfully put to click-stream',
                'Data': data
            }),
            'isBase64Encoded': false
        };
        return response;

    } catch (err) {
        console.log('Response -> error:', err);
        let response = {
            'statusCode': err.statusCode,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'Code': err.code,
                'Message': err.message
            }),
            'isBase64Encoded': false
        };
        return response;
    }
};