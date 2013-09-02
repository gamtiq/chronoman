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
 *      </table>
 * @constructor
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
        if ("action" in initValue) {
            this.setAction(initValue.action);
        }
        if ("period" in initValue) {
            this.setPeriod(initValue.period);
        }
        if ("recurrent" in initValue) {
            this.setRecurrent(initValue.recurrent);
        }
        if ("active" in initValue) {
            this.setActive(initValue.active);
        }
        if ("passToAction" in initValue) {
            this.setPassToAction(initValue.passToAction);
        }
    }
};


/**
 * Time period in milliseconds.
 * A related action will be executed when the period is elapsed.
 *
 * @protected
 * @type {integer}
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
Timer.prototype.getPeriod = function() {
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
Timer.prototype.setPeriod = function(nPeriod) {
    this._period = nPeriod;
    return this;
};

/**
 * Indicates whether related action should be executed repeatedly.
 * 
 * @protected
 * @type {boolean}
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
 * Timer id.
 * 
 * @protected
 * @type {integer}
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
Timer.prototype._setTimeout = function() {
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
 * @type {boolean}
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
 * @see {@link module:chronoman~Timer#execute execute}
 */
Timer.prototype.setActive = function(bActive) {
    "use strict";
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
 * @param {Integer} [nPeriod]
 *      Time period in milliseconds that is used to schedule related action execution (new value for <code>period</code> property).
 *      The current value of <code>period</code> property is used by default.
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#setActive setActive}
 * @see {@link module:chronoman~Timer#setPeriod setPeriod}
 * @see {@link module:chronoman~Timer#stop stop}
 */
Timer.prototype.start = function(nPeriod) {
    "use strict";
    if (typeof nPeriod === "number") {
        this.setPeriod(nPeriod);
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
 * The timer instance to which the action is associated will be passed as function's parameter.
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
Timer.prototype.getAction = function() {
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
Timer.prototype.setAction = function(action) {
    this._action = action;
    return this;
};

/**
 * Indicates whether the timer instance (<code>this</code>) should be passed into action function when the function is called.
 * 
 * @protected
 * @type {boolean}
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
 * Execute related action (function).
 * Schedules next execution if action should be executed repeatedly.
 * <br>
 * The timer instance to which the action is associated will be passed as function's parameter
 * if {@link module:chronoman~Timer#setPassToAction passToAction} property is set to <code>true</code>.
 *
 * @return {Object}
 *      Reference to <code>this</code> object.
 * @method
 * @see {@link module:chronoman~Timer#getAction getAction}
 * @see {@link module:chronoman~Timer#isActive isActive}
 * @see {@link module:chronoman~Timer#isPassToAction isPassToAction}
 * @see {@link module:chronoman~Timer#isRecurrent isRecurrent}
 */
Timer.prototype.execute = function() {
    "use strict";
    /*jshint expr:true, laxbreak:true*/
    var action = this.getAction();
    this._clearTimeout();
    if (action) {
        this.isPassToAction()
            ? action(this)
            : action();
    }
    if (this.isActive() && this.isRecurrent()) {
        this._setTimeout();
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
    this._action = null;
};

/**
 * Convert object into string.
 *
 * @method
 */
Timer.prototype.toString = function() {
    "use strict";
    return [
            "Timer: ",
            "active - ", this.isActive(),
            ", period - ", this.getPeriod(),
            ", recurrent - ", this.isRecurrent(),
            ", pass to action - ", this.isPassToAction(),
            ", action - ", (this.getAction() ? "specified" : "no")
            ].join("");
};

// Exports

module.exports = Timer;
