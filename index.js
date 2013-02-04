var APIKEY = 'd4711e36506fe047f12970c6fdc0b43f6e4fef2e855e03d5c';
var Wordnik = require('./lib/wordnik-bb.js').init(APIKEY);

var word = new Wordnik.Word({word: 'kings', params:{includeSuggestions:true}});
 
word.getWord().then(function(word) {
  word.getExamples().then(function(word) {
    word.getDefinitions().then(function(word) {
      console.log(word);
    });
  }); 
});
