
import { test } from "./Test";
import { MidiView } from "./main"
import { base } from "./base/rect"

test()
console.log("aaa");

var p = new base.Point()
p.x = 10
console.log(p)

function initView(tag) {
    var view = <HTMLElement>document.querySelector(tag);
    if (view) {
        // var canvas = <HTMLCanvasElement>view.querySelector("canvas");
        // var ctx = canvas.getContext("2d")
        var midiView = new MidiView(view);
        window["midiView"] = midiView;
        return midiView;
    }
}

window["initView"] = initView;