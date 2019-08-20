import { base } from "../base/base";
import { config } from "../constant/config";

export class Header extends base.Component {
    public dw: number = config.ui.hearder.dw;
    public position: number = 0;
    public offsetX: number = 0;
    public bate: number = config.ui.hearder.bate;
    public bpm: number = 0;
    public lineWidth: number = config.ui.hearder.lineWidth;
    public lineColor: string = "#000000";
    public textWidth: number = config.ui.hearder.textWidth;
    public textColor: string = "#000000";

    public indexColor: string = "#ff0000";
    public indexWidth: number = config.ui.hearder.indexWidth;

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
                context.strokeStyle = this.lineColor;
                context.lineWidth = this.lineWidth;
                context.moveTo(box.left + (this.offsetX + x) * box.sx, box.top)
                context.lineTo(box.left + (this.offsetX + x) * box.sx, box.top + this.height * box.sy)

                context.stroke();

                context.beginPath();
                context.strokeStyle = this.textColor;
                context.lineWidth = this.textWidth;

                context.strokeText(`${i / this.bate + 1}`, box.left + (this.offsetX + x) * box.sx + this.lineWidth * 4, box.top + box.height * 2 / 5);
            } else {
                context.strokeStyle = this.lineColor;
                context.lineWidth = this.lineWidth;
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