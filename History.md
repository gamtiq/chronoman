### 1.3.0 / 2020-01-01

* support object values for `period` property to have ability to get random time periods
* add fields `actionResult` and `onExecuteResult` to save results of calling `action` and `onExecute`
* add properties `startTime`, `executeTime` and `stopTime` to save start, execution and stop time
* `repeatTest` function can return any value that is supported for `period` property to control next execution scheduling
* export `getRandomValue` function

### 1.2.0 / 2019-12-26

* support of array and function values for `period` property
* support of `action` objects having `execute` method
* `repeatTest` function can return number to control next execution scheduling
* add `data` property

### 1.1.0 / 2019-03-03

* remove Jam support
* add types declaration file

### 1.0.0 / 2016-07-23

* add `repeatQty` and `repeatTest` properties to customize ability to repeat action
* add `executionQty` property to get number of how many times action was executed
* add `setProperties` method that allows change several properties of instance at once
* convert the source module to ES 6 format

### 0.1.0 / 2015-01-09

* migration to [Component](https://github.com/componentjs/component) 1.0

### 0.0.2 / 2013-09-02

* add `passToAction` property
* add UMD distribution `dist/chronoman.js` and `dist/chronoman.min.js`
