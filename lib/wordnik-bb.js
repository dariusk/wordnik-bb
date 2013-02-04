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
        var params = this.get("params");
        var queryString = "";
        for (var i in params) {
          if (params.hasOwnProperty(i)) {
            queryString += "&"+i+"="+params[i];
          }
        }
        queryString = queryString.substr(1,queryString.length);
        var url = "http://api.wordnik.com//v4/word.json/"+this.get('word')+this.get("command")+"?"+queryString;
        console.log(url);
        return url;
      },
      validate: function(attrs, options) {
      },
      parse: function(resp, options) {
        return JSON.parse(resp);
      },

      sync: function(method, model, options) {
        console.log(options.command);
        var _sync = Backbone.sync;
        var deferred = $.Deferred();
        if (method === 'read') {
          request({
            url : _.result(model, 'url')+"&api_key="+APIKEY,
            BBoptions : options
          }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log(_.result(model, 'url')+"&api_key="+APIKEY);
              options.success(model, body, options.BBoptions);
              deferred.resolve(model);
            }
          });

          return deferred.promise();
        }
        else {
          return _sync.apply(this, arguments);
        }
      },
      getWord: function() {
        this.fetch({ 
          command: "/example",
          success : function(model, response) {
            console.log(model);
          },
          error : function(model, response) {
            console.log(response.responseText);
          }
        });
      },
      getExamples: function() {
      } 
    })
  };
};
