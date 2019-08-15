import { base } from "./base";
export var event;
(function (event) {
    var events = {};
    event.TOUCH = "touch";
    event.TOUCH_UP = "touch_up";
    event.TOUCH_DOWN = "touch_down";
    event.TOUCH_MOVE = "touch_move";
    event.TOUCH_SCALE = "scale";
    function bind(type, cbk, target) {
        if (!events[type]) {
            events[type] = [];
        }
        events[type].push({
            type: type,
            target: target,
            data: undefined,
            cbk: cbk,
        });
    }
    event.bind = bind;
    function emit(type, data) {
        for (var key in events[type]) {
            var obj = events[type][key];
            obj.data = data;
            events[type][key].cbk.call(obj.target, obj);
        }
    }
    event.emit = emit;
    function emitComponent(type, data) {
        if (data["x"] === undefined || data["y"] === undefined)
            return;
        var p = new base.Point(data["x"], data["y"]);
        for (var key in events[type]) {
            var obj = events[type][key];
            obj.data = data;
            if (obj.target instanceof base.Component) {
                var cmp = obj.target;
                cmp.tryActive(p);
                if (cmp.active && cmp.visible) {
                    obj.cbk.call(obj.target, obj);
                }
                if (type === event.TOUCH_UP || type === event.TOUCH) {
                    cmp.active = false;
                }
            }
            obj.data = undefined;
        }
    }
    event.emitComponent = emitComponent;
    function cancel(type, cbk, target) {
        var index = -1;
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
    event.cancel = cancel;
})(event || (event = {}));
