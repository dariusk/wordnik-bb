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
        //console.log(url);
        return url;
      },
      validate: function(attrs, options) {
      },
      parse: function(resp, options) {
        // if we're getting the base object, just parse it so the properties end up on the root of the model's attributes
        if (this.currentCommand === "") {
          return JSON.parse(resp);
        }
        // otherwise, the response from this API call should go into a property with the same name as the API call
        else {
          var toReturn = {};
          toReturn[this.currentCommand.substr(1,this.currentCommand.length)] = JSON.parse(resp);
          return toReturn;
        }
      },
      sync: function(method, model, options) {
        // Parse query string from the params object property
        var params = this.get("params");
        var queryString = "";
        for (var i in params) {
          if (params.hasOwnProperty(i)) {
            queryString += "&"+i+"="+params[i];
          }
        }
        queryString = queryString.substr(1,queryString.length);

        // override sync
        var _sync = Backbone.sync;
        var deferred = $.Deferred();
        if (method === 'read') {
          console.log(_.result(model, 'url')+options.command+"?"+queryString+"&api_key="+APIKEY);
          // use the request module instead of jQuery so we can do serverside cross-domain access
          request({
            url : _.result(model, 'url')+options.command+"?"+queryString+"&api_key="+APIKEY,
            BBoptions : options
          }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              options.success(model, body, options.BBoptions);
              deferred.resolve(model);
            }
            else {
              options.error(model, response, options.BBoptions);
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
      },
      getTopExample: function() {
        return this.callWordnik("/topExample");
      },
      getRelatedWords: function() {
        return this.callWordnik("/relatedWords");
      },
      getPronunciations: function() {
        return this.callWordnik("/pronunciations");
      },
      getScrabbleScore: function() {
        return this.callWordnik("/scrabbleScore");
      },
      getHyphenation: function() {
        return this.callWordnik("/hyphenation");
      },
      getFrequency: function() {
        return this.callWordnik("/frequency");
      },
      getPhrases: function() {
        return this.callWordnik("/phrases");
      },
      getEtymologies: function() {
        return this.callWordnik("/etymologies");
      },
      getAudio: function() {
        return this.callWordnik("/audio");
      }
    })
  };
};
