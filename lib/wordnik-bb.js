/*
 * wordnik-bb
 * https://github.com/dariusk/wordnik-bb
 *
 * Copyright (c) 2013 Darius Kazemi
 * Licensed under the MIT license.
 */

var _ = require('underscore');
var Backbone = require('backbone');
var request = require('request');
var $ = require('jquery');
Backbone.$ = $;

exports.init = function(APIKEY) {
  return {
    Word: Backbone.Model.extend({
      idAttribute: 'word',
      defaults: {
        params: {
          useCanonical: false,
          includeSuggestions: false
        }
      },
      url: function() {
        var url = "http://api.wordnik.com//v4/word.json/"+this.get('word');
        console.log(url);
        return url;
      },
      validate: function(attrs, options) {
      },
      parse: function(resp, options) {
        if (this.currentCommand === "") {
          return JSON.parse(resp);
        }
        else {
          var toReturn = {};
          toReturn[this.currentCommand.substr(1,this.currentCommand.length)] = JSON.parse(resp);
          return toReturn;
        }
      },
      sync: function(method, model, options) {
        var params = this.get("params");
        var queryString = "";
        for (var i in params) {
          if (params.hasOwnProperty(i)) {
            queryString += "&"+i+"="+params[i];
          }
        }
        queryString = queryString.substr(1,queryString.length);
        var _sync = Backbone.sync;
        var deferred = $.Deferred();
        if (method === 'read') {
          request({
            url : _.result(model, 'url')+options.command+"?"+queryString+"&api_key="+APIKEY,
            BBoptions : options
          }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              options.success(model, body, options.BBoptions);
              deferred.resolve(model);
            }
            else {
              options.error(model, resoponse, options.BBoptions);
              deferred.reject(model);
            }
          });

          return deferred.promise();
        }
        else {
          return _sync.apply(this, arguments);
        }
      },
      callWordnik: function(resource) {
        var self = this;
        this.currentCommand = resource;
        return this.fetch({ 
          command: resource,
          success : function(model, response) {
            //console.log(response);
          },
          error : function(model, response) {
            console.log(response.responseText);
          }
        });
      },
      getWord: function() {
        return this.callWordnik("");
      },
      getExamples: function() {
        return this.callWordnik("/examples");
      },
      getDefinitions: function() {
        return this.callWordnik("/definitions");
      }
    })
  };
};
