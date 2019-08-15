var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Midi = require('@tonejs/midi').Midi;
var Tone = require('tone/Tone');
import { base } from "./base/base";
import { UI } from "./ui/ui";
import { event } from "./base/event";
import { clone } from "./base/util";
import { DUI } from "./dui/dui";
var MidiView = (function () {
    function MidiView(view) {
        this.eobj = { x: 0, y: 0, detailX: 0, detailY: 0, oldX: 0, oldY: 0, x0: 0, y0: 0 };
        this.active = false;
        this.keysMap = {};
        this.synths = [];
        this.startTime = 0;
        this.bpm = 2;
        this.view = view;
        this.canvas = this.view.querySelector("canvas");
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.view.appendChild(this.canvas);
        }
        var ctx = this.canvas.getContext("2d");
        if (ctx) {
            this.context = ctx;
        }
        else {
            throw "unsupport canvas 2d";
        }
        this.container = new base.Component();
        this.container.borderWith = 2;
        this.container.borderColor = "#cccccc";
        this.container.parent = new base.Component();
        this.ui = new UI(this.container);
        this.dui = new DUI(this.container);
        this.fit();
        this.bind();
        this.dui.hide();
    }
    MidiView.prototype.refresh = function () {
        this.container.onDraw(this.context);
    };
    MidiView.prototype.bind = function () {
        var _this = this;
        window.addEventListener("resize", this.fit.bind(this));
        this.canvas.addEventListener("mousedown", this.onDown.bind(this));
        this.canvas.addEventListener("mousemove", this.onMove.bind(this));
        this.canvas.addEventListener("mouseup", this.onUp.bind(this));
        this.canvas.addEventListener("mouseout", this.onUp.bind(this));
        this.canvas.addEventListener("wheel", this.onScroll.bind(this));
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
        this.canvas.addEventListener("position", this.onPosition.bind(this));
        event.bind("refresh", function (e) {
            _this.refresh();
        }, this);
        event.bind("show-detail", function (e) {
            _this.ui.hide();
            _this.dui.show();
            _this.dui.setNodesData(e.data);
            _this.refresh();
        }, this);
        event.bind("hide-detail", function (e) {
            _this.ui.show();
            _this.dui.hide();
            _this.refresh();
        }, this);
    };
    MidiView.prototype.onDown = function (e) {
        this.eobj.x = e.offsetX;
        this.eobj.y = e.offsetY;
        this.eobj.x0 = e.offsetX;
        this.eobj.y0 = e.offsetY;
        this.eobj.detailX = 0;
        this.eobj.detailY = 0;
        this.active = true;
        event.emitComponent(event.TOUCH_DOWN, clone(this.eobj));
        this.refresh();
    };
    MidiView.prototype.onMove = function (e) {
        this.eobj.oldX = this.eobj.x;
        this.eobj.oldY = this.eobj.y;
        this.eobj.x = e.offsetX;
        this.eobj.y = e.offsetY;
        this.eobj.detailX = this.eobj.x - this.eobj.oldX;
        this.eobj.detailY = this.eobj.y - this.eobj.oldY;
        if (this.active) {
            if (base.Point.distance(this.eobj.x, this.eobj.y, this.eobj.x0, this.eobj.y0) >= 5) {
                event.emitComponent(event.TOUCH_MOVE, clone(this.eobj));
            }
            this.refresh();
        }
    };
    MidiView.prototype.onUp = function (e) {
        this.eobj.oldX = this.eobj.x;
        this.eobj.oldY = this.eobj.y;
        this.eobj.x = e.offsetX;
        this.eobj.y = e.offsetY;
        this.eobj.detailX = this.eobj.x - this.eobj.oldX;
        this.eobj.detailY = this.eobj.y - this.eobj.oldY;
        if (base.Point.distance(this.eobj.x, this.eobj.y, this.eobj.x0, this.eobj.y0) < 5) {
            event.emitComponent(event.TOUCH, clone(this.eobj));
        }
        event.emitComponent(event.TOUCH_UP, clone(this.eobj));
        this.refresh();
        this.active = false;
    };
    MidiView.prototype.onScroll = function (e) {
        e = e || window.event;
        var detail = (e["wheelDelta"] || e["detail"] || 0) * 0.1;
        if (this.keysMap["ALT"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = 0;
            event.emitComponent(event.TOUCH_MOVE, clone(this.eobj));
        }
        else if (this.keysMap["SHIFT"] && this.keysMap["CONTROL"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = detail;
            event.emitComponent("scale", clone(this.eobj));
        }
        else if (this.keysMap["SHIFT"]) {
            this.eobj.detailX = 0;
            this.eobj.detailY = detail;
            event.emitComponent("scale", clone(this.eobj));
        }
        else if (this.keysMap["CONTROL"]) {
            this.eobj.detailX = detail;
            this.eobj.detailY = 0;
            event.emitComponent("scale", clone(this.eobj));
        }
        else {
            this.eobj.detailX = 0;
            this.eobj.detailY = detail;
            event.emitComponent(event.TOUCH_MOVE, clone(this.eobj));
        }
        this.refresh();
    };
    MidiView.prototype.onKeyDown = function (e) {
        if (e.altKey) {
            this.keysMap["ALT"] = true;
        }
        if (e.shiftKey) {
            this.keysMap["SHIFT"] = true;
        }
        if (e.ctrlKey) {
            this.keysMap["CONTROL"] = true;
        }
    };
    MidiView.prototype.onKeyUp = function (e) {
        var key = e.key.toUpperCase();
        delete this.keysMap[key];
    };
    MidiView.prototype.onPosition = function (e) {
        debugger;
    };
    MidiView.prototype.fit = function () {
        this.canvas.width = this.view.offsetWidth;
        this.canvas.height = this.view.offsetHeight;
        this.ui.resize(this.canvas.width, this.canvas.height);
        this.dui.resize(this.canvas.width, this.canvas.height);
        this.container.onResize();
        this.refresh();
    };
    Object.defineProperty(MidiView.prototype, "Tone", {
        get: function () {
            return Tone;
        },
        enumerable: true,
        configurable: true
    });
    MidiView.prototype.play = function () {
        var _this = this;
        this.stop();
        var self = this;
        var now = Tone.now() + 0.5;
        this.startTime = now;
        this.synths = [];
        var _loop_1 = function () {
            var track = this_1.data.tracks[i];
            if (track.notes.length) {
                var synth_1 = new Tone.PolySynth(4, Tone.Synth, {
                    envelope: {
                        attack: 0.02,
                        decay: 0.1,
                        sustain: 0.3,
                        release: 1
                    }
                }).toMaster();
                this_1.synths.push(synth_1);
                track.notes.forEach(function (note) {
                    synth_1.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
                });
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.data.tracks.length; i++) {
            _loop_1();
        }
        this.intervalIndex = setInterval(function () {
            self.ui.position = (Tone.now() - self.startTime) * _this.bpm;
            self.dui.position = (Tone.now() - self.startTime) * _this.bpm;
            self.refresh();
        }, 100);
    };
    MidiView.prototype.stop = function () {
        while (this.synths.length) {
            var synth = this.synths.shift();
            synth.dispose();
        }
        if (this.intervalIndex) {
            clearInterval(this.intervalIndex);
            this.intervalIndex = undefined;
        }
    };
    MidiView.prototype.loadFromUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.stop();
                        _a = this;
                        return [4, Midi.fromUrl(url)];
                    case 1:
                        _a.data = _b.sent();
                        if (this.data) {
                            if (this.data["header"]) {
                                if (this.data["header"]["tempos"] && this.data["header"]["tempos"][0]) {
                                    Tone.Transport.bpm.value = this.data["header"]["tempos"][0]["bpm"];
                                    this.bpm = 60 / (this.data["header"]["tempos"][0]["bpm"] || 120) * 4;
                                }
                                else {
                                    Tone.Transport.bpm.value = 120;
                                }
                                if (this.data["header"]["ppq"]) {
                                    Tone.Transport.PPQ = this.data["header"]["ppq"];
                                }
                            }
                            this.ui.setData(this.data);
                            this.dui.setData(this.data);
                            this.refresh();
                            console.log(this.data);
                        }
                        return [2];
                }
            });
        });
    };
    return MidiView;
}());
export { MidiView };
