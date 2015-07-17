'use strict';

// Copyright 2014 Serilog Contributors
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

    var self = this;

    var nodemailer = require('nodemailer');

    self.toString = function() { return 'EmailSink'; };

    options = options || {};

    var emailTransport = null;

    if (options.service) {        
        emailTransport = nodemailer.createTransport({
            service: options.service,
            auth: options.auth,
        });
    }
    else {
        var smtpTransport = require('nodemailer-smtp-transport');

        emailTransport = nodemailer.createTransport(smtpTransport({
            host: options.host || 'localhost',
            port: options.port || 25,
            auth: options.auth || {},
        }));
    }

    self.emit = function(evt) {

        emailTransport.sendMail({
            from: options.from,
            to: options.to,
            subject: evt.level + ' log',
            text: evt.messageTemplate.render(evt.properties),
        });
    };
};

module.exports = function(options) { 
    return new EmailSink(options); 
};
