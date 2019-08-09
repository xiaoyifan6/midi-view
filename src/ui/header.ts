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

        var sx = this.getScaleX(this);
        var sy = this.getScaleX(this);
        var psx = this.getScaleX(this.parent);
        var psy = this.getScaleX(this.parent);

        var left = (this.parent.x + this.x) * psx;
        var top = (this.parent.y + this.y) * psy;

        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;

        var i = 0;
        for (var x = 0; x + this.offsetX < this.width; x += this.dw) {
            context.beginPath();
            if (i % this.bate == 0) {
                context.moveTo(left + (this.offsetX + x) * sx, top)
                context.lineTo(left + (this.offsetX + x) * sx, top + this.height * sy)
                context.strokeText(`${i / this.bate + 1}`, left + (this.offsetX + x) * sx + this.lineWidth * 4, top + this.height * sy * 2 / 5);
            } else {
                context.moveTo(left + (this.offsetX + x) * sx, top + this.height * sy / 2)
                context.lineTo(left + (this.offsetX + x) * sx, top + this.height * sy * 3 / 2)
            }
            context.stroke();
            i++;
        }

        context.beginPath();
        context.strokeStyle = this.indexColor;
        context.lineWidth = this.indexWidth;
        context.moveTo(left + (this.offsetX + this.position * this.dw) * sx, top);
        context.lineTo(left + (this.offsetX + this.position * this.dw) * sx, top + this.height * sy);
        context.stroke();
    }


}