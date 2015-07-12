var assert = require('assert');
var fs = require('fs');
var File = require('vinyl');
var mask = require('../');
require('mocha');

describe('gulp-mask', function () {
  describe('in buffer mode', function () {
    it('should work with simple riot tag', function (done) {
      var fakeFile = new File({
        contents: fs.readFileSync('test/fixtures/riot.tag')
      });
      var myMask = mask('<script>', '</script>');
      myMask.write(fakeFile);
      myMask.once('data', function (file) {
        assert(file.isBuffer());
        assert.equal(file.contents.toString('utf8'), fs.readFileSync('test/expected/riot.tag'));
        done();
      });
    });

    it('should work with coffeescript in jade', function (done) {
      var fakeFile = new File({
        contents: fs.readFileSync('test/fixtures/riot-jade.tag')
      });
      var myMask = mask("script(type='text/coffee').");
      myMask.write(fakeFile);
      myMask.once('data', function (file) {
        assert(file.isBuffer());
        assert.equal(file.contents.toString('utf8'), fs.readFileSync('test/expected/riot-jade.tag'));
        done();
      });
    });

    it('should work with markdown', function (done) {
      var fakeFile = new File({
        contents: fs.readFileSync('test/fixtures/markdown.md')
      });
      var myMask = mask('```js', '```');
      myMask.write(fakeFile);
      myMask.once('data', function (file) {
        assert(file.isBuffer());
        assert.equal(file.contents.toString('utf8'), fs.readFileSync('test/expected/markdown.md'));
        done();
      });
    });

    it('should work using regex', function (done) {
      var fakeFile = new File({
        contents: fs.readFileSync('test/fixtures/markdown.md')
      });
      var myMask = mask(/^```\w*$/, /^```$/);
      myMask.write(fakeFile);
      myMask.once('data', function (file) {
        assert(file.isBuffer());
        assert.equal(file.contents.toString('utf8'), fs.readFileSync('test/expected/markdown-regex.md'));
        done();
      });
    });

    it('should work well when you want see first line', function (done) {
      var fakeFile = new File({
        contents: fs.readFileSync('test/fixtures/openhead.txt')
      });
      var myMask = mask('never arise in file', '# comment', true);
      myMask.write(fakeFile);
      myMask.once('data', function (file) {
        assert(file.isBuffer());
        assert.equal(file.contents.toString('utf8'), fs.readFileSync('test/expected/openhead.txt'));
        done();
      });
    });

    it('should work well when the open and close key are same', function (done) {
      var fakeFile = new File({
        contents: fs.readFileSync('test/fixtures/samekey.md')
      });
      var myMask = mask('```', '```');
      myMask.write(fakeFile);
      myMask.once('data', function (file) {
        assert(file.isBuffer());
        assert.equal(file.contents.toString('utf8'), fs.readFileSync('test/expected/samekey.md'));
        done();
      });
    });
  });
});
