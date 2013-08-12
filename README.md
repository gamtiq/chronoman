# chronoman

Utility class to simplify use of timers created by setTimeout

## Installation

### Node

    npm install chronoman

### Component

Install component:

    npm install -g component

Then:

    component install gamtiq/chronoman

## Usage

### Node, Component

```js

    var nI = 0;
    var Timer = require("chronoman");
    
    var tmrOne = new Timer({
        period: 1000,
        action: function(timer) {
            console.log("---> Timer one. ", timer);
        }
    });
    
    var tmrTwo = new Timer();
    tmrTwo.setPeriod(2000)
        .setRecurrent(true)
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

