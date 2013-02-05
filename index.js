var APIKEY = 'd4711e36506fe047f12970c6fdc0b43f6e4fef2e855e03d5c';
var Wordnik = require('./lib/wordnik-bb.js').init(APIKEY);
var $ = require('jquery');

// Here's an example of declaring a new word and then populating it with the data from every available word method.
var word = new Wordnik.Word({word: 'king', params:{includeSuggestions:true}});
word.getEverything()
 .then( function() {
    console.log("A WHOLE lot of data in a Word model: ", word);
  });

// Here's an example of using the getRandomWordModel function, which behind the scenes generates a random word and then creates a Wordnik.Word model based on it.
var randomWordPromise = Wordnik.getRandomWordModel({
    includePartOfSpeech: "verb-transitive",
    minCorpusCount: 10000
  }
);
randomWordPromise.done(function(word) {
  console.log("The model for our random word: ", word);
  // We could also get more info about the random word:
  // word.getEverything()
  //   .then( function() {
  //      console.log("And now we've populated the model with all the available data: ", word);
  //   }
});
