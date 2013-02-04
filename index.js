var APIKEY = 'd4711e36506fe047f12970c6fdc0b43f6e4fef2e855e03d5c';
var Wordnik = require('./lib/wordnik-bb.js').init(APIKEY);

var word = new Wordnik.Word({word: 'king', params:{includeSuggestions:true}});
 
word.getWord().then(function(word) {
  word.getExamples().then(function(word) {
    word.getDefinitions().then(function(word) {
      word.getTopExample().then(function(word) {
        word.getRelatedWords().then(function(word) {
          word.getPronunciations().then(function(word) {
            word.getScrabbleScore().then(function(word) {
              word.getHyphenation().then(function(word) {
                word.getFrequency().then(function(word) {
                  word.getPhrases().then(function(word) {
                    word.getEtymologies().then(function(word) {
                      word.getAudio().then(function(word) {
                        console.log(word.get("audio"));
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }); 
});
