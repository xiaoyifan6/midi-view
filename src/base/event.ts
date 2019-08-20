
import { base } from "./base"

export namespace event {

    var events: { [key: string]: EventObject[] } = {};

    export const TOUCH: string = "touch";
    export const TOUCH_UP: string = "touch_up";
    export const TOUCH_DOWN: string = "touch_down";
    export const TOUCH_MOVE: string = "touch_move";
    export const TOUCH_SCALE: string = "scale";

    export type EventCbk = (e: EventObject) => void;

    export interface TouchData {
        x: number
        y: number
        detailX: number
        detailY: number
        oldX: number
        oldY: number
        x0: number
        y0: number
    }

    export interface EventObject {
        type: string,
        target: any,
        data: any,
        cbk: EventCbk
    }

    export function bind(type: string, cbk: EventCbk, target: any) {
        if (!events[type]) {
            events[type] = []
        }
        events[type].push({
            type: type,
            target: target,
            data: undefined,
            cbk: cbk,
        });
    }

    export function emit(type: string, data?: any) {
        for (var key in events[type]) {
            var obj = events[type][key];
            obj.data = data;
            events[type][key].cbk.call(obj.target, obj);
        }
    }

    export function emitComponent(type: string, data?: any) {
        if (data["x"] === undefined || data["y"] === undefined) return;
        var p = new base.Point(data["x"], data["y"]);

        for (var key in events[type]) {

            var obj = events[type][key];
            obj.data = data;

            if (obj.target instanceof base.Component) {
                var cmp = <base.Component>obj.target;
                cmp.tryActive(p);
                if (cmp.active && cmp.visible) {
                    obj.cbk.call(obj.target, obj);
                }
                if (type === TOUCH_UP || type === TOUCH) {
                    cmp.active = false;
                }
            }

            obj.data = undefined;

        }
    }


    export function cancel(type: string, cbk: EventCbk, target: any) {
        var index: number = -1;
        for (var key in events[type]) {
            var obj = events[type][key];
            if (obj.target === target && obj.cbk === cbk) {
                index = parseInt(key);
                break;
            }
        }
        if (index >= 0) {
            events[type].splice(index, 1);
        }
    }

    export function cancelAll() {
        for (var key in events) {
            delete events[key]
        }
        events = {}
    }
}

