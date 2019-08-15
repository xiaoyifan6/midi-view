import { test } from "./Test";
import { MidiView } from "./main";
import { base } from "./base/base";
test();
console.log("aaa");
var p = new base.Point();
p.x = 10;
console.log(p);
function initView(tag) {
    var view = document.querySelector(tag);
    if (view) {
        var midiView = new MidiView(view);
        window["midiView"] = midiView;
        return midiView;
    }
}
window["initView"] = initView;
