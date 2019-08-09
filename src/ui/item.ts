import { base } from "../base/rect"
import { Tone, MusicalInstrumentData } from "../constant/data"

export class Item extends base.Component {

    protected data: any;
    public padding: number = 0;
    public recycle: boolean = true;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 60) {
        super(x, y, width, height)
    }

    public setData(data: any) {
        this.data = data;
    }

    public onDraw(context: CanvasRenderingContext2D) {
        if (this.recycle) return;
        super.onDraw(context);
    }
}

export class ListView {
    public offsetY: number = 0;
    public offsetX: number = 0;
    private data: Array<any>;
    public itemHeight: number;
    private container: base.Component;
    public views: Array<Item> = []
    private createItemCbk?: () => Item;
    public scrollBarWidth: number = 0;

    public constructor(container: base.Component, data: Array<any>, height: number) {
        this.data = data || [];
        this.itemHeight = height;
        this.container = container;
        this.refresh();
    }

    public setData(data: Array<any>) {
        this.data = data;
    }

    public get contentHeight() {
        return this.itemHeight * this.data.length;
    }

    public cbk(createItemCbk: () => Item): ListView {
        this.createItemCbk = createItemCbk;
        return this
    }

    public refresh() {
        if (!this.createItemCbk) return;

        var f = Math.floor(-this.offsetY / this.itemHeight);
        var i = f
        for (; i < this.data.length && (this.offsetY + i * this.itemHeight) < this.container.height; i++) {
            if (!this.views[i - f]) {
                this.views[i - f] = this.createItemCbk();
                this.container.addChild(this.views[i - f]);
            }
            var item = this.views[i - f];
            item.recycle = false;
            item.setData(this.data[i]);
            var sw = 0;
            if (this.container.height < this.contentHeight) {
                sw = this.scrollBarWidth;
            }
            item.set(0, this.offsetY + i * this.itemHeight, this.container.width - sw, this.itemHeight);
            item["offsetX"] = this.offsetX;
        }
        for (; i - f < this.views.length; i++) {
            if (this.views[i - f]) {
                this.views[i - f].recycle = true;
            }
        }
    }


}

export class MidiItem extends Item {
    public dw: number = 60;
    public offsetX: number = 0;
    public lineColor: string = "#000000";
    public lineWidth: number = 2;

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 60) {
        super(x, y, width, height);
        this.borderWith = 1;
        this.borderColor = "#666666";
    }

    public onDraw(context: CanvasRenderingContext2D) {
        if (this.recycle || !this.parent) return;
        super.onDraw(context);

        if (!this.data) return;

        var sx = this.getScaleX(this);
        var sy = this.getScaleX(this);
        var psx = this.getScaleX(this.parent);
        var psy = this.getScaleX(this.parent);

        var left = (this.parent.x + this.x) * psx;
        var top = (this.parent.y + this.y) * psy;
        var width = this.width * sx;
        var height = this.height * sy;

        var eh = height / Tone.length;

        context.strokeStyle = "#00ff00"; // dark

        context.lineWidth = 0.5;
        context.font = "14px";
        // instrument
        var s = (this.data["instrument"] || {})["number"] || "" + "";
        if (s) {
            var tm = context.measureText(s);
            context.strokeRect(left, top, tm.width * 2, 14);
            context.strokeText(s, left + tm.width / 2, top + 10);
        }

        var nodes = this.data.notes;
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor; // dark
        // 画音轨
        for (var j = 0; j < nodes.length; j++) {

            let node = nodes[j];
            context.beginPath();
            var yy = Tone.indexOf(node.name);
            context.moveTo(
                left + (node.time * this.dw + this.offsetX) * sx,
                top + eh * yy * sy
            );

            context.lineTo(
                left + ((node.time + node.duration) * this.dw + this.offsetX) * sx,
                top + eh * yy * sy
            );
            context.closePath();
            context.stroke();
        }
    }
}

export class HeadInfoItem extends Item {
    public textColor: string = "#000000";
    public font: string = "16px"

    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 60) {
        super(x, y, width, height);
        this.borderWith = 1;
        this.borderColor = "#aaaaaa";
    }

    public onDraw(context: CanvasRenderingContext2D) {
        if (this.recycle || !this.parent) return;
        super.onDraw(context);
        if (!this.data) return;

        var sx = this.getScaleX(this);
        var sy = this.getScaleX(this);
        var psx = this.getScaleX(this.parent);
        var psy = this.getScaleX(this.parent);

        var left = (this.parent.x + this.x) * psx;
        var top = (this.parent.y + this.y) * psy;
        var width = this.width * sx;
        var height = this.height * sy;

        context.strokeStyle = this.textColor;
        context.font = this.font;
        // instrument
        var s = (this.data["instrument"] || {})["number"];
        var arr = MusicalInstrumentData[s];
        if (arr && arr.length > 0) {
            // var tm = context.measureText(arr[1]);
            context.strokeText(arr[1], left + 4, top + height / 2, width);
        }
    }
}