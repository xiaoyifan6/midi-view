
import { base } from "../base/rect"

export type EventCbk = (obj: EventObject, cmp: base.Component) => void;
export type EventObject = {
    p?: base.Point,
    p0?: base.Point,
    op?: base.Point,
    detailX: number,
    detailY: number
}

export type EventEvent = {
    obj: base.Component,
    cbk: EventCbk,
    type: string
}

export class Event {
    private static events: { [key: string]: EventEvent[] } = {};

    public static bindClick(cbk: EventCbk, obj: base.Component) {
        var type = "click";
        if (!this.events[type]) {
            this.events[type] = []
        }
        this.events[type].push({
            obj: obj,
            cbk: cbk,
            type: type
        });
    }

    public static bindDrag(cbk: EventCbk, obj: base.Component) {
        var type = "drag";
        if (!this.events[type]) {
            this.events[type] = []
        }
        this.events[type].push({
            obj: obj,
            cbk: cbk,
            type: type
        });
    }

    public static bindScale(cbk: EventCbk, obj: base.Component) {
        var type = "scale";
        if (!this.events[type]) {
            this.events[type] = []
        }
        this.events[type].push({
            obj: obj,
            cbk: cbk,
            type: type
        });
    }

    public static active(p: base.Point) {
        for (var type in this.events) {
            for (var key in this.events[type]) {
                this.events[type][key].obj.tryActive(p);
            }
        }
    }

    public static release() {
        for (var type in this.events) {
            for (var key in this.events[type]) {
                this.events[type][key].obj.active = false;
            }
        }
    }

    public static emitClick(x: number, y: number, active: boolean = false) {
        var p = new base.Point(x, y);
        var eobj: EventObject = {
            p: p,
            p0: p,
            op: p,
            detailX: x,
            detailY: y,
        }
        var type = "click";
        if (!this.events[type]) {
            return;
        }
        for (var key in this.events[type]) {
            var obj = this.events[type][key].obj;
            if (obj.active || active) {
                this.events[type][key].cbk.call(obj, eobj, obj);
            }
        }
    }

    public static emitDrag(eobj: EventObject, active: boolean = false) {
        var type = "drag";
        if (!this.events[type]) {
            return;
        }
        for (var key in this.events[type]) {
            var obj = this.events[type][key].obj;
            eobj.p && obj.tryActive(eobj.p)
            if (obj.active || active) {
                this.events[type][key].cbk.call(obj, eobj, obj);
            }
        }
    }

    public static emitScale(eobj: EventObject, active: boolean = false) {
        var type = "scale";
        if (!this.events[type]) {
            return;
        }
        for (var key in this.events[type]) {
            var obj = this.events[type][key].obj;
            eobj.p && obj.tryActive(eobj.p)
            if (obj.active || active) {
                this.events[type][key].cbk.call(obj, eobj, obj);
            }
        }
    }
}