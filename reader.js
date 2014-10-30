'use strict';

var fs = require('fs');

fs.readFile('./out.txt', {encoding: 'utf8'}, function(err, data) {
  if (err) throw err;

  var objects = data.split(',');

  console.time('Processing');

  for (var i = 0, l = objects.length; i < l; i++) {
    processItem(objects[i]);
  }

  console.timeEnd('Processing');

  console.log('All done');
});

var classifier = [
  [/^\d+$/, 'integer'],
  [/^\d+\.\d+$/, 'real numbers'],
  [/^[a-zA-Z]+$/, 'alphabetical strings'],
  [/^[a-zA-Z0-9]+$/, 'alphanumeric']
];

function processItem(obj) {
  obj = obj.trim();

  for (var i = 0, l = classifier.length; i < l; i++) {
    var cls = classifier[i];
    if (cls[0].test(obj)) {
      console.log('%s - %s', obj, cls[1]);
      return;
    }
  }

  console.log('%s not recognized', obj);
}
