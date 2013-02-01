var APIKEY = 'd4711e36506fe047f12970c6fdc0b43f6e4fef2e855e03d5c';
var Wordnik = require('./lib/wordnik-bb.js').init(APIKEY);

var word = new Wordnik.Word({word: 'kings', includeSuggestions: true});
 
word.getWord();
