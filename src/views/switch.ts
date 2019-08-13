import { base } from "../base/base"
import { event } from "../base/event"

export class Switch extends base.Component {
    public checked: boolean = false;
    public checkedColor: string = "#000000";
    public unCheckedColor: string = "#cccccc";

    protected init() {
        super.init();
        event.bind(event.TOUCH, this.onCheck, this);
    }

    public onCheck() {
        this.checked = !this.checked;
    }

    public onDraw(context: CanvasRenderingContext2D) {
        if (this.parent == null || !this.visible) return;
        super.onDraw(context);

        var box = this.box;
        context.beginPath();
        context.strokeStyle = this.unCheckedColor;

        if (this.borderWith == 0) {
            this.borderWith = 1;
        }
        context.lineWidth = this.borderWith;

        context.strokeRect(box.left, box.top, box.width, box.height);
        context.stroke();
        if (this.checked) {
            context.fillStyle = this.checkedColor;
            context.fillRect(box.left - box.height, box.top, box.height, box.height)
        } else {
            context.fillStyle = this.unCheckedColor;
            context.fillRect(box.left, box.top, box.height, box.height)
        }

    }

    public onDettach() {
        super.onDettach();
        event.cancel(event.TOUCH, this.onCheck, this);
    }
}