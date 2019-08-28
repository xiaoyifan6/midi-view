
import { test } from "./Test";
import { MidiView } from "./main"
import { base } from "./base/base"
import { config } from "./constant/config"

test()
// console.log("aaa");

var p = new base.Point()
p.x = 10
// console.log(p)

function initView(tag) {
    var view = <HTMLElement>document.querySelector(tag);
    if (view) {
        // var canvas = <HTMLCanvasElement>view.querySelector("canvas");
        // var ctx = canvas.getContext("2d")
        config.BUTTON_DOWN_DELAY = 200;
        config.BUTTON_OFFSET_X = 2;
        config.BUTTON_OFFSET_Y = 2;

        var midiView = new MidiView(view);
        window["midiView"] = midiView;
        return midiView;
    }
}

window["initView"] = initView;