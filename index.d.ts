// Created on the basis of http://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html

export as namespace Chronoman;

export = Timer;

declare class Timer {
    constructor(initValue?: Timer.Properties);

    protected _period: number | null;
    getPeriod(): number | null;
    setPeriod(period: number | null): Timer;

    protected _recurrent: boolean;
    isRecurrent(): boolean;
    setRecurrent(recurrent: boolean): Timer;

    protected _repeatQty: number;
    getRepeatQty(): number;
    setRepeatQty(qty: number): Timer;

    protected _repeatTest: Timer.RepeatTest | null;
    getRepeatTest(): Timer.RepeatTest | null;
    setRepeatTest(test: Timer.RepeatTest | null): Timer;

    protected _executionQty: number;
    getExecutionQty(): number;

    protected _timeoutId: number | null;
    protected _setTimeout(): Timer;
    protected _clearTimeout(): Timer;

    protected _active: boolean;
    isActive(): boolean;
    setActive(active: boolean): Timer;

    start(periodOrProps?: number | Timer.Properties): Timer;
    stop(): Timer;

    protected _action: Timer.Action | null;
    getAction(): Timer.Action | null;
    setAction(action: Timer.Action | null): Timer;

    protected _passToAction: boolean;
    isPassToAction(): boolean;
    setPassToAction(pass: boolean): Timer;

    setProperties(propMap: Timer.Properties): Timer;

    onExecute: Timer.Action | null;

    execute(): Timer;

    dispose(): void;

    toString(): string;
}

declare namespace Timer {
    export type Action = (timer?: Timer) => any;

    export type RepeatTest = (timer: Timer) => boolean;

    export interface Properties {
        action?: Action;
        active?: boolean;
        passToAction?: boolean;
        period?: number;
        recurrent?: boolean;
        repeatQty?: number;
        repeatTest?: RepeatTest;
    }
}
