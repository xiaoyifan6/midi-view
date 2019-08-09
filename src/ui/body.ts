import { base } from "../base/rect"
import { ListView, MidiItem } from "./item";
import { Event, EventObject, EventCbk } from "../base/event"

export class Body extends base.Component {
    public dw: number = 8;
    // public dw2: number = 60;

    public offsetX: number = 0;
    public bate: number = 4;
    public bpm: number = 0;
    public position: number = 0;
    public lineWidth: number = 0.4;
    public lineColor: string = "#000000";
    public barColor: string = "#000000";

    public indexColor: string = "#ff0000";
    public indexWidth: number = 0.5;

    public listView: ListView;

    public duration: number = 0;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y, width, height);
        this.borderWith = 0;
        this.listView = new ListView(this, [], 60)
            .cbk(() => {
                var item = new MidiItem();
                // item.dw = this.dw2;
                item.dw = this.dw * this.bpm;
                return item;
            });
        this.listView.scrollBarWidth = 4;
    }

    public get contentHeight(): number {
        return this.listView.contentHeight;
    }

    public get contentWidth(): number {
        // return this.duration * this.dw2;
        return this.duration * this.bpm * this.dw;
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

    public setData(data: Array<any>) {
        this.listView.setData(data);
        this.listView.offsetY = 0;
        this.listView.offsetX = 0;
        this.offsetX = 0;
        this.position = 0;
        this.dw = 8;
        this.listView.refresh();
    }

    public onResize() {
        this.listView.refresh();
        super.onResize();
    }

    public onDraw(context: CanvasRenderingContext2D) {

        if (!this.parent) return

        context.save();
        super.onDraw(context);
        context.restore();

        var sx = this.getScaleX(this);
        var sy = this.getScaleX(this);
        var psx = this.getScaleX(this.parent);
        var psy = this.getScaleX(this.parent);

        var width = this.width * sx;
        var height = this.height * sy;

        var left = (this.parent.x + this.x) * psx;
        var top = (this.parent.y + this.y) * psy;

        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;

        for (var i = 0; i * this.dw * this.bate + this.offsetX < this.width; i++) {
            context.beginPath();
            context.moveTo(left + (this.offsetX + i * this.dw * this.bate) * sx, top)
            context.lineTo(left + (this.offsetX + i * this.dw * this.bate) * sx, top + height)
            context.stroke();
        }

        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(left + (this.offsetX + this.position * this.dw) * sx, top);
        context.lineTo(left + (this.offsetX + this.position * this.dw) * sx, top + height);
        context.stroke();

        if (this.height < this.contentHeight) {
            context.beginPath();
            context.fillStyle = this.barColor;
            context.fillRect(left + width * sx - 4, top - this.listView.offsetY * this.scrollSpeedY * sy, 4, this.scrollBarHeight * sy);
        }

        if (this.width < this.contentWidth) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(left, top + height * sy - 4, width * sx, 4)
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(left - this.listView.offsetX * this.scrollSpeedX * sx, top + height * sy - 4, this.scrollBarWidth * sx, 4);
        }
    }
}