import { base } from "../base/base"

export class Label extends base.Component {
    private _text: string = "";
    public textColor: string = "#000000";
    public font: string = "14px";
    public maxWidth?: number;
    public lineHeight: number = 20;
    public multyLine: boolean = false;

    public set text(_text: string) {
        this._text = _text;
    }

    public get text(): string {
        return this._text;
    }

    public onDraw(context: CanvasRenderingContext2D) {
        if (this.parent == null || !this.visible) return;
        super.onDraw(context);

        var box = this.box;

        context.beginPath();
        context.strokeStyle = this.textColor;
        context.font = this.font;
        var m = context.measureText(this._text);
        if (this.multyLine) {
            if (m.width <= this.width) {
                context.strokeText(this._text, box.left, box.top, this.maxWidth);
            } else {
                var dw = m.width / this._text.length;
                var len = Math.ceil(this.width / dw);
                for (var i = 0; i < len; i++) {
                    context.strokeText(this._text.substr(i * dw, dw), box.left, box.top + i * this.lineHeight, this.maxWidth);
                }
            }
        } else {
            context.strokeText(this._text, box.left + (box.width - m.width) / 2, box.top + box.height / 2 + 14 / 4);
        }
        context.stroke();
    }
}