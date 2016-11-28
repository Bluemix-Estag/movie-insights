/**
 * MIT License
 *
 * Copyright (c) 2016 Rafael Moris
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

// security.js
var secure     = require('express-secure-only'),
  rateLimit    = require('express-rate-limit'),
  csrf         = require('csurf'),
  cookieParser = require('cookie-parser'),
  helmet       = require('helmet'),
  morgan       = require('morgan'),
  request      = require('request'),
  fs           = require('fs');

module.exports = function (app) {
  app.enable('trust proxy');

  // 0. setup the logger
  var logStream = fs.createWriteStream(__dirname + '/../access.log', {flags: 'a'});
  app.use('/api/', morgan('combined', {stream: logStream}));

  // 1. redirects http to https
  app.use(secure());

  // 2. helmet with defaults
  app.use(helmet());

  // 3. setup cookies
  var secret = Math.random().toString(36).substring(7);
  app.use(cookieParser(secret));

  // 4. csrf
  var csrfProtection = csrf({ cookie: true });
  app.get('/', csrfProtection, function(req, res, next) {
    req._csrfToken = req.csrfToken();
    next();
  });

  // 5. rate limiting
  var limiter = rateLimit({
    windowMs: 30 * 1000, // seconds
    delayMs: 0,
    max: 6,
    message: JSON.stringify({
      error:'Too many requests, please try again in 30 seconds.',
      code: 429
    }),
  });

  // 6. captcha
  var captchaKeys = {
    site: process.env.CAPTCHA_SITE || '<captcha-site>',
    secret: process.env.CAPTCHA_SECRET || '<captcha-secret>',
  };

  var checkCaptcha = function(req, res, next) {
    if (req.body && req.body.recaptcha) {
      request({
        url: 'https://www.google.com/recaptcha/api/siteverify',
        method: 'POST',
        form: {
          secret: captchaKeys.secret,
          response: req.body.recaptcha,
          remoteip: req.ip
        },
        json: true
      }, function(error, response, body) {
        if (body.success) {
          limiter.resetIp(req.ip);
          next();
        } else {
          next({
            code: 'EBADCSRFTOKEN',
            error: 'Wrong captcha'
          });
        }
      });
    } else {
      next();
    }
  };

  app.use('/api/', csrfProtection, checkCaptcha, limiter);
};
