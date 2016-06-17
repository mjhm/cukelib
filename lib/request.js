

var Promise = require('bluebird');
var requestPromise = require('request-promise');
var matchPattern = require('lodash-match-pattern');
var expect = require('chai').expect;

var makeRequest = function (methodStr, route, data) {
  var method = methodStr.slice(0, -1);

  var request = this._capi.request;

  request.requestOptions = {
    uri: this._capi.options.serverRoot + route,
    method: method,
    simple: false,
    json: true,
    resolveWithFullResponse: true,
    followAllRedirects: true
  };
  if (request.bearerToken) {
    request.requestOptions.auth = {
      bearer: request.bearerToken
    };
  }
  if (typeof data === 'string') {
    try {
      var jsonData = JSON.parse(data);
    } catch (err) {
      err.message += ' Error parsing:\n' + data
      throw err
    }
    request.requestOptions.body = jsonData;
  }
  request.requestPromise = requestPromise(request.requestOptions);
  return request.requestPromise;
};

module.exports = {
  withPayload: function (methodStr, route, data) {
    return makeRequest.call(this, methodStr, route, data);
  },

  withoutPayload: function (methodStr, route) {
    return makeRequest.call(this, methodStr, route);
  },

  responseStatusCode: function (targetCode) {
    return this._capi.request.requestPromise.then(function (response) {
      expect(response.statusCode).to.equal(parseInt(targetCode, 10));
    });
  },

  responseMatchPattern: function (targetPattern) {
    return this._capi.request.requestPromise.then(function (response) {
      var body;
      try {
        body = (typeof response.body === 'object') ? response.body : JSON.parse(response.body);
      } catch (err) {
        err.message += ' Error parsing:\n' + body
        throw err
      }
      var check = matchPattern(body, targetPattern);
      if (check) {
        throw new Error(check);
      }
    });
  }
};
