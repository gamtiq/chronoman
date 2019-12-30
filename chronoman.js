/**
 * @module chronoman
 * 
 * @author Denis Sikuler
 */


if (! Array.isArray) {
    Array.isArray = function(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };
}

/**
 * @callback module:chronoman~GetPeriodValue
 * @param {module:chronoman~Timer} [timer]
 * @return {Integer | Integer[]}
 */

/**
 * Value determining time period in milliseconds that is used to schedule related action execution.
 *
 * @typedef {Integer | Integer[] | module:chronoman~GetPeriodValue} module:chronoman~PeriodValue
 */

/**
 * Object describing action that should be executed after time period is elapsed.
 *
 * @typedef {Object} module:chronoman~ActionObject
 * @property {Function} execute
 *      Function that should be executed.
 */

/**
 * Action that should be executed after time period is elapsed.
 *
 * @typedef {Function | module:chronoman~ActionObject} module:chronoman~Action
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
    this._onTimeoutEnd = function() {
        that._timeoutId = null;
        that.execute();
    };

    if (initValue && typeof initValue === "object") {
        this.setProperties(initValue);
    }
};


/**
 * Time period in milliseconds, array of periods or function that returns period or array of periods.
 * A related action will be executed when the period is elapsed.
 * <br>
 * When array of periods is set the used period is selected in the following way:
 * first array item (with index 0) specifies period before first action's execution,
 * second array item (with index 1) specifies period before second action's execution,
 * and so on.
 * When quantity of action executions is more than array's length
 * the last item of array is used as period for subsequent executions.
 * <br>
 * When function is set its returned value is used to determine next period.
 * The timer instance to which the function is associated will be passed as function's parameter.
 * When function returns an array of periods the array is used to select period before next execution
 * according to rules described above.
 *
 * @protected
 * @type {module:chronoman~PeriodValue}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#setActive setActive}
 */
Timer.prototype._period = null;

/**
 * Return value determining time period that is used to schedule related action execution.
 *
 * @return {module:chronoman~PeriodValue}
 *      Value determining time period.
 * @method
 * @see {@link module:chronoman~Timer#_period _period}
 */
Timer.prototype.getPeriod = function() {
    return this._period;
};

/**
 * Set value determining time period that is used to schedule related action execution.
 *
 * @param {module:chronoman~PeriodValue} period
 *      Value determining time period.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_period _period}
 */
Timer.prototype.setPeriod = function(period) {
    this._period = period;
    return this;
};

/**
 * Return time period that will be used to schedule related action execution.
 *
 * @return {Integer}
 *      Time period in milliseconds.
 * @method
 * @see {@link module:chronoman~Timer#_period _period}
 * @see {@link module:chronoman~Timer#getPeriod getPeriod}
 * @see {@link module:chronoman~Timer#getExecutionQty getExecutionQty}
 */
Timer.prototype.getPeriodValue = function() {
    var execQty;
    var period = this.getPeriod();
    if (typeof period === "function") {
        period = period(this);
    }
    if (Array.isArray(period)) {
        execQty = this.getExecutionQty();
        period = period[ execQty < period.length ? execQty : period.length - 1 ];
    }
    return period;
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
Timer.prototype.isRecurrent = function() {
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
Timer.prototype.setRecurrent = function(bRecurrent) {
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
Timer.prototype.getRepeatQty = function() {
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
Timer.prototype.setRepeatQty = function(nQty) {
    this._repeatQty = nQty;
    return this;
};

/**
 * Specifies function that should be called after action execution to determine
 * whether execution should be repeated.
 * If the function returns a true value or non-negative number it means that execution will be repeated.
 * When the function returns non-negative number this number will be used
 * as time period in milliseconds to schedule next action execution.
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
Timer.prototype.getRepeatTest = function() {
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
Timer.prototype.setRepeatTest = function(test) {
    this._repeatTest = test;
    return this;
};

/**
 * Auxiliary data associated with the timer instance.
 *
 * @protected
 * @type {*}
 */
Timer.prototype._data = null;

/**
 * Return auxiliary data associated with the timer instance.
 *
 * @return {*}
 *      Auxiliary data associated with the timer instance.
 * @method
 * @see {@link module:chronoman~Timer#_data _data}
 */
Timer.prototype.getData = function() {
    return this._data;
};

/**
 * Set auxiliary data associated with the timer instance.
 *
 * @param {*} data
 *      Auxiliary data associated with the timer instance.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_data _data}
 */
Timer.prototype.setData = function(data) {
    this._data = data;
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
Timer.prototype.getExecutionQty = function() {
    return this._executionQty;
};

/**
 * Set the value that indicates how many times action was executed.
 *
 * @param {Integer} nQty
 *      Value that indicates how many times action was executed.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_executionQty _executionQty}
 */
Timer.prototype.setExecutionQty = function(nQty) {
    this._executionQty = nQty > 0 ? nQty : 0;
    return this;
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
 * @param {Integer} [nTimeout]
 *      Time period in milliseconds that is used to schedule action execution.
 *      By default the current value of {@link module:chronoman~Timer#getPeriod period} property is used
 *      to determine time period.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @protected
 * @see {@link module:chronoman~Timer#_clearTimeout _clearTimeout}
 * @see {@link module:chronoman~Timer#_onTimeoutEnd _onTimeoutEnd}
 * @see {@link module:chronoman~Timer#_timeoutId _timeoutId}
 * @see {@link module:chronoman~Timer#execute execute}
 * @see {@link module:chronoman~Timer#getPeriodValue getPeriodValue}
 */
Timer.prototype._setTimeout = function(nTimeout) {
    "use strict";
    var period;
    if (typeof nTimeout === "number") {
        period = nTimeout;
    }
    else {
        period = this.getPeriodValue();
    }
    if (typeof period === "number") {
        this._timeoutId = setTimeout(this._onTimeoutEnd, period);
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
Timer.prototype._clearTimeout = function() {
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
Timer.prototype.isActive = function() {
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
Timer.prototype.setActive = function(bActive) {
    "use strict";
    if (bActive && ! this._active) {
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
 * @param {module:chronoman~PeriodValue | Object} [property]
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
Timer.prototype.start = function(property) {
    "use strict";
    var propType = typeof property;
    if (propType === "number" || propType === "function" || Array.isArray(property)) {
        this.setPeriod(property);
    }
    else if (property && propType === "object") {
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
Timer.prototype.stop = function() {
    return this.setActive(false);
};

/**
 * Related action that should be executed after time period is elapsed.
 * <br>
 * Can be a function or an object having <code>execute</code> method.
 * <br>
 * The timer instance to which the action is associated will be passed as function's/method's parameter
 * if {@link module:chronoman~Timer#setPassToAction passToAction} property is set to <code>true</code>.
 *
 * @protected
 * @type {module:chronoman~Action}
 * @see {@link module:chronoman~Timer#execute execute}
 */
Timer.prototype._action = null;

/**
 * Return value that represents action.
 *
 * @return {module:chronoman~Action}
 *      Function that represents action.
 * @method
 * @see {@link module:chronoman~Timer#_action _action}
 */
Timer.prototype.getAction = function() {
    return this._action;
};

/**
 * Set value which represents action that should be executed after time period is elapsed.
 *
 * @param {module:chronoman~Action} action
 *      Value that represents action.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#_action _action}
 */
Timer.prototype.setAction = function(action) {
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
Timer.prototype.isPassToAction = function() {
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
Timer.prototype.setPassToAction = function(bPass) {
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
 *              <td>data</td>
 *              <td>Any</td>
 *              <td>Auxiliary data associated with the timer instance.</td>
 *          </tr>
 *          <tr>
 *              <td>passToAction</td>
 *              <td>Boolean</td>
 *              <td>Whether the timer instance should be passed into action function when the function is called.</td>
 *          </tr>
 *          <tr>
 *              <td>period</td>
 *              <td>module:chronoman~PeriodValue</td>
 *              <td>Value determining time period in milliseconds that is used to schedule related action execution.</td>
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
 * @see {@link module:chronoman~Timer#setData setData}
 * @see {@link module:chronoman~Timer#setPassToAction setPassToAction}
 * @see {@link module:chronoman~Timer#setPeriod setPeriod}
 * @see {@link module:chronoman~Timer#setRecurrent setRecurrent}
 * @see {@link module:chronoman~Timer#setRepeatQty setRepeatQty}
 * @see {@link module:chronoman~Timer#setRepeatTest setRepeatTest}
 */
Timer.prototype.setProperties = function(propMap) {
    if (propMap && typeof propMap === "object") {
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
        if ("data" in propMap) {
            this.setData(propMap.data);
        }
    }
    return this;
};

/**
 * Result of {@link module:chronoman~Timer#_action action}'s last execution.
 *
 * @type {*}
 * @see {@link module:chronoman~Timer#_action action}
 */
Timer.prototype.actionResult = void 0;

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
 * Result of {@link module:chronoman~Timer#onExecute onExecute} last execution.
 *
 * @type {*}
 * @see {@link module:chronoman~Timer#onExecute onExecute}
 */
Timer.prototype.onExecuteResult = void 0;

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
 * <li>specified repeat test is passed i.e. the test function returns true value or non-negative number (see {@link module:chronoman~Timer#getRepeatTest getRepeatTest});
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
Timer.prototype.execute = function() {
    "use strict";
    /*jshint expr:true, laxbreak:true*/
    var action = this.getAction(),
        bPassToAction = this.isPassToAction(),
        repeatTest = this.getRepeatTest(),
        bActive, period;
    this._clearTimeout();
    if (action) {
        if (typeof action === "function") {
            this.actionResult = bPassToAction
                ? action(this)
                : action();
        }
        else if (typeof action.execute === "function") {
            this.actionResult = bPassToAction
                ? action.execute(this)
                : action.execute();
        }
    }
    if (typeof this.onExecute === "function") {
        this.onExecuteResult = bPassToAction
            ? this.onExecute(this)
            : this.onExecute();
    }
    this._executionQty++;
    bActive = this.isActive();
    if (bActive
            && (this.isRecurrent()
                    || this.getRepeatQty() >= this._executionQty
                    || (repeatTest
                        && ( (period = repeatTest(this)) || period === 0 )
                        && (typeof period !== "number" || period >= 0))
                ) ) {
        this._setTimeout(period);
    }
    else if (bActive && ! this._timeoutId) {
        this._active = false;
    }
    return this;
};

/**
 * Free resources that are allocated for object.
 *
 * @method
 */
Timer.prototype.dispose = function() {
    "use strict";
    this._clearTimeout();
    this._action =
        this._data =
        this._period =
        this._repeatTest =
        this.onExecute =
            null;
};

/**
 * Convert object into string.
 *
 * @method
 */
Timer.prototype.toString = function() {
    "use strict";
    var period = this.getPeriod();
    return [
            "Timer: ",
            "active - ", this.isActive(),
            ", period - ", typeof period === "function" ? "function" : period,
            ", recurrent - ", this.isRecurrent(),
            ", repeat qty - ", this.getRepeatQty(),
            ", repeat test - ", (this.getRepeatTest() ? "specified" : "no"),
            ", pass to action - ", this.isPassToAction(),
            ", action - ", (this.getAction() ? "specified" : "no"),
            ", execution qty - ", this.getExecutionQty(),
            ", data - ", this.getData()
            ].join("");
};

// Exports

export default Timer;
