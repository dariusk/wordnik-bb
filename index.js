var APIKEY = 'd4711e36506fe047f12970c6fdc0b43f6e4fef2e855e03d5c';
var Wordnik = require('./lib/wordnik-bb.js').init(APIKEY);
var $ = require('jquery');

//var word = new Wordnik.Word({word: 'king', params:{includeSuggestions:true}});

/*
word.getEverything()
  .then( function() {
    console.log(word);
  });
*/

var random = new Wordnik.RandomWord({
  params: {
    includePartOfSpeech: "verb-transitive",
    minCorpusCount: 10000
  }
});

random.getRandomWord()
  .then( function() {
    console.log("Here's a random word: " + random.get("word"));
  });
