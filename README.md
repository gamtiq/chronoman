# chronoman

Utility class to simplify use of timers created by `setTimeout`.

### Features

* Support for one-time (like `setTimeout`) or recurrent (like `setInterval`) timers.
* It is possible to repeat action indefinitely (`recurrent` property),
  specified number of times (`repeatQty` property) or depending on
  result of control function (`repeatTest` property).
* Time period (timeout) can be: a fixed value, a random value, an item selected from a list
  depending on action's execution number, or a value returned from specified function.
* Action that is called can be a function or an object specifying function and its call's context.
* Action result is saved in timer's field for further access.
* Timer's start time, stop time and action execution times are saved in
  `startTime`, `stopTime` and `executeTime` properties correspondingly.

```js
var timer = new Timer({
    period: [100, 200, 300, 400, 500, {start: 100, end: 500}],
    repeatQty: 100,
    passToAction: true,
    action: function(tmr) {
        console.log("#", tmr.getExecutionQty() + 1, ":", new Date());
    },
    active: true
});
...
timer.stop();
```

[![NPM version](https://badge.fury.io/js/chronoman.png)](http://badge.fury.io/js/chronoman)
[![Build Status](https://secure.travis-ci.org/gamtiq/chronoman.png?branch=master)](http://travis-ci.org/gamtiq/chronoman)
[![Built with Grunt](https://gruntjs.com/cdn/builtwith.png)](http://gruntjs.com/)

## Installation

### Node

    npm install chronoman

### [Bower](http://bower.io)

    bower install chronoman

### AMD, &lt;script&gt;

Use `dist/chronoman.js` or `dist/chronoman.min.js` (minified version).

## Usage

### ECMAScript 6/2015

```js
import Timer from "chronoman";
```

### Node

```js
var Timer = require("chronoman").Timer;
```

### AMD

```js
define(["path/to/dist/chronoman.js"], function(chronoman) {
    var Timer = chronoman.Timer;
    ...
});
```

### Bower, &lt;script&gt;

```html
<!-- Use bower_components/chronoman/dist/chronoman.js if the library was installed by Bower -->
<script type="text/javascript" src="path/to/dist/chronoman.js"></script>
<script type="text/javascript">
    // сhronoman is available via Chronoman field of window object
    var Timer = Chronoman.Timer;
    ...
</script>
```

### Example

```js
var tmrOne = new Timer({
    period: function(timer) {
        return 1000 + (timer.getExecutionQty() * 100);
    },
    action: function(timer) {
        console.log("---> Timer one. ", timer);
        if (! tmrThree.isActive()) {
            tmrThree.start();
        }
    }
});

var tmrTwo = new Timer();
tmrTwo.setPeriod([2000, , {start: 1000, end: 1500}])
    .setRepeatQty(9)
    .setPassToAction(true)
    .setAction({
        i: 0,
        execute: function(timer) {
            var nI = ++this.i;
            console.log("Timer two. #", nI, timer);
            tmrOne.setActive(nI % 2 === 1);
        }
    });

var tmrThree = new Timer()
                    .setPeriod(3000)
                    .setRepeatTest(function() {
                        return tmrTwo.isActive();
                    });
tmrThree.onExecute = function() {
    console.log("* Timer three. #", this.getExecutionQty() + 1);
};

tmrTwo.start();
```

See `test/chronoman.js` for additional examples.


## API

See `doc` folder.

## Related projects

* [NumGen](https://github.com/gamtiq/numgen)
* [povtor](https://github.com/gamtiq/povtor)

## Inspiration

This module is inspired by [qooxdoo](http://qooxdoo.org)'s `qx.event.Timer` class.

## Licence

Copyright (c) 2013-2020 Denis Sikuler  
Licensed under the MIT license.
