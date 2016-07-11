"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * @module chronoman
 * 
 * @author Denis Sikuler
 */

/**
 * Utility class to simplify use of timers created by setTimeout.
 * 
 * @param {Object} [initValue]
 *      Specifies initial property values. Keys are property names, their values are values of corresponding properties.
 *      See {@link module:chronoman~Timer#setProperties setProperties} for details.
 * @constructor
 * @see {@link module:chronoman~Timer#setProperties setProperties}
 */
var Timer = function Timer(initValue) {

    var that = this;

    /**
     * Handle timeout's end.
     *
     * @instance
     * @method
     * @protected
     * @see {@link module:chronoman~Timer#_timeoutId _timeoutId}
     * @see {@link module:chronoman~Timer#execute execute}
     */
    this._onTimeoutEnd = function () {
        that._timeoutId = null;
        that.execute();
    };

    if (initValue && (typeof initValue === "undefined" ? "undefined" : _typeof(initValue)) === "object") {
        this.setProperties(initValue);
    }
};

/**
 * Time period in milliseconds.
 * A related action will be executed when the period is elapsed.
 *
 * @protected
 * @type {Integer}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#setActive setActive}
 */
Timer.prototype._period = null;

/**
 * Return time period that is used to schedule related action execution.
 *
 * @return {Integer}
 *      Time period in milliseconds.
 * @method
 * @see {@link module:chronoman~Timer#_period _period}
 */
Timer.prototype.getPeriod = function () {
    return this._period;
};

/**
 * Set time period that is used to schedule related action execution.
 *
 * @param {Integer} nPeriod
 *      Time period in milliseconds.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_period _period}
 */
Timer.prototype.setPeriod = function (nPeriod) {
    this._period = nPeriod;
    return this;
};

/**
 * Indicates whether related action should be executed repeatedly.
 * 
 * @protected
 * @type {Boolean}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#setActive setActive}
 */
Timer.prototype._recurrent = false;

/**
 * Test whether related action should be executed repeatedly.
 *
 * @return {Boolean}
 *      <code>true</code>, if related action should be executed repeatedly, otherwise <code>false</code>.
 * @method
 * @see {@link module:chronoman~Timer#_recurrent _recurrent}
 */
Timer.prototype.isRecurrent = function () {
    return this._recurrent;
};

/**
 * Set or cancel repeating of related action execution.
 *
 * @param {Boolean} bRecurrent
 *      <code>true</code>, if action should be executed repeatedly, <code>false</code>, if action repeating should be off.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_recurrent _recurrent}
 */
Timer.prototype.setRecurrent = function (bRecurrent) {
    this._recurrent = bRecurrent;
    return this;
};

/**
 * Specifies how many times related action should be repeated after first execution.
 *
 * @protected
 * @type {Integer}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#setActive setActive}
 */
Timer.prototype._repeatQty = 0;

/**
 * Return the value that indicates how many times related action should be repeated after first execution.
 *
 * @return {Integer}
 *      Value that indicates how many times related action should be repeated after first execution.
 * @method
 * @see {@link module:chronoman~Timer#_repeatQty _repeatQty}
 */
Timer.prototype.getRepeatQty = function () {
    return this._repeatQty;
};

/**
 * Set how many times related action should be repeated after first execution.
 *
 * @param {Integer} nQty
 *      Value that indicates how many times related action should be repeated after first execution.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_repeatQty _repeatQty}
 */
Timer.prototype.setRepeatQty = function (nQty) {
    this._repeatQty = nQty;
    return this;
};

/**
 * Specifies function that should be called after first action execution to determine
 * whether execution should be repeated.
 * If the function returns a true value it means that execution will be repeated.
 * <br>
 * The timer instance to which the test is associated will be passed as function's parameter.
 *
 * @protected
 * @type {Function}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#setActive setActive}
 */
Timer.prototype._repeatTest = null;

/**
 * Return the function that is used to determine whether action execution should be repeated.
 *
 * @return {Function}
 *      Function that is used to determine whether action execution should be repeated.
 * @method
 * @see {@link module:chronoman~Timer#_repeatTest _repeatTest}
 */
Timer.prototype.getRepeatTest = function () {
    return this._repeatTest;
};

/**
 * Set the function that should be used to determine whether action execution should be repeated.
 *
 * @param {Function} test
 *      Function that should be used to determine whether action execution should be repeated.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_repeatTest _repeatTest}
 */
Timer.prototype.setRepeatTest = function (test) {
    this._repeatTest = test;
    return this;
};

/**
 * Specifies how many times action was executed.
 *
 * @protected
 * @type {Integer}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#setActive setActive}
 */
Timer.prototype._executionQty = 0;

/**
 * Return the value that indicates how many times action was executed.
 *
 * @return {Integer}
 *      Value that indicates how many times action was executed.
 * @method
 * @see {@link module:chronoman~Timer#_executionQty _executionQty}
 */
Timer.prototype.getExecutionQty = function () {
    return this._executionQty;
};

/**
 * Timer id.
 * 
 * @protected
 * @type {Integer}
 * @see {@link module:chronoman~Timer#_clearTimeout _clearTimeout}
 * @see {@link module:chronoman~Timer#_setTimeout _setTimeout}
 */
Timer.prototype._timeoutId = null;

/**
 * Schedule related action execution.
 *
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @protected
 * @see {@link module:chronoman~Timer#_clearTimeout _clearTimeout}
 * @see {@link module:chronoman~Timer#_onTimeoutEnd _onTimeoutEnd}
 * @see {@link module:chronoman~Timer#_timeoutId _timeoutId}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#getPeriod getPeriod}
 */
Timer.prototype._setTimeout = function () {
    "use strict";

    var nPeriod = this.getPeriod();
    if (typeof nPeriod === "number") {
        this._timeoutId = setTimeout(this._onTimeoutEnd, nPeriod);
    }
    return this;
};

/**
 * Cancel execution of scheduled action.
 *
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @protected
 * @see {@link module:chronoman~Timer#_setTimeout _setTimeout}
 * @see {@link module:chronoman~Timer#_timeoutId _timeoutId}
 */
Timer.prototype._clearTimeout = function () {
    "use strict";

    if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
    }
    return this;
};

/**
 * Indicates whether timer is in use.
 * 
 * @protected
 * @type {Boolean}
 * @see {@link module:chronoman~Timer#execute execute}
 */
Timer.prototype._active = false;

/**
 * Test whether timer is in use.
 *
 * @return {Boolean}
 *      <code>true</code>, if timer is in use, otherwise <code>false</code>.
 * @method
 * @see {@link module:chronoman~Timer#_active _active}
 */
Timer.prototype.isActive = function () {
    return this._active;
};

/**
 * Set or cancel timer usage.
 * Depending of this schedules related action execution or cancels action execution.
 * <br>
 * Consecutive calling with <code>bActive = true</code> leads to related action execution delaying.
 *
 * @param {Boolean} bActive
 *      <code>true</code> to schedule related action execution, <code>false</code> to cancel action execution.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_active _active}
 * @see {@link module:chronoman~Timer#_executionQty _executionQty}
 * @see {@link module:chronoman~Timer#execute execute}
 */
Timer.prototype.setActive = function (bActive) {
    "use strict";

    if (bActive && !this._active) {
        this._executionQty = 0;
    }
    this._active = bActive;
    // Consecutive calling with bActive = true leads to action execution delaying
    this._clearTimeout();
    if (bActive) {
        this._setTimeout();
    }
    return this;
};

/**
 * Start timer usage (make it active).
 *
 * @param {Integer | Object} [property]
 *      Time period in milliseconds that is used to schedule related action execution
 *      (new value for {@link module:chronoman~Timer#setPeriod period} property)
 *      or object that specifies new values for timer properties (see {@link module:chronoman~Timer#setProperties setProperties}).
 *      The current value of {@link module:chronoman~Timer#getPeriod period} property is used by default.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#setActive setActive}
 * @see {@link module:chronoman~Timer#setPeriod setPeriod}
 * @see {@link module:chronoman~Timer#setProperties setProperties}
 * @see {@link module:chronoman~Timer#stop stop}
 */
Timer.prototype.start = function (property) {
    "use strict";

    if (typeof property === "number") {
        this.setPeriod(property);
    } else if (property && (typeof property === "undefined" ? "undefined" : _typeof(property)) === "object") {
        this.setProperties(property);
    }
    return this.setActive(true);
};

/**
 * Stop timer usage (make it inactive).
 *
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#setActive setActive}
 * @see {@link module:chronoman~Timer#start start}
 */
Timer.prototype.stop = function () {
    return this.setActive(false);
};

/**
 * Related action that should be executed after time period is elapsed.
 * <br>
 * The timer instance to which the action is associated will be passed as function's parameter
 * if {@link module:chronoman~Timer#setPassToAction passToAction} property is set to <code>true</code>.
 *
 * @protected
 * @type {Function}
 * @see {@link module:chronoman~Timer#execute execute}
 */
Timer.prototype._action = null;

/**
 * Return function that represents action.
 *
 * @return {Function}
 *      Function that represents action.
 * @method
 * @see {@link module:chronoman~Timer#_action _action}
 */
Timer.prototype.getAction = function () {
    return this._action;
};

/**
 * Set function which represents action that should be executed after time period is elapsed.
 *
 * @param {Function} action
 *      Function that represents action.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_action _action}
 */
Timer.prototype.setAction = function (action) {
    this._action = action;
    return this;
};

/**
 * Indicates whether the timer instance (<code>this</code>) should be passed into action function when the function is called.
 * 
 * @protected
 * @type {Boolean}
 * @see {@link module:chronoman~Timer#execute execute}
 */
Timer.prototype._passToAction = false;

/**
 * Test whether the timer instance should be passed into action function when the function is called.
 *
 * @return {Boolean}
 *      <code>true</code>, if the timer instance should be passed, otherwise <code>false</code>.
 * @method
 * @see {@link module:chronoman~Timer#_passToAction _passToAction}
 */
Timer.prototype.isPassToAction = function () {
    return this._passToAction;
};

/**
 * Set or cancel passing of timer instance into action function.
 *
 * @param {Boolean} bPass
 *      <code>true</code>, if the timer instance should be passed into action function, 
 *      <code>false</code>, if the instance should not be passed.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_passToAction _passToAction}
 */
Timer.prototype.setPassToAction = function (bPass) {
    this._passToAction = bPass;
    return this;
};

/**
 * Set timer properties.
 *
 * @param {Object} propMap
 *      Specifies property values. Keys are property names, their values are values of corresponding properties.
 *      The following keys (properties) can be specified:
 *      <table>
 *          <tr>
 *              <th>Name</th>
 *              <th>Type</th>
 *              <th>Description</th>
 *          </tr>
 *          <tr>
 *              <td>action</td>
 *              <td>Function</td>
 *              <td>Related action that should be executed after time period is elapsed.</td>
 *          </tr>
 *          <tr>
 *              <td>active</td>
 *              <td>Boolean</td>
 *              <td>Whether timer usage should be immediately started.</td>
 *          </tr>
 *          <tr>
 *              <td>passToAction</td>
 *              <td>Boolean</td>
 *              <td>Whether the timer instance should be passed into action function when the function is called.</td>
 *          </tr>
 *          <tr>
 *              <td>period</td>
 *              <td>Integer</td>
 *              <td>Time period in milliseconds that is used to schedule related action execution.</td>
 *          </tr>
 *          <tr>
 *              <td>recurrent</td>
 *              <td>Boolean</td>
 *              <td>Whether related action should be executed repeatedly.</td>
 *          </tr>
 *          <tr>
 *              <td>repeatQty</td>
 *              <td>Integer</td>
 *              <td>How many times related action should be repeated after first execution.</td>
 *          </tr>
 *          <tr>
 *              <td>repeatTest</td>
 *              <td>Function</td>
 *              <td>Function that should be used to determine whether action execution should be repeated.</td>
 *          </tr>
 *      </table>
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#setAction setAction}
 * @see {@link module:chronoman~Timer#setActive setActive}
 * @see {@link module:chronoman~Timer#setPassToAction setPassToAction}
 * @see {@link module:chronoman~Timer#setPeriod setPeriod}
 * @see {@link module:chronoman~Timer#setRecurrent setRecurrent}
 * @see {@link module:chronoman~Timer#setRepeatQty setRepeatQty}
 * @see {@link module:chronoman~Timer#setRepeatTest setRepeatTest}
 */
Timer.prototype.setProperties = function (propMap) {
    if (propMap && (typeof propMap === "undefined" ? "undefined" : _typeof(propMap)) === "object") {
        if ("action" in propMap) {
            this.setAction(propMap.action);
        }
        if ("period" in propMap) {
            this.setPeriod(propMap.period);
        }
        if ("recurrent" in propMap) {
            this.setRecurrent(propMap.recurrent);
        }
        if ("repeatQty" in propMap) {
            this.setRepeatQty(propMap.repeatQty);
        }
        if ("repeatTest" in propMap) {
            this.setRepeatTest(propMap.repeatTest);
        }
        if ("active" in propMap) {
            this.setActive(propMap.active);
        }
        if ("passToAction" in propMap) {
            this.setPassToAction(propMap.passToAction);
        }
    }
    return this;
};

/**
 * Function that should be executed after time period is elapsed.
 * <br>
 * The timer instance to which the function is associated will be passed as function's parameter
 * if {@link module:chronoman~Timer#setPassToAction passToAction} property is set to <code>true</code>.
 *
 * @type {Function}
 * @see {@link module:chronoman~Timer#execute execute}
 */
Timer.prototype.onExecute = null;

/**
 * Execute related action (function).
 * <br>
 * The timer instance to which the action is associated will be passed as function's parameter
 * if {@link module:chronoman~Timer#setPassToAction passToAction} property is set to <code>true</code>.
 * <br>
 * Action's next execution will be scheduled when one of the following conditions is true:
 * <ul>
 * <li>timer is set as recurrent (see {@link module:chronoman~Timer#isRecurrent isRecurrent});
 * <li>specified quantity of repeats is not reached (see {@link module:chronoman~Timer#getRepeatQty getRepeatQty});
 * <li>specified repeat test is passed i.e. the test function returns true value (see {@link module:chronoman~Timer#getRepeatTest getRepeatTest});
 * </ul>
 *
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_active _active}
 * @see {@link module:chronoman~Timer#_executionQty _executionQty}
 * @see {@link module:chronoman~Timer#getAction getAction}
 * @see {@link module:chronoman~Timer#getRepeatQty getRepeatQty}
 * @see {@link module:chronoman~Timer#getRepeatTest getRepeatTest}
 * @see {@link module:chronoman~Timer#isActive isActive}
 * @see {@link module:chronoman~Timer#isPassToAction isPassToAction}
 * @see {@link module:chronoman~Timer#isRecurrent isRecurrent}
 * @see {@link module:chronoman~Timer#onExecute onExecute}
 */
Timer.prototype.execute = function () {
    "use strict";
    /*jshint expr:true, laxbreak:true*/

    var action = this.getAction(),
        bPassToAction = this.isPassToAction(),
        repeatTest = this.getRepeatTest(),
        bActive;
    this._clearTimeout();
    if (action) {
        bPassToAction ? action(this) : action();
    }
    if (typeof this.onExecute === "function") {
        bPassToAction ? this.onExecute(this) : this.onExecute();
    }
    this._executionQty++;
    bActive = this.isActive();
    if (bActive && (this.isRecurrent() || this.getRepeatQty() >= this._executionQty || repeatTest && repeatTest(this))) {
        this._setTimeout();
    } else if (bActive && !this._timeoutId) {
        this._active = false;
    }
    return this;
};

/**
 * Free resources that are allocated for object.
 *
 * @method
 */
Timer.prototype.dispose = function () {
    "use strict";

    this._clearTimeout();
    this._action = this._repeatTest = this.onExecute = null;
};

/**
 * Convert object into string.
 *
 * @method
 */
Timer.prototype.toString = function () {
    "use strict";

    return ["Timer: ", "active - ", this.isActive(), ", period - ", this.getPeriod(), ", recurrent - ", this.isRecurrent(), ", repeat qty - ", this.getRepeatQty(), ", repeat test - ", this.getRepeatTest() ? "specified" : "no", ", pass to action - ", this.isPassToAction(), ", action - ", this.getAction() ? "specified" : "no", ", execution qty - ", this.getExecutionQty()].join("");
};

// Exports

exports.default = Timer;
module.exports = exports["default"];
