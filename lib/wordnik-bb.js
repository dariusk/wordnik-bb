/*
 * wordnik-bb
 * https://github.com/dariusk/wordnik-bb
 *
 * Copyright (c) 2013 Darius Kazemi
 * Licensed under the MIT license.
 */

// TODO: add validation
var _ = require('underscore');
var Backbone = require('backbone');
var request = require('request');
var $ = require('jquery');
Backbone.$ = $;

exports.init = function(APIKEY) {
  var Word = Backbone.Model.extend({
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
      parse: function(resp,options) {
        // if we're getting the base object, just parse it so the properties end up on the root of the model's attributes
        if (options.command === "") {
          return JSON.parse(resp);
        }
        // otherwise, the response from this API call should go into a property with the same name as the API call
        else {
          var toReturn = {};
          toReturn[options.command.substr(1,options.command.length)] = JSON.parse(resp);
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
          // use the request module instead of jQuery so we can do serverside cross-domain access
          request({
            url : _.result(model, 'url')+options.command+"?"+queryString+"&api_key="+APIKEY
          }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              options.success(model, body, options);
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
      },
      getEverything: function() {
        var self = this;

        return $.when( 
          self.getWord(),
          self.getExamples(),
          self.getDefinitions(),
          self.getTopExample(),
          self.getRelatedWords(),
          self.getPronunciations(),
          self.getScrabbleScore(),
          self.getHyphenation(),
          self.getFrequency(),
          self.getPhrases(),
          self.getEtymologies(),
          self.getAudio()
        )
        .then(function() {
        })
        .fail(function() {
          console.log("failed!");
        });
      }
    });
  var Words = Backbone.Collection.extend({
    model: Word
  });
  var RandomWord = Backbone.Model.extend({
    defaults: {
      params: {}
    },
    url: function() {
      // Parse query string from the params object property
      var params = this.get("params");
      var queryString = "";
      for (var i in params) {
        if (params.hasOwnProperty(i) && i !== "wordParams") {
          queryString += "&"+i+"="+params[i];
        }
      }
      queryString = queryString.substr(1,queryString.length);

      return "http://api.wordnik.com/v4/words.json/randomWord?" + queryString + "&api_key=" + APIKEY;
    },
    getRandomWord: function() {
      return this.fetch({
        success: function(model, response) {
        },
        error: function(model, response) {
          console.log("Error fetching random word: " + response.responseText);
        }
      });
    }
  });
  var getRandomWordModel = function(options) {
    this.options = options || {};
    var deferred = $.Deferred();
    var self = this;
    var random = new RandomWord({
      params: self.options
    });
    
    random.getRandomWord()
      .then( function(random) {
        var word = new Word({word: random.word, params: self.options.wordParams});
        deferred.resolve(word);
      });

    return deferred.promise();
  };
  return {
    Word: Word,
    Words: Words,
    RandomWord: RandomWord,
    getRandomWordModel: getRandomWordModel
  };
};
