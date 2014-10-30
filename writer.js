'use strict';

var assert = require('assert');
var fs = require('fs');

var async = require('async');

var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var lettersAndNumbers = letters + '01234567890';

var maxSpacesLength = 10;

// kick the things out
main();

/**
 * returns random element from a given string
 * @param  {String} str [description]
 * @return {String} Random char
 */
function _getRandomChar(str) {
  return str.charAt(Math.floor(Math.random() * str.length));
}

/**
 * Generates random spaces number
 * @return {String}
 */
function _genRandomSpacesNum() {
  var str = '';

  var length = 1 + Math.floor(Math.random() * maxSpacesLength);

  for (var i = 0; i < length; i++) {
    str += ' ';
  }

  return str;
}

/**
 * Generates random string
 * @param  {[Number]} length 10 by default
 * @return {String} Random string
 */
function generateRandomString(length) {
  length = length || 10;

  assert(typeof length === 'number');

  var str = '';
  for (var i = 0; i < length; i++) {
    str += _getRandomChar(letters);
  }

  return str;
}

/**
 * Generates random float numder
 * @param  {[Number]} base
 * @return {String} String
 */
function generateRandomFloat(base) {
  base = base || 1e5;

  assert(typeof base === 'number');

  return (Math.random() * base).toString();
}

/**
 * Generates random integer number
 * @param  {[Number]} base
 * @return {String}
 */
function generateRandomInteger(base) {
  base = base || 1e7;

  assert(typeof base === 'number');

  return Math.round((Math.random() * base)).toString();
}

/**
 * Generates alphanumeric string
 * @param  {[Number]} length
 * @return {String}
 */
function generateAlphaNumeric(length) {
  length = length || 10;

  assert(typeof length === 'number');

  var str = _genRandomSpacesNum();

  for (var i = 0; i < length; i++) {
    str += _getRandomChar(lettersAndNumbers);
  }

  str += _genRandomSpacesNum();

  return str;
}

function main() {
  var fileSize = 10485760;

  var actions = [
    generateRandomString,
    generateRandomFloat,
    generateRandomInteger,
    generateAlphaNumeric
  ];

  var file = fs.createWriteStream('./out.txt');

  var rndString = function() {
    var rndIndex = Math.floor(Math.random() * actions.length);
    var rndAction = actions[rndIndex];

    return rndAction();
  };

  console.time('Writing random text');

  async.doWhilst(
    function(cb) {

      file.write(rndString() + ',', cb);
    },
    function() {
      return file.bytesWritten < fileSize;
    },
    function() {
      file.end(rndString(), function() {
        console.timeEnd('Writing random text');
        console.log('%d bytes written', file.bytesWritten);
      });
    }
  );
}
