var _ = require('underscore');
var Backbone = require('backbone');

var wordnik_bb = require('../lib/wordnik-bb.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['init'] = {
  setUp: function(done) {
    // setup here
    this.W = wordnik_bb.init('');
    done();
  },
  'Wordnik object structure': function(test) {
    test.expect(2);
    // tests here
    test.equal(typeof wordnik_bb, "object", "Wordnik lib returns an object.");
    test.equal(typeof wordnik_bb.init, "function", 'The object has an init function');
    test.done();
  },
  'Word model': function(test) {
    test.expect(2);
    test.equal(typeof this.W.Word, "function", "Word is a function (constructor)");
    var word = new this.W.Word({ word: 'kings' });
    test.ok(word.idAttribute, "Word constructor returns a Backbone Model");
    test.done();
  },
  tearDown: function(done) {
    delete this.W;
    done();
  }
};
