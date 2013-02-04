var APIKEY = 'd4711e36506fe047f12970c6fdc0b43f6e4fef2e855e03d5c';
var Wordnik = require('./lib/wordnik-bb.js').init(APIKEY);
var $ = require('jquery');

var word = new Wordnik.Word({word: 'king', params:{includeSuggestions:true}});
// Make it so that the get functions return promises!
$.when( 
    word.getExamples(),
    word.getDefinitions(),
    word.getTopExample(),
    word.getRelatedWords(),
    word.getPronunciations(),
    word.getScrabbleScore(),
    word.getHyphenation(),
    word.getFrequency(),
    word.getPhrases(),
    word.getEtymologies(),
    word.getAudio()
  )
  .then(function() {
    console.log(word);
  })
  .fail(function() {
    console.log("failed!");
  });
