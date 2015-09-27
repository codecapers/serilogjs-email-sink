'use strict';

// Copyright 2014 Structured-Log Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// UMD bolierplate based on https://github.com/umdjs/umd/blob/master/returnExports.js
// Supports node.js, AMD and the browser.
//

var EmailSink = function (options) {

    // Argument checking.
    if (!options) {
        throw new Error("'options' parameter is required.");
    }

    if (!options.transport) {
        throw new Error("'options.transport' field is required.");
    }

    if (!options.email) {
        throw new Error("'options.email' field is required.");
    }

    var self = this;

    var nodemailer = require('nodemailer');
    var extend = require('extend');

    self.toString = function() { return 'EmailSink'; };

    var emailTransport = null;

    if (options.transport.service) {        
        emailTransport = nodemailer.createTransport(options.transport);
    }
    else {
        var smtpTransport = require('nodemailer-smtp-transport');

        emailTransport = nodemailer.createTransport(smtpTransport(options.transport));
    }

    self.emit = function(evts, done) {

        var emailBody = evts
            .map(function (evt) { 
                return evt.messageTemplate.render(evt.properties);
            })
            .join('\r\n');

        var emailData = extend({ text: emailBody }, options.email);
        emailTransport.sendMail(emailData, function (error, info) {
                done(error);
            });
    };
};

module.exports = function(options) { 
    return new EmailSink(options); 
};
