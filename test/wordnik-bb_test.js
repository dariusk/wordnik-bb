var _ = require('underscore');
var Backbone = require('backbone');

var wordnik_bb = require('../lib/wordnik-bb.js');
console.log("!!!",wordnik_bb);
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
    done();
  },
  'no args': function(test) {
    test.expect(2);
    // tests here
    test.equal(typeof wordnik_bb, "object", "Wornik lib returns an object.");
    test.equal(typeof wordnik_bb.init, "function", 'The object has an init function');
    test.done();
  }
};
