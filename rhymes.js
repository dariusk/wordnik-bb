var APIKEY = 'd4711e36506fe047f12970c6fdc0b43f6e4fef2e855e03d5c';
var Wordnik = require('./lib/wordnik-bb.js').init(APIKEY);
var $ = require('jquery');
var I = require('inflection');
var request = require('request');

var url = "http://api.wordnik.com//v4/words.json/randomWord?includePartOfSpeech=noun&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&minCorpusCount=5000&api_key=" + APIKEY;
var deferred = $.Deferred();
var randomWordPromise = deferred.promise();
request({
  url : url
}, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    //console.log(JSON.parse(body).word);
    //console.log(I.singularize(JSON.parse(body).word));
    var word = new Wordnik.Word({word: I.singularize(JSON.parse(body).word), params:{
        relationshipTypes: 'rhyme',
        limitPerRelationshipType: 100,
        hasDictionaryDef: true
      }});
    word.getWord()
     .then( function() {
        deferred.resolve(word);
      });

  }
  else {
    deferred.reject(error);
  }
});

// Here's an example of using the getRandomWordModel function, which behind the scenes generates a random word and then creates a Wordnik.Word model based on it.
/*
var randomWordPromise = Wordnik.getRandomWordModel({
    includePartOfSpeech: "noun",
    excludePartOfSpeech: "proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix",
    minCorpusCount: 5000,
    wordParams: {
      relationshipTypes: 'rhyme',
      limitPerRelationshipType: 100,
      hasDictionaryDef: true
    }
  }
);
*/

randomWordPromise.done(function(word) {
  //console.log("The model for our random word: ", word);
  // We could also get more info about the random word, in this case, relatedWords that rhyme:
   word.getRelatedWords()
     .then( function() {
        if (word.get("relatedWords").length > 0) {
          var opens = [
            "I'm the illest MC to ever rock the ",
            "When I'm on the mic you realize you're just a ",
            "My rhymes bring the power like a raging ",
            "If you can't handle this then you're nothing but a "
            ];
         console.log(opens[Math.floor(Math.random()*opens.length)] + word.id);
         var word2 = word.get("relatedWords")[0].words[Math.floor(Math.random()*word.get("relatedWords")[0].words.length)];
         var posPromise = getPartOfSpeech(word2);
         posPromise.done(function(pos) {
           if (pos === 'adjective') {
              var pre = [
                "You can try and battle me, but you're too ",
                "I make the MCs in the place wish that they were ",
                "My rhymes blow your mind and you think it's ",
                "My sweet-ass rhymes make your woman feel "
              ];
             console.log( pre[Math.floor(Math.random()*pre.length)] + word2);
           }
           else if (pos === 'noun' || pos === 'proper-noun') {
             var pre = [
                "Every other MC is a sucker ",
                "There's nobody like me 'cause I'm the greatest ",
                "You hear my freestyle and you drop your ",
                "My flow and my style both blow away the ",
                "My posse's got my back and my homies got my ",
                "Sweeter than molasses, and stronger than a ",
                "Try to step to me and I'mma wreck your ",
                "Wherever I go, people give me some "
              ];
             console.log( pre[Math.floor(Math.random()*pre.length)] + I.singularize(word2));
           }
           else if (pos === 'verb-transitive') {
             console.log("My rhyme profile makes the ladies " + word2);
           }
           else {
             console.log(pos);
           }
         });
        }
        else {
          console.log("Sorry. We couldn't find anything that rhymes with " + word.id + "!");
        }
     });
});

function getPartOfSpeech(wordId) {
  // accepts a word string
  var word = new Wordnik.Word({word: wordId, params:{includeSuggestions:true}});
  var deferred = $.Deferred();
  word.getDefinitions()
   .then( function(word) {
      deferred.resolve(word.get("definitions")[0].partOfSpeech);
    });
  return deferred.promise();
}
