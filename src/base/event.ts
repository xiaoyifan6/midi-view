
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
}

// export type EventCbk = (obj: EventObject, cmp: base.Component) => void;
// export type EventObject = {
//     p?: base.Point,
//     p0?: base.Point,
//     op?: base.Point,
//     detailX: number,
//     detailY: number
// }

// export type EventEvent = {
//     obj: base.Component,
//     cbk: EventCbk,
//     type: string
// }

// export class Event {
//     private static events: { [key: string]: EventEvent[] } = {};

//     public static bindClick(cbk: EventCbk, obj: base.Component) {
//         var type = "click";
//         if (!this.events[type]) {
//             this.events[type] = []
//         }
//         this.events[type].push({
//             obj: obj,
//             cbk: cbk,
//             type: type
//         });
//     }

//     public static bindDrag(cbk: EventCbk, obj: base.Component) {
//         var type = "drag";
//         if (!this.events[type]) {
//             this.events[type] = []
//         }
//         this.events[type].push({
//             obj: obj,
//             cbk: cbk,
//             type: type
//         });
//     }

//     public static bindScale(cbk: EventCbk, obj: base.Component) {
//         var type = "scale";
//         if (!this.events[type]) {
//             this.events[type] = []
//         }
//         this.events[type].push({
//             obj: obj,
//             cbk: cbk,
//             type: type
//         });
//     }

//     public static active(p: base.Point) {
//         for (var type in this.events) {
//             for (var key in this.events[type]) {
//                 this.events[type][key].obj.tryActive(p);
//             }
//         }
//     }

//     public static release() {
//         for (var type in this.events) {
//             for (var key in this.events[type]) {
//                 this.events[type][key].obj.active = false;
//             }
//         }
//     }

//     public static emitClick(x: number, y: number, active: boolean = false) {
//         var p = new base.Point(x, y);
//         var eobj: EventObject = {
//             p: p,
//             p0: p,
//             op: p,
//             detailX: x,
//             detailY: y,
//         }
//         var type = "click";
//         if (!this.events[type]) {
//             return;
//         }
//         for (var key in this.events[type]) {
//             var obj = this.events[type][key].obj;
//             if (obj.active || active) {
//                 this.events[type][key].cbk.call(obj, eobj, obj);
//             }
//         }
//     }

//     public static emitDrag(eobj: EventObject, active: boolean = false) {
//         var type = "drag";
//         if (!this.events[type]) {
//             return;
//         }
//         for (var key in this.events[type]) {
//             var obj = this.events[type][key].obj;
//             eobj.p && obj.tryActive(eobj.p)
//             if (obj.active || active) {
//                 this.events[type][key].cbk.call(obj, eobj, obj);
//             }
//         }
//     }

//     public static emitScale(eobj: EventObject, active: boolean = false) {
//         var type = "scale";
//         if (!this.events[type]) {
//             return;
//         }
//         for (var key in this.events[type]) {
//             var obj = this.events[type][key].obj;
//             eobj.p && obj.tryActive(eobj.p)
//             if (obj.active || active) {
//                 this.events[type][key].cbk.call(obj, eobj, obj);
//             }
//         }
//     }
// }