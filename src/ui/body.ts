import { base } from "../base/base"
import { ListView, MidiItem } from "./item";
import { config } from "../constant/config";

export class Body extends base.Component {
    public dw: number = config.ui.body.dw;
    private paddingRight = config.ui.body.paddingRight;
    // public dw2: number = 60;

    public offsetX: number = 0;
    public bate: number = config.ui.body.bate;
    public bpm: number = 0;
    public position: number = 0;
    public lineWidth: number = config.ui.body.lineWidth;
    public lineColor: string = "#000000";
    public barColor: string = "#000000";

    public indexColor: string = "#ff0000";
    public indexWidth: number = config.ui.body.indexWidth;

    public listView: ListView;

    public duration: number = 0;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y, width, height);
        this.borderWith = 0;
        this.listView = new ListView(this, [], config.ui.body.listView.itemHeight)
            .cbk(() => {
                var item = new MidiItem();
                // item.dw = this.dw2;
                item.dw = this.dw * this.bpm;
                return item;
            });
        this.listView.scrollBarWidth = config.ui.body.listView.scrollBarWidth;
    }

    public get contentHeight(): number {
        return this.listView.contentHeight;
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

    public setData(data: Array<any>) {
        this.listView.setData(data);
        this.listView.offsetY = 0;
        this.listView.offsetX = 0;
        this.offsetX = 0;
        this.position = 0;
        this.dw = config.ui.body.dw;
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

        var box = this.box;

        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;

        for (var i = 0; i * this.dw * this.bate + this.offsetX < this.width; i++) {
            context.beginPath();
            context.moveTo(box.left + (this.offsetX + i * this.dw * this.bate) * box.sx, box.top)
            context.lineTo(box.left + (this.offsetX + i * this.dw * this.bate) * box.sx, box.top + box.height)
            context.stroke();
        }

        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top);
        context.lineTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top + box.height);
        context.stroke();

        if (this.height < this.contentHeight) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(box.left + box.width * box.sx - config.DEFAULT_BAR_WIDTH, box.top, config.DEFAULT_BAR_WIDTH, box.height * box.sy)
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(box.left + box.width * box.sx - config.DEFAULT_BAR_WIDTH, box.top - this.listView.offsetY * this.scrollSpeedY * box.sy, config.DEFAULT_BAR_WIDTH, this.scrollBarHeight * box.sy);
        }

        if (this.width < this.contentWidth) {
            context.beginPath();
            context.strokeStyle = this.barColor;
            context.strokeRect(box.left, box.top + box.height * box.sy - config.DEFAULT_BAR_WIDTH, box.width * box.sx, config.DEFAULT_BAR_WIDTH)
            context.stroke();
            context.fillStyle = this.barColor;
            context.fillRect(box.left - this.listView.offsetX * this.scrollSpeedX * box.sx, box.top + box.height * box.sy - config.DEFAULT_BAR_WIDTH, this.scrollBarWidth * box.sx, config.DEFAULT_BAR_WIDTH);
        }
    }
}