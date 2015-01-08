# chronoman

Utility class to simplify use of timers created by setTimeout.

[![NPM version](https://badge.fury.io/js/chronoman.png)](http://badge.fury.io/js/chronoman)

## Installation

### Node

    npm install chronoman

### [Component](https://github.com/componentjs/component)

    component install gamtiq/chronoman

### [Jam](http://jamjs.org)

    jam install chronoman

### [Bower](http://bower.io)

    bower install chronoman

### [SPM](http://spmjs.io)

    spm install chronoman

### AMD, &lt;script&gt;

Use `dist/chronoman.js` or `dist/chronoman.min.js` (minified version).

## Usage

### Node, Component, SPM

```js
var Timer = require("chronoman");
```

### Jam

```js
require(["chronoman"], function(Timer) {
    ...
});
```

### AMD

```js
define(["path/to/dist/chronoman.js"], function(Timer) {
    ...
});
```

### Bower, &lt;script&gt;

```html
<!-- Use bower_components/chronoman/dist/chronoman.js if the library was installed by Bower -->
<script type="text/javascript" src="path/to/dist/chronoman.js"></script>
<script type="text/javascript">
    // сhronoman is available via Chronoman field of window object
    var Timer = Chronoman;
    ...
</script>
```

### Example

```js
var nI = 0;

var tmrOne = new Timer({
    period: 1000,
    action: function(timer) {
        console.log("---> Timer one. ", timer);   // timer is undefined because passToAction is false by default
    }
});

var tmrTwo = new Timer();
tmrTwo.setPeriod(2000)
    .setRecurrent(true)
    .setPassToAction(true)
    .setAction(function(timer) {
        nI++;
        console.log("Timer two. #", nI, timer);
        tmrOne.setActive(! tmrOne.isActive());
        if (nI === 10) {
            timer.stop();
        }
    });

tmrTwo.start();
```

## API

See `doc` folder.

## Inspiration

This module is inspired by [qooxdoo](http://qooxdoo.org)'s `qx.event.Timer` class.

## Licence

MIT
