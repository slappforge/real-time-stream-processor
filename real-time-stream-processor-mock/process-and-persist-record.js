console.log('Loading function: Process and Persist Record...');

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {
	console.log('Received event:', JSON.stringify(event, null, 2));

	/**
	 * Iterates through the Kinesis records which this function is triggered by and parses the activity payload.
	 * Validates the activity and inserts into a DynamoDB table.
	 */
	event.Records.forEach(record => {
		
		let payload = JSON.parse(new Buffer(record.kinesis.data, 'base64').toString('ascii'));
		console.log('Decoded payload:', payload);
		
		let activity = JSON.parse(payload);

		console.log('IP:', activity.ip);
		console.log('Timestamp:', activity.timestamp);

		// Partition key and sort key should be non null values
		if (activity.ip !== undefined && activity.timestamp !== undefined) {

			ddb.put({
				TableName: 'click-stream-table',
				Item: { 
					'IP': activity.ip, 
					'Timestamp': activity.timestamp, 
					'Browser': activity.browser, 
					'URL': activity.url, 
					'Referrer': activity.referrer, 
					'OS': activity.os, 
					'Country': activity.country, 
					'Language': activity.language 
				}
			}, function (err, data) {
				if (err) {
					console.log('Response -> error:', err);
					context.fail(err);
				} else {
					console.debug('Response -> data:', data);
					context.succeed();
				}
			});

		} else {
			console.log('Invalid input:', 'Missing required keys ip and/or timestamp');
			context.fail(new Error('Missing required keys ip and/or timestamp'));
		}

	});

}