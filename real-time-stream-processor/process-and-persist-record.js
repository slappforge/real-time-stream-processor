console.log('Loading function: Process and Persist Record...');

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
	console.log('Received event:', JSON.stringify(event, null, 2));

	/**
	 * Iterates through the Kinesis records which this function is triggered by and parses the activity payload.
	 * Validates the activity and inserts into a DynamoDB table.
	 */
	for (const record of event.Records) {

		let payload = JSON.parse(new Buffer(record.kinesis.data, 'base64').toString('ascii'));
		console.log('Decoded payload:', payload);

		let activity = JSON.parse(payload);

		console.log('IP:', activity.ip);
		console.log('Timestamp:', activity.timestamp);

		// Partition key and sort key should be non null values
		if (activity.ip !== undefined && activity.timestamp !== undefined) {

			try {
				let data = ddb.put({
					TableName: "click-stream-table",
					Item: {
						IP: activity.ip,
						Timestamp: activity.timestamp,
						Browser: activity.browser,
						URL: activity.url,
						Referrer: activity.referrer,
						OS: activity.os,
						Country: activity.country,
						Language: activity.language
					}
				}).promise();
				console.debug('Response -> data:', data);
				return;

			} catch (err) {
				console.log('Response -> error:', err);
				throw err;
			}

		} else {
			console.log('Invalid input:', 'Missing required keys ip and/or timestamp');
			throw new Error('Missing required keys ip and/or timestamp');
		}
	};
};