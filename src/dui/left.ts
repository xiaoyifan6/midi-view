import { base } from "../base/base"
import { Tone } from "../constant/data"
import { event } from "../base/event";

type HitArea = {
    rect: base.Rect,
    index: string
}

export class Left extends base.Component {
    public dh: number = 24;
    public offsetY: number = 0;
    public lineWidth: number = 0.4;
    public blackColor = "#000000";
    public whiteColor = "#ffffff";

    public keyColor: string = "#ff0000";
    private selectKey: { [key: string]: boolean } = {};

    public rects: HitArea[] = [];

    protected init() {
        super.init();
        this.borderColor = "#666666";
    }

    public onDraw(context: CanvasRenderingContext2D) {
        if (this.parent == null || !this.visible) return;
        super.onDraw(context);
        var j = 0;
        var box = this.box;
        context.fillStyle = this.blackColor;
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.lineWidth;

        this.rects = [];

        var yarr: {
            j: number,
            i: number
        }[] = [];
        let w = box.left + box.width;
        for (var i = 0; i < Tone.length; i++) {
            context.beginPath();
            var t = Tone[i]
            let y = this.offsetY + box.top + this.dh * j * box.sy;

            if (t.indexOf("#") >= 0) {
                yarr.push({
                    j: j,
                    i: i
                });
            } else {
                j++;
                if (y > box.bottom) break;
                var rect = new base.Rect(box.left, y, w, this.dh * box.sy);
                this.rects.push({
                    rect: rect,
                    index: t
                });
                if (this.selectKey[t]) {
                    context.fillStyle = this.keyColor;
                    context.fillRect(rect.x, rect.y, rect.width, rect.height);
                }

                context.strokeRect(rect.x, rect.y, rect.width, rect.height);

                if (/C[-]*[0-9]/.test(t) || this.dh >= 30) {
                    var tm = context.measureText(t);
                    context.strokeText(t, box.left + w - tm.width - 4, y + this.dh * box.sy * 2 / 3);
                }
                context.stroke();
            }

        }

        var p = 2;
        for (var i = 0; i < yarr.length; i++) {
            // y += this.dh * box.sy / 2;
            let y = this.offsetY + box.top + this.dh * (yarr[i].j - 0.5) * box.sy + p;
            w = box.left + box.width * 2 / 3;
            if (y > box.bottom) break;
            let t = Tone[yarr[i].i];
            if (this.selectKey[t]) {
                context.fillStyle = this.keyColor;
            } else {
                context.fillStyle = this.blackColor;
            }
            var rect = new base.Rect(box.left, y, w, this.dh * box.sy - p * 2);
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
            if (this.dh >= 30) {
                context.beginPath();
                context.strokeStyle = this.whiteColor;
                var tm = context.measureText(t);
                context.strokeText(t, box.left + 4, y + this.dh * box.sy * 2 / 3);
                context.stroke();
            }

            this.rects.push({
                rect: rect,
                index: t
            });
        }
        this.rects.reverse();
    }

    public hitKey(key: string, duration: number = 500) {
        this.selectKey[key] = true;
        var self = this;
        setTimeout(() => {
            delete self.selectKey[key];
            event.emit("refresh");
        }, duration);
    }

    public hit(x: number, y: number) {
        for (var i = 0; i < this.rects.length; i++) {
            if (this.rects[i].rect.contain2(x, y)) {
                this.hitKey(this.rects[i].index);
                return this.rects[i].index;
            }
        }
        return null;
    }
}