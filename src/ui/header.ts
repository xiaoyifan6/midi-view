import { base } from "../base/rect"

export class Header extends base.Component {
    public dw: number = 8;
    public position: number = 0;
    public offsetX: number = 0;
    public bate: number = 4;
    public bpm: number = 0;
    public lineWidth: number = 0.4;
    public lineColor: string = "#000000";

    public indexColor: string = "#ff0000";
    public indexWidth: number = 0.5;

    public onDraw(context: CanvasRenderingContext2D) {
        super.onDraw(context);
        if (!this.parent) return

        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;

        var box = this.box;

        var i = 0;
        for (var x = 0; x + this.offsetX < this.width; x += this.dw) {
            context.beginPath();
            if (i % this.bate == 0) {
                context.moveTo(box.left + (this.offsetX + x) * box.sx, box.top)
                context.lineTo(box.left + (this.offsetX + x) * box.sx, box.top + this.height * box.sy)
                context.strokeText(`${i / this.bate + 1}`, box.left + (this.offsetX + x) * box.sx + this.lineWidth * 4, box.top + box.height * 2 / 5);
            } else {
                context.moveTo(box.left + (this.offsetX + x) * box.sx, box.top + box.height / 2)
                context.lineTo(box.left + (this.offsetX + x) * box.sx, box.top + box.height * 3 / 2)
            }
            context.stroke();
            i++;
        }

        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top);
        context.lineTo(box.left + (this.offsetX + this.position * this.dw) * box.sx, box.top + box.height);
        context.stroke();
    }


}