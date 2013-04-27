# wordnik-bb

An interface to the Wordnik API, which lets you get dictionary definitions, random words, pronunciation, and more! Built with Backbone.js.

## Getting Started

Make sure you have a [Wordnik API key](http://developer.wordnik.com/) and pass it to the init function on require:

```javascript
var APIKEY = 'YOURAPIKEY';
var Wordnik = require('wordnik-bb').init(APIKEY);
```

## Examples
Here's an example of declaring a new word and then populating it with the data from every available word method.
```javascript
var word = new Wordnik.Word({word: 'king', params:{includeSuggestions:true}});
word.getEverything()
 .then( function() {
    console.log("A WHOLE lot of data in a Word model: ", word);
  });
```

Here's an example of using the getRandomWordModel function, which behind the scenes generates a random word and then creates a Wordnik.Word model based on it.
```javascript
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
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
 * 0.1.0 (2/14/2013) - initial release

## License
Copyright (c) 2013 Darius Kazemi  
Licensed under the MIT license.
