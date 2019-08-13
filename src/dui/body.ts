import { base } from "../base/base"
import { Tone } from "../constant/data"

export class Body extends base.Component {
    public dh: number = 8;
    public dw: number = 8;
    public lineColor: string = "#cccccc";
    public lineWidth: number = 1;
    public barColor: string = "#000000";
    public hitColor: string = "#ff0000";

    public indexColor: string = "#ff0000";
    public indexWidth: number = 0.5;
    private rects: base.Rect[] = [];

    public offsetX: number = 0;
    public offsetY: number = 0;
    public nodes: any[] = [];
    public duration: number = 0;
    public bpm: number = 0;
    public position: number = 0;
    private paddingRight = 10;
    private hitIndex: number = -1;

    public setData(nodes: any[]) {
        this.nodes = nodes;

        this.offsetX = 0;
        this.offsetY = 0;
        this.position = 0;
        this.dw = 8;
        this.hitIndex = -1;
    }

    protected init() {
        super.init();
        this.borderWith = 0;
    }

    public get contentHeight(): number {
        return this.dh * Tone.length;
    }

    public get contentWidth(): number {
        // return this.duration * this.dw2;
        return this.duration * this.bpm * this.dw + this.paddingRight;
    }

    public get scrollHeight(): number {
        return this.contentHeight - this.height;
    }

    public get scrollWidth(): number {
        return this.contentWidth - this.width;
    }

    public get scrollBarHeight(): number {
        return this.height - this.scrollHeight < 10 ? 10 : (this.height - this.scrollHeight);
    }

    public get scrollSpeedY(): number {
        return (this.height - this.scrollBarHeight) / this.scrollHeight;
    }

    public get scrollBarWidth(): number {
        return this.width - this.scrollWidth < 10 ? 10 : (this.width - this.scrollWidth);
    }

    public get scrollSpeedX(): number {
        return (this.width - this.scrollBarWidth) / this.scrollWidth;
    }

    public onDraw(context: CanvasRenderingContext2D) {

        if (!this.parent) return

        super.onDraw(context);

        var box = this.box;

        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;

        for (var i = 0; i * this.dw + this.offsetX < this.width; i++) {
            context.beginPath();
            context.moveTo(box.left + (this.offsetX + i * this.dw) * box.sx, box.top)
            context.lineTo(box.left + (this.offsetX + i * this.dw) * box.sx, box.top + box.height)
            context.stroke();
        }

        for (var i = 0; i * this.dh + this.offsetY < this.height; i++) {
            context.beginPath();
            context.moveTo(box.left, box.top + (this.offsetY + i * this.dh) * box.sy)
            context.lineTo(box.left + box.width, box.top + + (this.offsetY + i * this.dh) * box.sy)
            context.stroke();
        }

        if (this.height < this.contentHeight) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(box.left + box.width * box.sx - 4, box.top, 4, box.height * box.sy)
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(box.left + box.width * box.sx - 4, box.top - this.offsetY * this.scrollSpeedY * box.sy, 4, this.scrollBarHeight * box.sy);
        }

        if (this.width < this.contentWidth) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(box.left, box.top + box.height * box.sy - 4, box.width * box.sx, 4)
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(box.left - this.offsetX * this.scrollSpeedX * box.sx, box.top + box.height * box.sy - 4, this.scrollBarWidth * box.sx, 4);
        }


        this.rects = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.hitIndex === i) {
                context.fillStyle = this.hitColor;
            } else {
                context.fillStyle = this.barColor;
            }
            let node = this.nodes[i];
            var yy = Tone.indexOf(node.name);
            let rect = new base.Rect(this.offsetX + box.left + node.time * this.dw * box.sx,
                this.offsetY + box.top + yy * this.dh * box.sy,
                node.duration * this.dw * box.sx,
                this.dh * box.sy);
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
            this.rects.push(rect);
        }

        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top);
        context.lineTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top + box.height);
        context.stroke();
    }

    public hit(x: number, y: number) {
        for (var i = 0; i < this.rects.length; i++) {
            if (this.rects[i].contain2(x, y)) {
                this.hitIndex = i;
                return this.nodes[i];
            }
        }
        return null;
    }
}