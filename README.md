# gulp-mask
Mask out things bother your lint.

Lines masked out will replaced by empty lines, so the line number in lint report will same as original file, and developer can locate in source file quickly.

## Installation
Use npm

```
npm install gulp-mask
```

## Usage
```
var gulp = require('gulp'),
    mask = require('gulp-mask');
    eslint = require('gulp-eslint');

gulp.task('lint', function () {
    return gulp.src(['public/**/*.html'])
        .pipe(mask('<script>', '</script>')) // mask out html and style and leave pure javascript
        .pipe(eslint())
        .pipe(eslint.format());
});
```

## API

### mask(keyForOpen, [keyForClose, [beginWithOpen]])
#### keyForOpen `String` or `Regex`
File will mask out line by line by default, until a line match keyForOpen arise.
I say mask out, means that line will be repalced by an empty line.
When key is `String`, test with `line.trim() == key`,
When key is `Regex`, test with `key.test(line)`.

#### keyForClose `String` or `Regex`
Opposite to keyForOpen, when matched, mask come back again.

#### beginWithOpen `Boolean`
When set beginWithOpen to `true`, mask function will be off at beginning, and match engine will look for keyForClose first to take mask back.

## Sample
Lint a riot tag with `mask('<script>', '</script>')`.

Before:
```
<todo>

  <!-- layout -->
  <h3>{ opts.title }</h3>

  <ul>
    <li each={ item, i in items }>{ item }</li>
  </ul>

  <form onsubmit={ add }>
    <input>
    <button>Add #{ items.length + 1 }</button>
  </form>

  <!-- logic -->
  <script>
    this.items = []

    add(e) {
      var input = e.target[0]
      this.items.push(input.value)
      input.value = ''
    }
  </script>

</todo>


```

After:
```
















    this.items = []

    add(e) {
      var input = e.target[0]
      this.items.push(input.value)
      input.value = ''
    }




```
As you see, the javascript still here, at the same position.

Lint coffeescript in jade file, just use `mask("script(type='text/coffee').")` first

Before:
```
sample
  p test { value }
    script(type='text/coffee').
      @value = 'sample'

```

After:
```



      @value = 'sample'

```

There are more samples in test dir. original files in fixtures and files masked in expected.
