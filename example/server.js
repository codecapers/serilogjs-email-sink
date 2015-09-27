
var structuredLog = require('structured-log-dev');
var consoleSink = require('structured-log-dev/console-sink');
var emailSink = require('../structured-log-email-sink');

var log = structuredLog.configure()
	.batch()
	.writeTo(emailSink({
		transport: {
			service: "Gmail",
			auth: {
				user: '<your-gmail-username>',
				pass: '<your-gmail-password>',
			},
		},
		email: {
			to: '<someone>',
			subject: 'Test Logging',
		},
	}))
    .create();

log.info('Hello this is some information.');

log.warn('This is a warning.');

log.error('This is an error.');

log.flush(function () {
	console.log('Flushed!');
});

console.log('Finished');
