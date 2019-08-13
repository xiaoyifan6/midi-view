import { base } from "../base/base"
import { event } from "../base/event"

export class Slider extends base.Component {
    public max: number = 100;
    public progress: number = 0;

    public lineWidth: number = 1;
    public bgColor1: string = "#cccccc";
    public bgColor2: string = "#000000";

    protected init() {
        super.init();
        event.bind(event.TOUCH_MOVE, this.onProcess, this);
    }

    public onProcess(eobj: event.EventObject) {
        var x = eobj.data["x"];
        this.progress = (x - this.x) / this.width * this.max;
    }

    private getProgressX(): number {
        return this.progress / this.max * this.width;
    }


    public onDraw(context: CanvasRenderingContext2D) {
        if (this.parent == null || !this.visible) return;

        var box = this.box;
        context.beginPath();
        context.strokeStyle = this.bgColor1;
        context.lineWidth = this.lineWidth;
        context.moveTo(box.left, box.top);
        context.moveTo(box.left + box.width, box.top);
        context.stroke();

        context.beginPath();
        context.strokeStyle = this.bgColor2;
        context.moveTo(box.left, box.top);
        context.moveTo(box.left + this.getProgressX() * box.sx, box.top);
    }
}