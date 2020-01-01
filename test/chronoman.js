"use strict";
/*global beforeEach, chai, describe, it, window*/

// Tests for chronoman
describe("chronoman", function() {
    var chronoman, expect, undef;
    
    // node
    if (typeof chai === "undefined") {
        chronoman = require("../dist/chronoman");
        expect = require("./lib/chai").expect;
    }
    // browser
    else {
        chronoman = window.Chronoman;
        expect = chai.expect;
    }
    
    describe("getRandomValue", function() {
        var getRandomValue = chronoman.getRandomValue;

        describe("getRandomValue(list)", function() {
            it("should return randomly selected item from list", function() {
                function check(list, nQty) {
                    if (typeof nQty !== "number") {
                        nQty = 10;
                    }
                    var result;
                    for (var nI = 0; nI < nQty; nI++) {
                        result = getRandomValue(list);
                        expect( list.indexOf(result) > -1 )
                            .equal( true );
                    }
                }
    
                check([1, 2, 3, 4]);
                check([true, false, null, undef]);
                check([1, "abc", chronoman, new Date(), {c: 4}, 0, "end"]);
            });

            it("should return first item from list", function() {
                function check(list) {
                    expect( getRandomValue(list) )
                        .equal( list[0] );
                }
    
                check([2]);
                check([true]);
                check([false]);
                check([null]);
                check([chronoman]);
            });

            it("should return undefined", function() {
                expect( getRandomValue([]) )
                    .equal( undef );
            });
        });

        describe("getRandomValue(start, [end], [bInteger])", function() {
            function check(nStart, nEnd, bInteger, bCheckInt, nQty) {
                /*jshint laxbreak:true*/
                var nMax = typeof nEnd === "number" ? nEnd : nStart + 1;
                var nL = arguments.length;
                if (nL < 4) {
                    bCheckInt = true;
                }
                if (typeof nQty !== "number") {
                    nQty = 10;
                }
                var nResult;

                for (var nI = 0; nI < nQty; nI++) {
                    nResult = nL > 2
                        ? getRandomValue(nStart, nEnd, bInteger)
                        : getRandomValue(nStart, nEnd);
                    expect( nStart <= nResult )
                        .equal( true );
                    expect( nResult <= nMax )
                        .equal( true );
                    if (bCheckInt) {
                        expect( nResult === Math.ceil(nResult) )
                            .equal( true );
                    }
                }
            }

            it("should return integer number from [start, end] interval", function() {
                check(0);
                check(473);
                check(0, 1);
                check(0, 9, 1);
                check(0, 9, "a");
                check(10, 178952, 345);
                check(-100, -40, true);
                check(-100, 100, 1);
            });

            it("should return number from [start, end] interval", function() {
                check(0, 1, false, false);
                check(0, 9, null, false);
                check(0, 9, undef, false);
                check(894, 899, 0, false);
                check(-200, -158, false, false);
                check(-210, 120, "", false);
            });
        });
    });
    
    describe("Timer", function() {
        var Timer = chronoman.Timer,
            nCounter;
    
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
            if (typeof data.before === "function") {
                data.before(timer);
            }

            nTimeout = typeof data.timeout === "number" ? data.timeout : timer.getPeriodValue() + 1000;
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
                    .equal(data.result || 0);
                expect( timer.isActive() )
                    .equal(data.finalActiveState || false);
                if ("actionResult" in data) {
                    expect( timer.actionResult )
                        .equal( data.actionResult );
                }
                if (typeof data.test === "function") {
                    data.test(timer);
                }
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
        
        describe("getPeriodValue()", function() {
            it("should return period value based on period property", function() {
                var timer = new Timer();
                var period, value;

                timer.setPeriod(5);

                expect( timer.getPeriodValue() )
                    .equal( timer.getPeriod() );

                timer.setPeriod([1, 2, 3, 4]);

                expect( timer.getPeriodValue() )
                    .equal( timer.getPeriod()[0] );

                timer.setExecutionQty(2);

                expect( timer.getPeriodValue() )
                    .equal( timer.getPeriod()[2] );

                timer.setExecutionQty(74);

                expect( timer.getPeriodValue() )
                    .equal( timer.getPeriod()[3] );

                period = 9000;
                timer.setPeriod(function() {
                    return period;
                });

                expect( timer.getPeriodValue() )
                    .equal( period );

                period = [700, 500, 300];
                timer.setPeriod(function() {
                    return period;
                });
                timer.setExecutionQty(1);

                expect( timer.getPeriodValue() )
                    .equal( period[1] );

                timer.setExecutionQty(3);

                expect( timer.getPeriodValue() )
                    .equal( period[2] );

                period = {
                    list: [100, 200, 300, 400]
                };
                timer.setPeriod(period);

                expect( period.list.indexOf(timer.getPeriodValue()) > -1 )
                    .equal(true );

                period = {
                    start: 50,
                    end: 250
                };
                timer.setPeriod(period);
                value = timer.getPeriodValue();

                expect( value >= period.start )
                    .equal( true );
                expect( value <= period.end )
                    .equal( true );
            });

            it("should return period value based on passed parameter", function() {
                var timer = new Timer({
                    period: 9274
                });
                var period, value;

                function getPeriod() {
                    return period;
                }

                period = 62;

                expect( timer.getPeriodValue(period) )
                    .equal( period );

                period = [1, 2, 3, 4];

                expect( timer.getPeriodValue(period) )
                    .equal( period[0] );

                timer.setExecutionQty(2);

                expect( timer.getPeriodValue(period) )
                    .equal( period[2] );

                timer.setExecutionQty(74);

                expect( timer.getPeriodValue(period) )
                    .equal( period[3] );

                period = 9000;

                expect( timer.getPeriodValue(getPeriod) )
                    .equal( period );

                period = [700, 500, 300];
                timer.setExecutionQty(1);

                expect( timer.getPeriodValue(getPeriod) )
                    .equal( period[1] );

                timer.setExecutionQty(3);

                expect( timer.getPeriodValue(getPeriod) )
                    .equal( period[2] );

                period = [
                    11,
                    22,
                    {
                        list: [100, 200, 300, 400]
                    },
                    44,
                    55
                ];
                timer.setExecutionQty(2);

                expect( period[2].list.indexOf(timer.getPeriodValue(period)) > -1 )
                    .equal(true );

                period = {
                    start: 50,
                    end: 250
                };
                value = timer.getPeriodValue(period);

                expect( value >= period.start )
                    .equal( true );
                expect( value <= period.end )
                    .equal( true );
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
                    timer = new Timer({period: nPeriod}),
                    nValue = 1;
                timer.onExecute = function() {
                    incCounter();
                    if (this.getExecutionQty() < nQty - 1) {
                        this.start(this.getPeriod() - 100);
                    }
                    nValue *= 2;
                    return nValue;
                };
                check({
                        timer: timer,
                        done: done,
                        result: nQty,
                        test: function(timer) {
                            expect( timer.onExecuteResult )
                                .equal( nValue );
                        },
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

            it("should use different periods from array", function(done) {
                var period = [400, 100, 100, 200];
                check({
                        timer: {
                                    period: period,
                                    recurrent: true,
                                    action: incCounter
                                },
                        done: done,
                        result: period.length,
                        finalActiveState: true,
                        timeout: 1000,
                        testContext: this
                        });
            });

            it("should use period returned from function", function(done) {
                check({
                        timer: {
                                    period: function(timer) {
                                        return timer.getExecutionQty() * 1000;
                                    },
                                    recurrent: true,
                                    action: incCounter
                                },
                        done: done,
                        result: 3,
                        finalActiveState: true,
                        timeout: 3500,
                        testContext: this
                        });
            });

            it("should use number returned from repeatTest as period", function(done) {
                check({
                        timer: {
                                    period: 100,
                                    data: 300,
                                    repeatTest: function(timer) {
                                        return timer.getData() - (timer.getExecutionQty() * 100);
                                    },
                                    action: incCounter
                                },
                        done: done,
                        result: 4,
                        timeout: 500,
                        testContext: this
                        });
            });

            it("should use value returned from repeatTest to calculate period", function(done) {
                check({
                    timer: {
                        period: 50,
                        data: [50, 100, 150, 200],
                        repeatTest: function(timer) {
                            /*jshint laxbreak:true*/
                            var data = timer.getData();
                            var nExecQty = timer.getExecutionQty();
                            var period;
                            if (nExecQty === 1) {
                                period = {
                                    start: data[0],
                                    end: data[1]
                                };
                            }
                            else if (nExecQty === 2) {
                                period = {
                                    list: [130, 140, 150]
                                };
                            }
                            else {
                                period = nExecQty < data.length
                                    ? data
                                    : false;
                            }
                            return period;
                        },
                        action: incCounter
                    },
                    done: done,
                    result: 4,
                    timeout: 600,
                    testContext: this
                });
            });

            it("should call execute method of action object", function(done) {
                check({
                        timer: {
                                    period: 100,
                                    passToAction: true,
                                    action: {
                                        i: 2,
                                        execute: function(timer) {
                                            nCounter = timer.getPeriod();
                                            timer.setPeriod( nCounter * this.i );
                                        }
                                    },
                                    repeatQty: 3
                                },
                        done: done,
                        result: 800,
                        timeout: 1600,
                        testContext: this
                        });
            });

            it("should save action result when action is function", function(done) {
                var nI = 10;
                check({
                        timer: {
                                    period: 100,
                                    repeatQty: 3,
                                    action: function() {
                                        nI += 10;
                                        return nI;
                                    }
                                },
                        test: function(timer) {
                            expect( timer.actionResult )
                                .equal( nI );
                        },
                        done: done,
                        timeout: 500,
                        testContext: this
                        });
            });

            it("should save action result when action is object", function(done) {
                check({
                        timer: {
                                    period: 100,
                                    action: {
                                        value: 3,
                                        execute: function() {
                                            return ++this.value;
                                        }
                                    }
                                },
                        actionResult: 4,
                        done: done,
                        timeout: 150,
                        testContext: this
                        });
            });

            it("should save start, execute and stop time", function(done) {
                check({
                    timer: {
                        period: 100,
                        repeatQty: 2,
                        action: incCounter
                    },
                    before: function(timer) {
                        expect( timer.getStartTime() )
                            .equal( null );
                        expect( timer.getStopTime() )
                            .equal( null );
                        expect( timer.getExecuteTime() )
                            .eql( [] );
                    },
                    result: 3,
                    test: function(timer) {
                        var startTime = timer.getStartTime(),
                            stopTime = timer.getStopTime(),
                            executeTime = timer.getExecuteTime(),
                            nL = executeTime.length,
                            nI, nTime;

                        expect( startTime )
                            .a( "number" );
                        expect( stopTime )
                            .a( "number" );
                        expect( nL )
                            .equal( 3 );

                        for (nI = 0; nI < nL; nI++) {
                            nTime = executeTime[nI];
                            expect( nTime )
                                .a( "number" );
                            if (nI) {
                                expect( executeTime[nI - 1] < nTime )
                                    .equal( true );
                            }
                        }

                        expect( startTime < executeTime[0] )
                            .equal( true );
                        expect( executeTime[nL - 1] <= stopTime )
                            .equal( true );
                    },
                    done: done,
                    timeout: 350,
                    testContext: this
                });
            });
        });
    });

});
