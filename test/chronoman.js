"use strict";
/*global beforeEach, chai, describe, it, window*/

// Tests for chronoman
describe("chronoman", function() {
    var expect, nCounter, Timer;
    
    // node
    if (typeof chai === "undefined") {
        Timer = require("../chronoman");
        expect = require("./lib/chai").expect;
    }
    // browser
    else {
        Timer = window.Chronoman;
        expect = chai.expect;
    }
    
    function incCounter() {
        nCounter++;
    }
    
    function resetCounter() {
        nCounter = 0;
    }
    
    function check(data) {
        var done = data.done,
            timer = data.timer,
            nTimeout;
        if (! (timer instanceof Timer)) {
            timer = new Timer(timer);
        }
        nTimeout = typeof data.timeout === "number" ? data.timeout : timer.getPeriod() + 1000;
        if (data.testContext) {
            data.testContext.timeout(nTimeout + 1000);
        }
        if (! timer.isActive()) {
            timer.start(data.startData || null);
        }
        else if (data.stop) {
            if (data.stopTime) {
                setTimeout(function stopTimer() {timer.stop();}, data.stopTime);
            }
            else {
                timer.stop();
            }
        }
        setTimeout(function checkTimer() {
            expect( nCounter )
                .equal(data.result);
            expect( timer.isActive() )
                .equal(data.finalActiveState || false);
            timer.stop();
            if (typeof done === "function") {
                done();
            }
        }, nTimeout);
    }
    
    beforeEach(resetCounter);
    
    describe("One-time timer", function() {
        it("should execute action once", function(done) {
            check({timer: {period: 1000, action: incCounter}, done: done, result: 1, testContext: this});
        });
        
        it("should execute action once and call onExecute", function(done) {
            var timer = new Timer({period: 1000, action: incCounter});
            timer.onExecute = incCounter;
            check({timer: timer, done: done, result: 2, testContext: this});
        });
        
        it("should cancel scheduled action", function(done) {
            check({
                    timer: {period: 1000, action: incCounter, active: true},
                    done: done,
                    result: 0,
                    stop: true,
                    stopTime: 500,
                    testContext: this
                    });
        });
    });
    
    describe("Recurrent timer", function() {
        it("should execute action several times", function(done) {
            check({
                    startData: {period: 1000, action: incCounter, recurrent: true},
                    done: done,
                    result: 3,
                    finalActiveState: true,
                    timeout: 3500,
                    testContext: this
                    });
        });
        
        it("should execute action specified number of times by calling onExecute", function(done) {
            var nPeriod = 300,
                nQty = 8,
                timer = new Timer({period: nPeriod, repeatQty: nQty - 1});
            timer.onExecute = incCounter;
            check({
                    timer: timer,
                    done: done,
                    result: nQty,
                    timeout: (nPeriod * nQty) + 1000,
                    testContext: this
                    });
        });
        
        it("should execute action while specified function returns a true value", function(done) {
            var nPeriod = 500,
                nQty = 5;
            check({
                    timer: {
                                period: nPeriod,
                                action: incCounter,
                                repeatTest: function(timer) {
                                    return timer.getExecutionQty() < nQty;
                                }
                            },
                    done: done,
                    result: nQty,
                    timeout: (nPeriod * nQty) + 1000,
                    testContext: this
                    });
        });
    });
    
    describe("Timer features", function() {
        it("should change timer properties", function(done) {
            var nPeriod = 300,
                nQty = 3;
            check({
                    timer: {
                                period: nPeriod + 200,
                                passToAction: true,
                                action: function(timer) {
                                    timer.setProperties({period: nPeriod, repeatQty: nQty, action: incCounter});
                                }
                            },
                    done: done,
                    result: nQty,
                    timeout: (nPeriod * nQty) + 2000,
                    testContext: this
                    });
        });
        
        it("should schedule next execution inside onExecute function", function(done) {
            var nPeriod = 1000,
                nQty = 5,
                timer = new Timer({period: nPeriod});
            timer.onExecute = function() {
                incCounter();
                if (this.getExecutionQty() < nQty - 1) {
                    this.start(this.getPeriod() - 100);
                }
            };
            check({
                    timer: timer,
                    done: done,
                    result: nQty,
                    timeout: (nPeriod * nQty) + 2000,
                    testContext: this
                    });
        });
        
        it("should postpone action execution", function(done) {
            var nPeriod1 = 1000,
                nPeriod2 = nPeriod1 * 0.5,
                nQty = 6,
                nPause = nPeriod2 * nQty,
                timer1 = new Timer({period: nPeriod1, action: incCounter, recurrent: true}),
                timer2 = new Timer({
                                        active: true,
                                        period: nPeriod2,
                                        repeatQty: nQty - 1,
                                        action: function() {
                                            timer1.setActive(true);
                                        }
                                    });
            check({
                    timer: timer1,
                    done: done,
                    result: 1,
                    finalActiveState: true,
                    timeout: nPause + nPeriod1 + nPeriod2,
                    testContext: this
                    });
            check({
                    timer: timer2,
                    result: 0,
                    timeout: nPause + nPeriod2
                    });
        });
    });
});
